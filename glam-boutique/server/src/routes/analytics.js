import { Router } from 'express';
import { pool } from '../db.js';
import { requireAdminAuth } from './adminAuth.js';

export const analyticsRouter = Router();

// POST /api/analytics/pageview — registra uma visita real de qualquer visitante (rota pública)
analyticsRouter.post('/pageview', async (req, res) => {
  const { sessionId, path, device, referrer } = req.body;
  if (!sessionId || !path) {
    return res.status(400).json({ error: 'Campos obrigatórios: sessionId, path.' });
  }

  try {
    await pool.query(
      'INSERT INTO page_views (session_id, path, device, referrer) VALUES (?, ?, ?, ?)',
      [sessionId, path, device === 'mobile' ? 'mobile' : 'desktop', referrer ?? null]
    );
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar visita.', detail: error.message });
  }
});

// GET /api/analytics/summary?days=30 — totais consolidados de TODOS os visitantes
analyticsRouter.get('/summary', requireAdminAuth, async (req, res) => {
  const days = Math.min(Number(req.query.days) || 30, 180);
  try {
    const [[totals]] = await pool.query(
      `SELECT
         COUNT(*) AS total_views,
         COUNT(DISTINCT session_id) AS unique_sessions,
         SUM(device = 'mobile') AS mobile_views,
         SUM(device = 'desktop') AS desktop_views
       FROM page_views
       WHERE viewed_at >= (NOW() - INTERVAL ? DAY)`,
      [days]
    );
    const [topPages] = await pool.query(
      `SELECT path, COUNT(*) AS views
       FROM page_views
       WHERE viewed_at >= (NOW() - INTERVAL ? DAY)
       GROUP BY path
       ORDER BY views DESC
       LIMIT 10`,
      [days]
    );
    res.json({ totals, topPages });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao consultar analytics.', detail: error.message });
  }
});
