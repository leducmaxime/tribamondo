import { verifyToken } from './auth-utils';
import type { Env } from '@/types/database';

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

export async function logAction(
  env: Env,
  username: string,
  actionType: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "FAILED_LOGIN",
  resourceType: "Concert" | "Video" | "YouTubeMusic" | "Photo" | "Interview" | "Auth" | "Groupe",
  description: string
) {
  try {
    await env.DB.prepare(
      "INSERT INTO audit_logs (username, action_type, resource_type, description) VALUES (?, ?, ?, ?)"
    )
      .bind(username, actionType, resourceType, description)
      .run();
  } catch (error) {
    console.error("Failed to log action", error);
  }
}
