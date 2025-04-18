-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  review_id INT GENERATED BY DEFAULT AS IDENTITY,
  review_text TEXT NOT NULL,
  review_rating INT NOT NULL CHECK (review_rating BETWEEN 1 AND 5),
  review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  inv_id INT NOT NULL,
  account_id INT NOT NULL,
  CONSTRAINT reviews_pk PRIMARY KEY (review_id),
  CONSTRAINT reviews_inventory_fk FOREIGN KEY (inv_id) REFERENCES public.inventory (inv_id) ON DELETE CASCADE,
  CONSTRAINT reviews_account_fk FOREIGN KEY (account_id) REFERENCES public.account (account_id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_reviews_inv_id ON public.reviews (inv_id);
CREATE INDEX IF NOT EXISTS idx_reviews_account_id ON public.reviews (account_id);