export interface Concert {
  id?: number;
  date: string;
  dayOfWeek?: string;
  time?: string;
  title: string;
  venue: string;
  address?: string;
  description?: string;
  price?: string;
  ticket_url?: string;
  image_url?: string;
  reservation_phone?: string;
  reservation_required?: number;
  created_at?: string;
  updated_at?: string;
}

export interface YouTubeVideo {
  id?: number;
  youtube_id: string;
  title: string;
  type: string;
  description?: string;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface SoundCloudTrack {
  id?: number;
  title: string;
  description?: string;
  url: string;
  order_index: number;
  created_at?: string;
}

export interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  MEDIA: R2Bucket;
  ENVIRONMENT?: string;
}
