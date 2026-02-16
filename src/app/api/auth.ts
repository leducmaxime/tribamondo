import type { Env } from '@/types/database';
import { hashPassword, verifyPassword, generateToken } from './auth-utils';
import { jsonResponse, errorResponse, successResponse, requireAuth } from './middleware';

export async function handleLogin(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    const body = await request.json() as { username: string; password: string };
    const { username, password } = body;

    if (!username || !password) {
      return errorResponse('Username and password required', 400);
    }

    const result = await env.DB.prepare(
      'SELECT * FROM admin_users WHERE username = ?'
    ).bind(username).first();

    if (!result) {
      return errorResponse('Invalid credentials', 401);
    }

    const passwordHash = await hashPassword(password);
    
    if (passwordHash !== result.password_hash) {
      return errorResponse('Invalid credentials', 401);
    }

    const token = await generateToken(username);

    return new Response(JSON.stringify({ success: true, token }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `auth_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`,
      },
    });
  } catch (error) {
    return errorResponse('Login failed', 500);
  }
}

export async function handleLogout(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'auth_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
    },
  });
}

export async function handleAuthCheck(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'GET') {
    return errorResponse('Method not allowed', 405);
  }

  const auth = await requireAuth(request);

  return jsonResponse({
    authenticated: auth.authorized,
    username: auth.username,
  });
}
