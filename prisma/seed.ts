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

  // Sinhala Medium Course - Grade 12 Number Systems
  const g12NumberSystemsCourse = await prisma.course.upsert({
    where: { id: 'g12-number-systems' },
    update: {},
    create: {
      id: 'g12-number-systems',
      title: '12 ශ්‍රේණිය ICT: පරිගණක විද්‍යාවේ සංඛ්‍යා පද්ධති (Number Systems)',
      grade: 12,
      medium: 'SINHALA',
      category: 'Hardware & Systems',
      description: 'දශමය, ද්විමය, අෂ්ටමය සහ ෂඩ්දශමය සංඛ්‍යා පද්ධති, පාදයන්, සංකේත සහ මූලික සංඛ්‍යා පද්ධති පරිවර්තන සවිස්තරාත්මකව ඉගෙන ගන්න.',
      iconName: 'Terminal',
      bannerGradient: 'from-cyan-600 to-indigo-600',
    },
  });

  // Module for Grade 12 Number Systems
  const g12Module = await prisma.module.upsert({
    where: { id: 'g12-m-ns' },
    update: {},
    create: {
      id: 'g12-m-ns',
      courseId: g12NumberSystemsCourse.id,
      title: 'මොඩියුලය 1: සංඛ්‍යා පද්ධති සහ පරිවර්තන (Number Systems & Conversions)',
      description: 'පරිගණක විද්‍යාවේදී භාවිතා වන ප්‍රධාන සංඛ්‍යා පද්ධති 4 සහ ඒවා අතර පරිවර්තන.',
      order: 1,
    },
  });

  // Lesson for Grade 12 Number Systems
  await prisma.lesson.upsert({
    where: { id: 'g12-ns-lesson-1' },
    update: {},
    create: {
      id: 'g12-ns-lesson-1',
      moduleId: g12Module.id,
      title: 'පරිගණක විද්‍යාවේ සංඛ්‍යා පද්ධති (Number Systems in Computing)',
      order: 1,
      durationMinutes: 25,
      sections: [
        {
          heading: 'සංඛ්‍යා පද්ධති හැඳින්වීම',
          text: `පරිගණකයක් තුළ දත්ත සැකසීම, ගබඩා කිරීම සහ තොරතුරු නිරූපණය කිරීම සඳහා විවිධ සංඛ්‍යා පද්ධති භාවිතා කරනු ලබයි. පරිගණකයට තේරුම් ගත හැක්කේ විදුලි සංඥා (0 සහ 1) පමණක් බැවින්, අප ලබා දෙන දත්ත පරිගණකයට තේරුම් ගත හැකි ආකෘතියකට පරිවර්තනය කළ යුතු වේ.

පරිගණක විද්‍යාවේදී ප්‍රධාන වශයෙන් භාවිතා වන සංඛ්‍යා පද්ධති 4ක් ඇත:
1. **දශමය සංඛ්‍යා පද්ධතිය (Decimal Number System)**
2. **ද්විමය සංඛ්‍යා පද්ධතිය (Binary Number System)**
3. **අෂ්ටමය සංඛ්‍යා පද්ධතිය (Octal Number System)**
4. **ෂඩ්දශමය සංඛ්‍යා පද්ධතිය (Hexadecimal Number System)**`,
        },
        {
          heading: '1. දශමය සංඛ්‍යා පද්ධතිය (Decimal Number System)',
          text: `මෙය අප එදිනෙදා ජීවිතයේදී සාමාන්‍ය ගණිත කර්ම සඳහා බහුලවම භාවිතා කරන සංඛ්‍යා පද්ධතියයි.
* **පාදය (Base/Radix):** 10
* **භාවිතා වන සංකේත (Digits):** 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 (සංකේත 10කි)
* **උදාහරණ:** 
  * 45<sub>10</sub>
  * 1250<sub>10</sub>`,
        },
        {
          heading: '2. ද්විමය සංඛ්‍යා පද්ධතිය (Binary Number System)',
          text: `පරිගණකයේ අභ්‍යන්තර ක්‍රියාකාරිත්වය සම්පූර්ණයෙන්ම රඳා පවතින්නේ මෙම ද්විමය පද්ධතිය මතයි. මෙහිදී දත්ත නිරූපණය කරන්නේ වෝල්ටීයතා මට්ටම් දෙකක් (ON = 1, OFF = 0) මගිනි.
* **පාදය (Base/Radix):** 2
* **භාවිතා වන සංකේත (Digits):** 0, 1 (සංකේත 2කි)
* **උදාහරණ:** 
  * 1011<sub>2</sub>
  * 110010<sub>2</sub>`,
        },
        {
          heading: '3. අෂ්ටමය සංඛ්‍යා පද්ධතිය (Octal Number System)',
          text: `දිගු ද්විමය සංඛ්‍යා කෙටි කර දැක්වීමට සහ පරිගණක මතක ලිපින (Memory addresses) නිරූපණය කිරීමට මෙය භාවිතා වේ.
* **පාදය (Base/Radix):** 8
* **භාවිතා වන සංකේත (Digits):** 0, 1, 2, 3, 4, 5, 6, 7 (සංකේත 8කි - මෙහි 8 සහ 9 භාවිතා නොවේ)
* **උදාහරණ:** 
  * 74<sub>8</sub>
  * 305<sub>8</sub>`,
        },
        {
          heading: '4. ෂඩ්දශමය සංඛ්‍යා පද්ධතිය (Hexadecimal Number System)',
          text: `අෂ්ටමය පද්ධතියට වඩා විශාල ද්විමය සංඛ්‍යා කෙටි කර දැක්වීමට මෙය බහුලව යොදා ගනී (උදා: MAC Addresses, IPv6, Color codes). මෙහිදී ඉලක්කම් 0-9 දක්වාත්, 10 සිට 15 දක්වා අගයන් ඉංග්‍රීසි හෝඩියේ අකුරු මගිනුත් දක්වයි.
* **පාදය (Base/Radix):** 16
* **භාවිතා වන සංකේත:** 0-9 දක්වා ඉලක්කම් සහ A, B, C, D, E, F අකුරු 6 (සමස්ත සංකේත 16කි).
  * A = 10, B = 11, C = 12, D = 13, E = 14, F = 15
* **උදාහරණ:** 
  * 9F<sub>16</sub>
  * 2A5C<sub>16</sub>

---

## සාරාංශ වගුව (Summary Table)

| සංඛ්‍යා පද්ධතිය | පාදය (Base) | භාවිතා වන සංකේත | උදාහරණයක් |
| :--- | :---: | :--- | :--- |
| **දශමය (Decimal)** | 10 | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 | 245<sub>10</sub> |
| **ද්විමය (Binary)** | 2 | 0, 1 | 10110<sub>2</sub> |
| **අෂ්ටමය (Octal)** | 8 | 0, 1, 2, 3, 4, 5, 6, 7 | 457<sub>8</sub> |
| **ෂඩ්දශමය (Hex)** | 16 | 0-9 සහ A, B, C, D, E, F | 1A3F<sub>16</sub> |`,
        },
        {
          heading: 'මූලික සංඛ්‍යා පද්ධති පරිවර්තන උදාහරණ (Basic Conversions)',
          text: `### 1. දශමය සංඛ්‍යා ද්විමය සංඛ්‍යා බවට පත් කිරීම (Decimal to Binary)
**උදාහරණය:** 13<sub>10</sub> ද්විමය අගයට හැරවීම.
* ක්‍රමය: 2න් බෙදා ඉතිරිය සටහන් කිරීම.
  * 13 ÷ 2 = 6 (ඉතිරිය 1)
  * 6 ÷ 2 = 3 (ඉතිරිය 0)
  * 3 ÷ 2 = 1 (ඉතිරිය 1)
  * 1 ÷ 2 = 0 (ඉතිරිය 1)
* ඉතිරිය පහළ සිට ඉහළට ලිවීමෙන් පිළිතුර ලබා ගනී.
* **පිළිතුර:** 1101<sub>2</sub>

### 2. ද්විමය සංඛ්‍යා දශමය සංඛ්‍යා බවට පත් කිරීම (Binary to Decimal)
**උදාහරණය:** 1011<sub>2</sub> දශමය අගයට හැරවීම.
* ක්‍රමය: එක් එක් සංකේතය එහි ස්ථානීය අගයෙන් (2හි බලයන්ගෙන්) ගුණ කිරීම.
  * = (1 × 2³) + (0 × 2²) + (1 × 2¹) + (1 × 2⁰)
  * = (1 × 8) + (0 × 4) + (1 × 2) + (1 × 1)
  * = 8 + 0 + 2 + 1
  * = 11
* **පිළිතුර:** 11<sub>10</sub>`,
        },
      ],
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
