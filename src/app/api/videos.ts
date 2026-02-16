import type { Env } from '@/types/database';
import type { YouTubeVideo } from '@/types/database';
import { requireAuth, jsonResponse, errorResponse, successResponse } from './middleware';

export async function handleVideos(request: Request, env: Env): Promise<Response> {
  const method = request.method;

  if (method === 'GET') {
    try {
      const result = await env.DB.prepare(
        'SELECT * FROM youtube_videos ORDER BY order_index ASC'
      ).all();

      return successResponse(result.results);
    } catch (error) {
      return errorResponse('Failed to fetch videos', 500);
    }
  }

  if (method === 'POST') {
    const auth = await requireAuth(request);
    if (!auth.authorized) {
      return errorResponse('Unauthorized', 401);
    }

    try {
      const body = await request.json() as YouTubeVideo;
      const { youtube_id, title, type, description, order_index } = body;

      if (!youtube_id || !title || !type) {
        return errorResponse('Missing required fields', 400);
      }

      const result = await env.DB.prepare(
        'INSERT INTO youtube_videos (youtube_id, title, type, description, order_index) VALUES (?, ?, ?, ?, ?)'
      ).bind(youtube_id, title, type, description || null, order_index || 0).run();

      return successResponse({ id: result.meta.last_row_id });
    } catch (error) {
      return errorResponse('Failed to create video', 500);
    }
  }

  return errorResponse('Method not allowed', 405);
}

export async function handleVideo(request: Request, env: Env, id: string): Promise<Response> {
  const videoId = parseInt(id);
  const method = request.method;

  if (isNaN(videoId)) {
    return errorResponse('Invalid video ID', 400);
  }

  if (method === 'GET') {
    try {
      const result = await env.DB.prepare(
        'SELECT * FROM youtube_videos WHERE id = ?'
      ).bind(videoId).first();

      if (!result) {
        return errorResponse('Video not found', 404);
      }

      return successResponse(result);
    } catch (error) {
      return errorResponse('Failed to fetch video', 500);
    }
  }

  if (method === 'PUT') {
    const auth = await requireAuth(request);
    if (!auth.authorized) {
      return errorResponse('Unauthorized', 401);
    }

    try {
      const body = await request.json() as YouTubeVideo;
      const { youtube_id, title, type, description, order_index } = body;

      if (!youtube_id || !title || !type) {
        return errorResponse('Missing required fields', 400);
      }

      const result = await env.DB.prepare(
        'UPDATE youtube_videos SET youtube_id = ?, title = ?, type = ?, description = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(youtube_id, title, type, description || null, order_index || 0, videoId).run();

      if (result.meta.changes === 0) {
        return errorResponse('Video not found', 404);
      }

      return successResponse({ id: videoId });
    } catch (error) {
      return errorResponse('Failed to update video', 500);
    }
  }

  if (method === 'DELETE') {
    const auth = await requireAuth(request);
    if (!auth.authorized) {
      return errorResponse('Unauthorized', 401);
    }

    try {
      const result = await env.DB.prepare(
        'DELETE FROM youtube_videos WHERE id = ?'
      ).bind(videoId).run();

      if (result.meta.changes === 0) {
        return errorResponse('Video not found', 404);
      }

      return successResponse({ id: videoId });
    } catch (error) {
      return errorResponse('Failed to delete video', 500);
    }
  }

  return errorResponse('Method not allowed', 405);
}
