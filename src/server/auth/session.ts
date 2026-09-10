import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const COOKIE_NAME = 'ict_lms_token';

function jwtSecret() {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET must be configured');
  return new TextEncoder().encode(process.env.JWT_SECRET);
}

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  grade?: number;
  [key: string]: any;
}

/**
 * Sign a new JWT token with the given payload
 */
export async function createJWT(payload: JWTPayload, expiresIn: string = '7d'): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(jwtSecret());
}

/**
 * Verify a JWT token string
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, jwtSecret(), { algorithms: ['HS256'] });
    return payload as unknown as JWTPayload;
  } catch (err) {
    return null;
  }
}

/**
 * Get current session payload from cookies in server components or API routes
 */
export async function getAuthSession(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyJWT(token);
  } catch (err) {
    return null;
  }
}
