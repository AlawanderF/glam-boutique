import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import 'dotenv/config';
import { checkDatabaseConnection } from './db.js';
import { adminAuthRouter } from './routes/adminAuth.js';
import { salesRouter } from './routes/sales.js';
import { expensesRouter } from './routes/expenses.js';
import { paymentMethodsRouter } from './routes/paymentMethods.js';
import { analyticsRouter } from './routes/analytics.js';

const app = express();
const PORT = process.env.PORT ?? 8000;

// Security headers
app.use(helmet());

// Rate limiting para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas
  message: { error: 'Muitas tentativas. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Global rate limiting — aplica a todas as rotas API.
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100, // 100 requests por IP por minuto
  message: { error: 'Muitas requisições. Tente novamente em um minuto.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors({
  origin: (origin, callback) => {
    const allowed = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean);
    // Permite requisições sem origin (curl, Postman, server-side) ou whitelisted origins.
    if (!origin || allowed.includes(origin)) return callback(null, true);
    callback(new Error(`Origin ${origin} não permitido por CORS`));
  },
}));
app.use(express.json());

// Health check — não depende do banco, útil para monitoramento/uptime checks.
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'glam-boutique-server' });
});

// Health check que de fato testa a conexão com o MySQL.
app.get('/api/health/db', async (_req, res) => {
  const isConnected = await checkDatabaseConnection();
  if (isConnected) {
    res.json({ status: 'ok', database: 'connected' });
  } else {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

// Aplicar rate limiting apenas na rota de login (antes do router)
app.use('/api/admin/login', loginLimiter);
// Aplicar rate limiting global a todas as rotas API.
app.use('/api', globalLimiter);
app.use('/api/admin', adminAuthRouter);
app.use('/api/sales', salesRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/payment-methods', paymentMethodsRouter);
app.use('/api/analytics', analyticsRouter);

// Handler de erro genérico — evita que o processo derrube em caso de erro não tratado.
// Loga internamente com id mas não vaza stack nem mensagem do MySQL pro cliente.
app.use((err, _req, res, _next) => {
  const errorId = `err-${Date.now().toString(36)}`;
  console.error(`[${errorId}]`, {
    message: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    timestamp: new Date().toISOString(),
  });
  res.status(500).json({ error: 'Erro interno do servidor.', errorId });
});

app.listen(Number(PORT), '0.0.0.0', () => {
  const msg = process.env.NODE_ENV === 'production'
    ? `Glam Boutique API online na porta ${PORT}`
    : `Glam Boutique API em http://localhost:${PORT}`;
  console.log(msg);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
