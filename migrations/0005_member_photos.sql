CREATE TABLE IF NOT EXISTS member_photos (
  key TEXT PRIMARY KEY,
  url TEXT NOT NULL
);

INSERT OR IGNORE INTO member_photos (key, url) VALUES
  ('fred', '/images/members/fred.jpg'),
  ('emmanuelle', '/images/members/emmanuelle.jpg'),
  ('marcel', '/images/members/marcel.jpg'),
  ('groupe', '/images/galerie/groupe.jpg');
