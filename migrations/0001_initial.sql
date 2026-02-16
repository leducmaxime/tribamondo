-- Migration 0001: Initial schema for TriBa MonDo admin
-- Tables: admin_users, concerts, youtube_videos

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Concerts table
CREATE TABLE IF NOT EXISTS concerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  venue TEXT NOT NULL,
  description TEXT,
  ticket_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- YouTube videos table
CREATE TABLE IF NOT EXISTS youtube_videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  youtube_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_concerts_date ON concerts(date);
CREATE INDEX IF NOT EXISTS idx_videos_order ON youtube_videos(order_index);

-- Seed default admin user
-- Password: admin123 (CHANGE IN PRODUCTION!)
-- Hash generated with Web Crypto API PBKDF2
INSERT INTO admin_users (username, password_hash) 
VALUES ('admin', 'pbkdf2:sha256:100000$randomsalt$hashedpassword')
ON CONFLICT(username) DO NOTHING;

-- Seed existing concerts data
INSERT INTO concerts (date, title, venue, description, ticket_url) VALUES
('2025-03-15', 'Festival des Cultures du Monde', 'Théâtre de la Ville, Paris', 
 'TriBa MonDo en ouverture du festival célébrant la diversité des musiques du monde avec des artistes venus des quatre coins de la planète.', 
 'https://exemple.com/billets/festival-cultures-2025'),
('2025-04-20', 'Nuit des Percussions', 'Salle Pleyel, Paris', 
 'Concert spécial percussions où TriBa MonDo partage la scène avec des ensembles de tambours africains et des percussionnistes contemporains.', 
 NULL)
ON CONFLICT DO NOTHING;

-- Seed existing YouTube videos data
INSERT INTO youtube_videos (youtube_id, title, type, description, order_index) VALUES
('7r7BP8fYack', 'Trøllabundin', 'Cover d''Eivør — Live 2024', 
 'Reprise envoûtante de la chanteuse féroïenne Eivør, réinterprétée à travers le prisme de la fusion world de TriBa MonDo.', 1),
('sPb259ECvVc', 'Itrun Nada', 'Live recording — Mai 2024', 
 'Une pièce captivante mêlant voix et percussions, explorant les thèmes de l''invisible et de la connexion spirituelle.', 2),
('0bLEQfcwAUY', 'Avenu Malkeinu', 'Live recording — Juillet 2024', 
 'Interprétation émouvante de ce chant liturgique hébraïque, porté par les voix et les rythmes du groupe dans une version fusion.', 3),
('u5N-YSBpz5E', 'La Rosa Enflorece', 'Live recording — Novembre 2025', 
 'Chant de la tradition judéo-espagnole (ladino), célébrant l''amour et la beauté à travers une mélodie intemporelle réinventée.', 4)
ON CONFLICT(youtube_id) DO NOTHING;
