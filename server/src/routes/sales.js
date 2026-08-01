import { Router } from 'express';
import { pool } from '../db.js';
import { requireAdminAuth } from './adminAuth.js';

export const salesRouter = Router();
salesRouter.use(requireAdminAuth);

// GET /api/sales/daily?days=30 — receita e pedidos agregados por dia
salesRouter.get('/daily', async (req, res) => {
  const days = Math.min(Number(req.query.days) || 30, 180);
  try {
    const [rows] = await pool.query(
      `SELECT DATE(created_at) AS date, SUM(total) AS revenue, COUNT(*) AS orders
       FROM orders
       WHERE created_at >= (CURDATE() - INTERVAL ? DAY)
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [days]
    );
    res.json(rows);
  } catch (error) {
    console.error('[sales.daily]', error);
    res.status(500).json({ error: 'Erro ao consultar vendas diárias.' });
  }
});

// GET /api/sales/orders — lista de pedidos recentes
salesRouter.get('/orders', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  try {
    const [rows] = await pool.query(
      `SELECT o.id, o.order_number, o.status, o.payment_method, o.total, o.created_at,
              c.full_name AS customer_name
       FROM orders o
       LEFT JOIN customers c ON c.id = o.customer_id
       ORDER BY o.created_at DESC
       LIMIT ?`,
      [limit]
    );
    res.json(rows);
  } catch (error) {
    console.error('[sales.orders]', error);
    res.status(500).json({ error: 'Erro ao consultar pedidos.' });
  }
});

// GET /api/sales/top-products — produtos mais vendidos por receita
salesRouter.get('/top-products', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT product_name, SUM(quantity) AS units_sold, SUM(quantity * unit_price) AS revenue
       FROM order_items
       GROUP BY product_name
       ORDER BY revenue DESC
       LIMIT 10`
    );
    res.json(rows);
  } catch (error) {
    console.error('[sales.top-products]', error);
    res.status(500).json({ error: 'Erro ao consultar produtos mais vendidos.' });
  }
});
