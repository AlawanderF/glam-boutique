import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { checkDatabaseConnection } from './db.js';
import { adminAuthRouter } from './routes/adminAuth.js';
import { salesRouter } from './routes/sales.js';
import { expensesRouter } from './routes/expenses.js';
import { paymentMethodsRouter } from './routes/paymentMethods.js';
import { analyticsRouter } from './routes/analytics.js';

const app = express();
const PORT = process.env.PORT ?? 3333;

app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' }));
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

app.use('/api/admin', adminAuthRouter);
app.use('/api/sales', salesRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/payment-methods', paymentMethodsRouter);
app.use('/api/analytics', analyticsRouter);

// Handler de erro genérico — evita que o processo derrube em caso de erro não tratado.
app.use((err, _req, res, _next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

app.listen(PORT, () => {
  console.log(`Glam Boutique API rodando em http://localhost:${PORT}`);
  console.log(`Verifique a conexão com o MySQL em http://localhost:${PORT}/api/health/db`);
});
