-- Shopping cart tables
CREATE TABLE IF NOT EXISTS public.shopping_cart (
  cart_id SERIAL PRIMARY KEY,
  account_id INTEGER REFERENCES public.account(account_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.cart_items (
  item_id SERIAL PRIMARY KEY,
  cart_id INTEGER REFERENCES public.shopping_cart(cart_id) ON DELETE CASCADE,
  inv_id INTEGER REFERENCES public.inventory(inv_id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);