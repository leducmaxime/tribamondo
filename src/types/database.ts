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

export interface YouTubeMusicTrack {
  id?: number;
  title: string;
  description?: string;
  url: string;
  order_index: number;
  created_at?: string;
}

export interface GalleryPhoto {
  id?: number;
  url: string;
  description?: string;
  order_index: number;
  created_at?: string;
}

export interface AuditLog {
  id?: number;
  username: string;
  action_type: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT";
  resource_type: "Concert" | "Video" | "YouTubeMusic" | "Photo" | "Interview" | "Auth";
  description: string;
  created_at: string;
}

export interface InterviewAnswer {
  name: string;
  text: string;
}

export interface Interview {
  id?: number;
  question: string;
  answers: InterviewAnswer[];
  order_index: number;
  created_at?: string;
}

export interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  MEDIA: R2Bucket;
  ENVIRONMENT?: string;
}
