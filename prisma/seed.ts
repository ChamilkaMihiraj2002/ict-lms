import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding NeonDB PostgreSQL database with English & Sinhala medium content & Papers...');

  const hashedAdminPassword = await bcrypt.hash('adminpassword123', 10);
  const hashedStudentPassword = await bcrypt.hash('password123', 10);

  // Admin User
  await prisma.user.upsert({
    where: { email: 'admin@ict.lk' },
    update: { password: hashedAdminPassword, role: 'ADMIN' },
    create: {
      name: 'System Admin',
      email: 'admin@ict.lk',
      password: hashedAdminPassword,
      role: 'ADMIN',
      grade: 13,
      medium: 'ENGLISH',
      points: 1000,
      streakDays: 30,
    },
  });

  // Default Student User (English Medium)
  await prisma.user.upsert({
    where: { email: 'alex.ict@school.lk' },
    update: { password: hashedStudentPassword },
    create: {
      name: 'Alex Perera',
      email: 'alex.ict@school.lk',
      password: hashedStudentPassword,
      role: 'STUDENT',
      grade: 10,
      medium: 'ENGLISH',
      points: 420,
      streakDays: 5,
    },
  });

  // Sinhala Medium Student User
  await prisma.user.upsert({
    where: { email: 'kavindi.si@school.lk' },
    update: { password: hashedStudentPassword },
    create: {
      name: 'කවින්දි ප්‍රනාන්දු',
      email: 'kavindi.si@school.lk',
      password: hashedStudentPassword,
      role: 'STUDENT',
      grade: 10,
      medium: 'SINHALA',
      points: 350,
      streakDays: 4,
    },
  });

  // English Medium Course - Grade 10
  const g10WebCourseEng = await prisma.course.upsert({
    where: { id: 'g10-web-dev-en' },
    update: {},
    create: {
      id: 'g10-web-dev-en',
      title: 'Grade 10 ICT: HTML5 & Web Development (English Medium)',
      grade: 10,
      medium: 'ENGLISH',
      category: 'Web Development',
      description: '# Course Overview\nMaster HTML5 elements, semantic structure, links, forms, and web layout.\n\n```html\n<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Welcome to Grade 10 ICT!</h1>\n  </body>\n</html>\n```',
      iconName: 'Code',
      bannerGradient: 'from-blue-600 to-cyan-500',
    },
  });

  // Sinhala Medium Course - Grade 10
  const g10WebCourseSin = await prisma.course.upsert({
    where: { id: 'g10-web-dev-si' },
    update: {},
    create: {
      id: 'g10-web-dev-si',
      title: '10 ශ්‍රේණිය ICT: HTML5 සහ වෙබ් අඩවි නිර්මාණය (සිංහල මාධ්‍යය)',
      grade: 10,
      medium: 'SINHALA',
      category: 'Web Development',
      description: '# පාඩම් මාලාව\nHTML5 ටැග්, වෙබ් අඩවි සැකැස්ම, පෝරම (Forms) සහ සබැඳි (Links) පිළිබඳ පූර්ණ දැනුම ලබා ගන්න.',
      iconName: 'Code',
      bannerGradient: 'from-purple-600 to-indigo-600',
    },
  });

  // Sample Past Papers (Grade 10 English & Sinhala)
  await prisma.paper.upsert({
    where: { id: 'paper-g10-en-2023' },
    update: {},
    create: {
      id: 'paper-g10-en-2023',
      title: '2023 Grade 10 ICT Model Evaluation Paper - Paper I & II (English)',
      grade: 10,
      medium: 'ENGLISH',
      year: 2023,
      driveUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing',
      description: 'National curriculum evaluation paper covering HTML, number systems, and hardware components.',
    },
  });

  await prisma.paper.upsert({
    where: { id: 'paper-g10-si-2023' },
    update: {},
    create: {
      id: 'paper-g10-si-2023',
      title: '2023 10 ශ්‍රේණිය ICT ආදර්ශ ප්‍රශ්න පත්‍රය (සිංහල මාධ්‍යය)',
      grade: 10,
      medium: 'SINHALA',
      year: 2023,
      driveUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing',
      description: 'HTML5, සංඛ්‍යා පද්ධති සහ දෘඩාංග පිළිබඳ පළමු හා දෙවන කොටස් ප්‍රශ්න පත්‍රය.',
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
