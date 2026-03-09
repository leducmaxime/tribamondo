-- Migration 0002: Add gallery_photos and soundcloud_tracks tables
-- Tables for managing gallery photos and SoundCloud tracks

-- SoundCloud tracks table
CREATE TABLE IF NOT EXISTS soundcloud_tracks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Gallery photos table
CREATE TABLE IF NOT EXISTS gallery_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_soundcloud_order ON soundcloud_tracks(order_index);
CREATE INDEX IF NOT EXISTS idx_photos_order ON gallery_photos(order_index);
