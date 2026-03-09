-- Migration 0004: Add interviews table
-- Table for managing interview Q&A accordion on Le Groupe page

CREATE TABLE IF NOT EXISTS interviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  answers TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Answers is stored as JSON array: [{"name": "Marcel", "text": "..."}, ...]

CREATE INDEX IF NOT EXISTS idx_interviews_order ON interviews(order_index);
