import { verifyToken } from './auth-utils';

export async function requireAuth(request: Request): Promise<{ authorized: boolean; username?: string }> {
  const authHeader = request.headers.get('Authorization');
  const cookie = request.headers.get('Cookie');
  
  let token: string | null = null;
  
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (cookie) {
    const match = cookie.match(/auth_token=([^;]+)/);
    if (match) {
      token = match[1];
    }
  }
  
  if (!token) {
    return { authorized: false };
  }
  
  const result = await verifyToken(token);
  
  if (!result.valid) {
    return { authorized: false };
  }
  
  return { authorized: true, username: result.username };
}

export function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function errorResponse(error: string, status = 400) {
  return jsonResponse({ success: false, error }, status);
}

export function successResponse(data?: unknown) {
  return jsonResponse({ success: true, data });
}
