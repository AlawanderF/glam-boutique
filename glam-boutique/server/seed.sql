-- ============================================================================
-- Glam Boutique — Dados iniciais (seed)
-- Execute depois do schema.sql, da mesma forma: File > Open SQL Script no
-- MySQL Workbench, ou via "npm run db:seed" dentro da pasta server/.
-- ============================================================================

USE glam_boutique;

INSERT INTO payment_methods (id, label, enabled, discount_percent, max_installments, is_custom) VALUES
  ('pix', 'Pix', TRUE, 5.00, NULL, FALSE),
  ('cartao', 'Cartão de crédito', TRUE, NULL, 10, FALSE),
  ('boleto', 'Boleto bancário', TRUE, NULL, NULL, FALSE),
  ('carteira', 'Carteiras digitais', TRUE, NULL, NULL, FALSE)
ON DUPLICATE KEY UPDATE label = VALUES(label);

INSERT INTO customers (full_name, email, phone) VALUES
  ('Camila Rocha', 'camila.rocha@exemplo.com', '(83) 99999-0001'),
  ('Rafael Andrade', 'rafael.andrade@exemplo.com', '(83) 99999-0002')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

INSERT INTO products (sku, slug, name, brand, category_slug, price, compare_at_price, stock) VALUES
  ('GB-VST-0021', 'vestido-midi-alfaiataria-noir', 'Vestido Midi Alfaiataria', 'NOIR ATELIER', 'social', 489.90, 649.90, 24),
  ('GB-TEN-0450', 'tenis-runner-performance-branco', 'Tênis Runner Performance', 'BLANC & CO', 'esportivo', 349.90, NULL, 64)
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO orders (order_number, customer_id, status, payment_method, subtotal, discount_amount, shipping_cost, total) VALUES
  ('GB482910', 1, 'entregue', 'pix', 489.90, 24.50, 0.00, 465.40),
  ('GB471203', 2, 'enviado', 'cartao', 638.90, 0.00, 19.90, 658.80)
ON DUPLICATE KEY UPDATE status = VALUES(status);

INSERT INTO expenses (description, category, amount, expense_date, paid) VALUES
  ('Aluguel da loja - Centro, Guarabira', 'aluguel', 2200.00, '2026-06-05', TRUE),
  ('Compra de mercadoria - coleção inverno', 'fornecedores', 8450.00, '2026-06-08', TRUE),
  ('Campanha de tráfego pago - Instagram', 'marketing', 950.00, '2026-06-10', TRUE)
ON DUPLICATE KEY UPDATE amount = VALUES(amount);
