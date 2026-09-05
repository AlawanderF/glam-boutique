import { Router } from 'express';
import { pool } from '../db.js';
import { requireAdminAuth } from './adminAuth.js';

export const paymentMethodsRouter = Router();

// GET /api/payment-methods — lista todos os métodos configurados (rota pública: o checkout da loja precisa ler)
paymentMethodsRouter.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM payment_methods ORDER BY created_at ASC');
    res.json(rows);
  } catch (error) {
    console.error('[paymentMethods.GET]', error);
    res.status(500).json({ error: 'Erro ao consultar métodos de pagamento.' });
  }
});

// POST /api/payment-methods — cria um método customizado
paymentMethodsRouter.post('/', requireAdminAuth, async (req, res) => {
  const { label, discountPercent, maxInstallments } = req.body;
  if (!label) {
    return res.status(400).json({ error: 'O campo "label" é obrigatório.' });
  }

  // Validar discountPercent
  if (discountPercent !== undefined) {
    const discount = Number(discountPercent);
    if (isNaN(discount) || discount < 0 || discount > 100) {
      return res.status(400).json({ error: 'discountPercent deve ser 0-100' });
    }
  }

  // Validar maxInstallments
  if (maxInstallments !== undefined) {
    const installments = Number(maxInstallments);
    if (isNaN(installments) || installments < 1 || installments > 24) {
      return res.status(400).json({ error: 'maxInstallments deve ser 1-24' });
    }
  }

  const id = `custom-${Date.now()}`;
  try {
    await pool.query(
      'INSERT INTO payment_methods (id, label, enabled, discount_percent, max_installments, is_custom) VALUES (?, ?, TRUE, ?, ?, TRUE)',
      [id, label, discountPercent ?? null, maxInstallments ?? null]
    );
    res.status(201).json({ id });
  } catch (error) {
    console.error('[paymentMethods.POST]', error);
    res.status(500).json({ error: 'Erro ao criar método de pagamento.' });
  }
});

// PATCH /api/payment-methods/:id — atualiza (ativar/desativar, desconto, parcelas)
paymentMethodsRouter.patch('/:id', requireAdminAuth, async (req, res) => {
  const { enabled, discountPercent, maxInstallments, label } = req.body;
  try {
    await pool.query(
      `UPDATE payment_methods SET
        enabled = COALESCE(?, enabled),
        discount_percent = COALESCE(?, discount_percent),
        max_installments = COALESCE(?, max_installments),
        label = COALESCE(?, label)
       WHERE id = ?`,
      [enabled, discountPercent, maxInstallments, label, req.params.id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('[paymentMethods.PATCH]', error);
    res.status(500).json({ error: 'Erro ao atualizar método de pagamento.' });
  }
});

// DELETE /api/payment-methods/:id — remove um método customizado
paymentMethodsRouter.delete('/:id', requireAdminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM payment_methods WHERE id = ? AND is_custom = TRUE', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('[paymentMethods.DELETE]', error);
    res.status(500).json({ error: 'Erro ao remover método de pagamento.' });
  }
});
