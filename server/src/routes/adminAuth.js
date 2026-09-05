import { Router } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export const adminAuthRouter = Router();

const JWT_SECRET = process.env.ADMIN_JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const COOKIE_NAME = 'admin_token';
const COOKIE_MAX_AGE = 8 * 60 * 60 * 1000; // 8 hours in ms

// Cookie options for security
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: COOKIE_MAX_AGE,
  path: '/',
};

// POST /api/admin/login — autentica o admin e define um cookie HTTP-only.
adminAuthRouter.post('/login', async (req, res) => {
  if (!JWT_SECRET || !ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
    return res.status(500).json({
      error:
        'Variáveis de ambiente do admin não configuradas (ADMIN_EMAIL, ADMIN_PASSWORD_HASH, ADMIN_JWT_SECRET). Veja server/README.md.',
    });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Informe e-mail e senha.' });
  }

  if (email.trim().toLowerCase() !== ADMIN_EMAIL.trim().toLowerCase()) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  }

  const passwordMatches = await argon2.verify(ADMIN_PASSWORD_HASH, password);
  if (!passwordMatches) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  }

  const token = jwt.sign({ role: 'admin', email: ADMIN_EMAIL }, JWT_SECRET, { expiresIn: '8h' });

  // Set HTTP-only cookie instead of returning token in body
  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
  res.json({ success: true, expiresIn: '8h' });
});

// POST /api/admin/logout — limpa o cookie de autenticação.
adminAuthRouter.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  res.json({ success: true });
});

// GET /api/admin/verify — verifica se a sessão atual é válida (para frontend).
adminAuthRouter.get('/verify', (req, res) => {
  const token = req.cookies?.[COOKIE_NAME] ?? req.headers.authorization?.replace('Bearer ', '');

  if (!token || !JWT_SECRET) {
    return res.status(401).json({ valid: false, error: 'Sessão não encontrada.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, email: decoded.email });
  } catch {
    return res.status(401).json({ valid: false, error: 'Sessão expirada ou inválida.' });
  }
});

// Middleware para proteger rotas administrativas sensíveis (escrita em saídas/pagamentos).
export function requireAdminAuth(req, res, next) {
  // Try cookie first, fallback to Authorization header for backwards compatibility
  const token = req.cookies?.[COOKIE_NAME] ?? req.headers.authorization?.replace('Bearer ', '');

  if (!token || !JWT_SECRET) {
    return res.status(401).json({ error: 'Token de administrador ausente ou inválido.' });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token de administrador expirado ou inválido.' });
  }
}
