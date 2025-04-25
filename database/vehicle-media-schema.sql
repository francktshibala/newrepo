-- Vehicle media tables
CREATE TABLE IF NOT EXISTS public.vehicle_media (
  media_id SERIAL PRIMARY KEY,
  inv_id INTEGER REFERENCES public.inventory(inv_id) ON DELETE CASCADE,
  media_type VARCHAR(20) CHECK (media_type IN ('image', 'video', 'document')),
  media_url VARCHAR(255) NOT NULL,
  media_title VARCHAR(100),
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_vehicle_media_inv_id ON public.vehicle_media (inv_id);