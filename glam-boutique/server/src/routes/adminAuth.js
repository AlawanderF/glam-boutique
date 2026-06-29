import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const adminAuthRouter = Router();

const JWT_SECRET = process.env.ADMIN_JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

// POST /api/admin/login — autentica o admin e retorna um token JWT de curta duração.
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

  const passwordMatches = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!passwordMatches) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  }

  const token = jwt.sign({ role: 'admin', email: ADMIN_EMAIL }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, expiresIn: '8h' });
});

// Middleware para proteger rotas administrativas sensíveis (escrita em saídas/pagamentos).
export function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

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
