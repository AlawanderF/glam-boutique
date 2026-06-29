-- ============================================================================
-- Glam Boutique — Schema do banco de dados
-- ----------------------------------------------------------------------------
-- Como usar no MySQL Workbench:
--   1. Abra o MySQL Workbench e conecte-se ao seu servidor MySQL local.
--   2. Vá em File > Open SQL Script... e selecione este arquivo (schema.sql).
--   3. Clique no ícone de raio (Execute) para rodar o script inteiro.
--   4. O banco "glam_boutique" e todas as tabelas serão criados automaticamente.
-- ============================================================================

CREATE DATABASE IF NOT EXISTS glam_boutique
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE glam_boutique;

-- ----------------------------------------------------------------------------
-- Clientes
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(180) NOT NULL,
  email         VARCHAR(180) NOT NULL UNIQUE,
  phone         VARCHAR(30),
  avatar_url    VARCHAR(500),
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Produtos
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sku             VARCHAR(40) NOT NULL UNIQUE,
  slug            VARCHAR(180) NOT NULL UNIQUE,
  name            VARCHAR(180) NOT NULL,
  brand           VARCHAR(120) NOT NULL,
  category_slug   VARCHAR(60) NOT NULL,
  price           DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2) NULL,
  stock           INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Pedidos (vendas)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_number    VARCHAR(20) NOT NULL UNIQUE,
  customer_id     INT UNSIGNED NULL,
  status          ENUM('processando','enviado','entregue','cancelado') NOT NULL DEFAULT 'processando',
  payment_method  VARCHAR(60) NOT NULL,
  subtotal        DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  shipping_cost   DECIMAL(10,2) NOT NULL DEFAULT 0,
  total           DECIMAL(10,2) NOT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  INDEX idx_orders_created_at (created_at)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Itens do pedido
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id      INT UNSIGNED NOT NULL,
  product_id    INT UNSIGNED NULL,
  product_name  VARCHAR(180) NOT NULL,
  unit_price    DECIMAL(10,2) NOT NULL,
  quantity      INT NOT NULL DEFAULT 1,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Saídas (despesas do negócio)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS expenses (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  description   VARCHAR(220) NOT NULL,
  category      ENUM('fornecedores','aluguel','marketing','salarios','logistica','impostos','outros') NOT NULL DEFAULT 'outros',
  amount        DECIMAL(10,2) NOT NULL,
  expense_date  DATE NOT NULL,
  paid          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Métodos de pagamento configuráveis pelo admin
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payment_methods (
  id                VARCHAR(40) PRIMARY KEY,
  label             VARCHAR(80) NOT NULL,
  enabled           BOOLEAN NOT NULL DEFAULT TRUE,
  discount_percent  DECIMAL(5,2) NULL,
  max_installments  TINYINT UNSIGNED NULL,
  is_custom         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- Page views (analytics de visitas — multi-usuário, ao contrário do tracking
-- local em localStorage usado no modo demonstração do frontend)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS page_views (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  session_id    VARCHAR(60) NOT NULL,
  path          VARCHAR(255) NOT NULL,
  device        ENUM('mobile','desktop') NOT NULL DEFAULT 'desktop',
  referrer      VARCHAR(255) NULL,
  viewed_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_page_views_viewed_at (viewed_at),
  INDEX idx_page_views_session (session_id)
) ENGINE=InnoDB;
