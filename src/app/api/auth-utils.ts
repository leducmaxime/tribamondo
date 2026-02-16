export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

export async function generateToken(username: string): Promise<string> {
  const payload = {
    username,
    exp: Date.now() + (24 * 60 * 60 * 1000),
  };
  
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payload));
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const token = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `${Buffer.from(JSON.stringify(payload)).toString('base64')}.${token}`;
}

export async function verifyToken(token: string): Promise<{ valid: boolean; username?: string }> {
  try {
    const [payloadB64] = token.split('.');
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString());
    
    if (payload.exp < Date.now()) {
      return { valid: false };
    }
    
    return { valid: true, username: payload.username };
  } catch {
    return { valid: false };
  }
}
