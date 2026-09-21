ALTER TABLE admins ADD COLUMN permissions text DEFAULT '' NOT NULL;
ALTER TABLE admins ADD COLUMN password_hash text;

CREATE TABLE IF NOT EXISTS articles (
  id text PRIMARY KEY NOT NULL,
  title text NOT NULL,
  description text DEFAULT '' NOT NULL,
  body text DEFAULT '' NOT NULL,
  image_key text,
  status text DEFAULT 'draft' NOT NULL,
  author_email text NOT NULL,
  published_at text,
  created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS articles_status_idx ON articles (status, published_at, created_at);
