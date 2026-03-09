// ─── Base64url helpers ─────────────────────────────────────────────────────

function base64urlEncode(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function base64urlDecode(str: string): Uint8Array {
  const padLen = (4 - (str.length % 4)) % 4;
  const padded = str.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(padLen);
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

// ─── Password hashing ──────────────────────────────────────────────────────

/**
 * PBKDF2-SHA256 password hashing.
 * Stored format in DB: `pbkdf2$<base64url-salt>$<base64url-hash>`
 */
export async function hashPassword(
  password: string,
  existingSalt?: string,
): Promise<{ hash: string; salt: string }> {
  const saltBytes: Uint8Array = existingSalt
    ? base64urlDecode(existingSalt)
    : (crypto.getRandomValues(new Uint8Array(16)) as unknown as Uint8Array);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: saltBytes.buffer as ArrayBuffer, iterations: 100_000, hash: "SHA-256" },
    keyMaterial,
    256,
  );

  return {
    hash: base64urlEncode(new Uint8Array(hashBuffer)),
    salt: base64urlEncode(saltBytes),
  };
}

/** Legacy SHA-256 without salt — used only for migration detection. */
async function legacySHA256(password: string): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(password),
  );
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Verify a password against a stored hash.
 * Supports new PBKDF2 format (`pbkdf2$salt$hash`) and legacy SHA-256 hex.
 * Returns `needsRehash = true` when the stored hash should be upgraded to PBKDF2.
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<{ valid: boolean; needsRehash: boolean }> {
  if (storedHash.startsWith("pbkdf2$")) {
    const [, salt, hash] = storedHash.split("$");
    const { hash: computed } = await hashPassword(password, salt);
    return { valid: computed === hash, needsRehash: false };
  }

  // Legacy SHA-256 path — trigger silent rehash on success
  const legacy = await legacySHA256(password);
  const valid = legacy === storedHash;
  return { valid, needsRehash: valid };
}

// ─── JWT (HMAC-SHA256) ─────────────────────────────────────────────────────

function getJwtSecret(): string {
  const secret = (globalThis as any).__WORKER_ENV__?.JWT_SECRET;
  if (!secret) {
    console.warn("[auth] JWT_SECRET not set — using insecure dev fallback");
    return "dev-secret-change-in-production";
  }
  return secret as string;
}

/** Generate a signed HMAC-SHA256 JWT valid for 24 hours. */
export async function generateToken(username: string): Promise<string> {
  const payload = {
    sub: username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86_400,
  };

  const payloadB64 = base64urlEncode(
    new TextEncoder().encode(JSON.stringify(payload)),
  );

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getJwtSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64),
  );

  return `${payloadB64}.${base64urlEncode(new Uint8Array(signature))}`;
}

/** Verify a HMAC-SHA256 JWT and return the username on success. */
export async function verifyToken(
  token: string,
): Promise<{ valid: boolean; username?: string }> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return { valid: false };
    const [payloadB64, sigB64] = parts;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(getJwtSecret()),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64urlDecode(sigB64).buffer as ArrayBuffer,
      new TextEncoder().encode(payloadB64),
    );

    if (!isValid) return { valid: false };

    const payloadStr = new TextDecoder().decode(base64urlDecode(payloadB64));
    const payload = JSON.parse(payloadStr) as { sub: string; exp: number };

    if (payload.exp < Math.floor(Date.now() / 1000)) return { valid: false };

    return { valid: true, username: payload.sub };
  } catch {
    return { valid: false };
  }
}
