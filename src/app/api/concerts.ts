import type { Env } from '@/types/database';
import type { Concert } from '@/types/database';
import { requireAuth, jsonResponse, errorResponse, successResponse } from './middleware';

export async function handleConcerts(request: Request, env: Env): Promise<Response> {
  const method = request.method;

  if (method === 'GET') {
    try {
      const result = await env.DB.prepare(
        'SELECT * FROM concerts ORDER BY date ASC'
      ).all();

      return successResponse(result.results);
    } catch (error) {
      return errorResponse('Failed to fetch concerts', 500);
    }
  }

  if (method === 'POST') {
    const auth = await requireAuth(request);
    if (!auth.authorized) {
      return errorResponse('Unauthorized', 401);
    }

    try {
      const body = await request.json() as Concert;
      const { date, title, venue, description, ticket_url } = body;

      if (!date || !title || !venue) {
        return errorResponse('Missing required fields', 400);
      }

      const result = await env.DB.prepare(
        'INSERT INTO concerts (date, title, venue, description, ticket_url) VALUES (?, ?, ?, ?, ?)'
      ).bind(date, title, venue, description || null, ticket_url || null).run();

      return successResponse({ id: result.meta.last_row_id });
    } catch (error) {
      return errorResponse('Failed to create concert', 500);
    }
  }

  return errorResponse('Method not allowed', 405);
}

export async function handleConcert(request: Request, env: Env, id: string): Promise<Response> {
  const concertId = parseInt(id);
  const method = request.method;

  if (isNaN(concertId)) {
    return errorResponse('Invalid concert ID', 400);
  }

  if (method === 'GET') {
    try {
      const result = await env.DB.prepare(
        'SELECT * FROM concerts WHERE id = ?'
      ).bind(concertId).first();

      if (!result) {
        return errorResponse('Concert not found', 404);
      }

      return successResponse(result);
    } catch (error) {
      return errorResponse('Failed to fetch concert', 500);
    }
  }

  if (method === 'PUT') {
    const auth = await requireAuth(request);
    if (!auth.authorized) {
      return errorResponse('Unauthorized', 401);
    }

    try {
      const body = await request.json() as Concert;
      const { date, title, venue, description, ticket_url } = body;

      if (!date || !title || !venue) {
        return errorResponse('Missing required fields', 400);
      }

      const result = await env.DB.prepare(
        'UPDATE concerts SET date = ?, title = ?, venue = ?, description = ?, ticket_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(date, title, venue, description || null, ticket_url || null, concertId).run();

      if (result.meta.changes === 0) {
        return errorResponse('Concert not found', 404);
      }

      return successResponse({ id: concertId });
    } catch (error) {
      return errorResponse('Failed to update concert', 500);
    }
  }

  if (method === 'DELETE') {
    const auth = await requireAuth(request);
    if (!auth.authorized) {
      return errorResponse('Unauthorized', 401);
    }

    try {
      const result = await env.DB.prepare(
        'DELETE FROM concerts WHERE id = ?'
      ).bind(concertId).run();

      if (result.meta.changes === 0) {
        return errorResponse('Concert not found', 404);
      }

      return successResponse({ id: concertId });
    } catch (error) {
      return errorResponse('Failed to delete concert', 500);
    }
  }

  return errorResponse('Method not allowed', 405);
}
