import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const email = process.env.LMS_ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.LMS_ADMIN_PASSWORD;
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password || password.length < 12 || Buffer.byteLength(password) > 72) {
  throw new Error('Set LMS_ADMIN_EMAIL and LMS_ADMIN_PASSWORD (12 characters minimum, 72 UTF-8 bytes maximum).');
}
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
try {
  if (await prisma.user.findUnique({ where: { email } })) throw new Error('Account already exists. No credentials or roles were changed.');
  await prisma.user.create({ data: { email, name: process.env.LMS_ADMIN_NAME?.trim() || 'ICT Teacher', password: await bcrypt.hash(password, 12), role: 'ADMIN', grade: 13 } });
  console.log('Administrator created. Sign in with the credentials you supplied.');
} finally {
  await prisma.$disconnect(); await pool.end();
}
