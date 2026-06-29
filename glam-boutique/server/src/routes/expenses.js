import { Router } from 'express';
import { pool } from '../db.js';
import { requireAdminAuth } from './adminAuth.js';

export const expensesRouter = Router();

// GET /api/expenses — lista todas as saídas
expensesRouter.get('/', requireAdminAuth, async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM expenses ORDER BY expense_date DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao consultar saídas.', detail: error.message });
  }
});

// POST /api/expenses — cria uma nova saída
expensesRouter.post('/', requireAdminAuth, async (req, res) => {
  const { description, category, amount, expenseDate, paid = false } = req.body;

  if (!description || !category || !amount || !expenseDate) {
    return res.status(400).json({ error: 'Campos obrigatórios: description, category, amount, expenseDate.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO expenses (description, category, amount, expense_date, paid) VALUES (?, ?, ?, ?, ?)',
      [description, category, amount, expenseDate, paid]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar saída.', detail: error.message });
  }
});

// PATCH /api/expenses/:id — atualiza status de pagamento ou dados da saída
expensesRouter.patch('/:id', requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  const { paid, description, category, amount, expenseDate } = req.body;

  try {
    await pool.query(
      `UPDATE expenses SET
        paid = COALESCE(?, paid),
        description = COALESCE(?, description),
        category = COALESCE(?, category),
        amount = COALESCE(?, amount),
        expense_date = COALESCE(?, expense_date)
       WHERE id = ?`,
      [paid, description, category, amount, expenseDate, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar saída.', detail: error.message });
  }
});

// DELETE /api/expenses/:id — remove uma saída
expensesRouter.delete('/:id', requireAdminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM expenses WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover saída.', detail: error.message });
  }
});
