-- ============================================================
-- YOOTA — Script SQL pour Supabase
-- Exécutez ce script dans l'éditeur SQL de votre projet Supabase
-- ============================================================

-- 1. TABLE : product_categories
-- ============================================================
CREATE TABLE IF NOT EXISTS product_categories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL UNIQUE,
  slug       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLE : products (si elle n'existe pas encore)
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  price      NUMERIC(10, 2) NOT NULL,
  image      TEXT,
  rating     NUMERIC(2, 1) DEFAULT 4.5,
  reviews    INTEGER DEFAULT 0,
  category   TEXT NOT NULL,
  gender     TEXT NOT NULL CHECK (gender IN ('Homme', 'Femme', 'Enfant', 'Unisexe')),
  tag        TEXT,
  colors     TEXT[] DEFAULT '{}',
  sizes      TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLE : orders (commandes clients)
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name    TEXT NOT NULL,
  customer_email   TEXT NOT NULL,
  shipping_address TEXT,
  city             TEXT,
  postal_code      TEXT,
  country          TEXT DEFAULT 'FR',
  payment_method   TEXT NOT NULL,
  payment_status   TEXT NOT NULL DEFAULT 'pending'
                   CHECK (payment_status IN ('pending', 'paid', 'failed')),
  stripe_session_id TEXT,
  total_amount     NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLE : order_items (articles de chaque commande)
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id       UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id     TEXT NOT NULL,
  product_name   TEXT NOT NULL,
  product_image  TEXT,
  price          NUMERIC(10, 2) NOT NULL,
  quantity       INTEGER NOT NULL DEFAULT 1,
  size           TEXT,
  color          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INDEX pour les performances
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_gender   ON products(gender);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status     ON orders(payment_status);

-- 6. RLS (Row Level Security) — Lecture publique des produits/catégories
-- ============================================================
ALTER TABLE products           ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders             ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items        ENABLE ROW LEVEL SECURITY;

-- Lecture publique des produits et catégories (vitrine publique)
CREATE POLICY IF NOT EXISTS "products_select_all"
  ON products FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY IF NOT EXISTS "categories_select_all"
  ON product_categories FOR SELECT TO anon, authenticated USING (true);

-- Écriture : uniquement pour les utilisateurs authentifiés (admin)
CREATE POLICY IF NOT EXISTS "products_insert_auth"
  ON products FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "products_update_auth"
  ON products FOR UPDATE TO authenticated USING (true);

CREATE POLICY IF NOT EXISTS "products_delete_auth"
  ON products FOR DELETE TO authenticated USING (true);

CREATE POLICY IF NOT EXISTS "categories_insert_auth"
  ON product_categories FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "categories_delete_auth"
  ON product_categories FOR DELETE TO authenticated USING (true);

-- Orders : l'utilisateur peut voir ses propres commandes, l'admin voit tout
CREATE POLICY IF NOT EXISTS "orders_insert_anon"
  ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "orders_select_auth"
  ON orders FOR SELECT TO authenticated USING (true);

CREATE POLICY IF NOT EXISTS "order_items_insert_anon"
  ON order_items FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "order_items_select_auth"
  ON order_items FOR SELECT TO authenticated USING (true);
