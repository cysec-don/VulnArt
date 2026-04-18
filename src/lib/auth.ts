import { db } from './db';
import { compare, hash } from 'bcryptjs';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

const SESSION_COOKIE = 'vulnart_session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return compare(password, passwordHash);
}

export async function createSession(userId: string): Promise<string> {
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
}

export async function getSessionUser(): Promise<{
  id: string;
  username: string;
  email: string;
  role: string;
  name: string | null;
  balance: number;
} | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (!token) return null;

    const session = await db.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session) return null;
    if (session.expiresAt < new Date()) {
      await db.session.delete({ where: { id: session.id } });
      return null;
    }

    return {
      id: session.user.id,
      username: session.user.username,
      email: session.user.email,
      role: session.user.role,
      name: session.user.name,
      balance: session.user.balance,
    };
  } catch {
    return null;
  }
}

export function setSessionCookie(token: string): string {
  const expires = new Date(Date.now() + SESSION_DURATION_MS);
  return `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; Expires=${expires.toUTCString()}; SameSite=Lax`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

export { SESSION_COOKIE };
