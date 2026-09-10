// Run only against the isolated database and server described in docs/TESTING.md.
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.LMS_TEST_DATABASE_URL;
const base = process.env.LMS_TEST_BASE_URL || 'http://127.0.0.1:3107';
if (!connectionString || new URL(connectionString).hostname !== '127.0.0.1' || new URL(connectionString).port !== '55439' || new URL(base).hostname !== '127.0.0.1') throw new Error('Use the dedicated local test database on port 55439 and a local test server.');
const pool = new pg.Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
const suffix = Date.now();
const userIds = [], itemIds = [];
let courseId;
let checks = 0;
async function api(path, cookie, method = 'GET', body) {
  const response = await fetch(base + path, { method, headers: { ...(cookie ? { Cookie: cookie } : {}), 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
  const data = await response.json();
  return { status: response.status, data, cookie: response.headers.get('set-cookie')?.split(';')[0] };
}
function status(result, expected) { assert.equal(result.status, expected, JSON.stringify(result.data)); checks++; }
async function account(role, grade = 10, medium = 'ENGLISH') {
  const email = `test-${role}-${grade}-${medium}-${suffix}@example.com`;
  const user = await prisma.user.create({ data: { email, name: `Test ${role}`, role, grade, medium, password: await bcrypt.hash('Test-password-123', 10) } });
  userIds.push(user.id);
  const login = await api('/api/auth/login', null, 'POST', { email, password: 'Test-password-123' });
  status(login, 200); assert.ok(login.cookie);
  return { ...user, cookie: login.cookie };
}
try {
  status(await api('/api/classroom'), 401);
  status(await api('/api/auth/login', null, 'POST', { email: 'admin@ict.lk', password: 'arbitrary' }), 401);
  assert.equal(await prisma.user.count({ where: { email: 'admin@ict.lk' } }), 0); checks++;
  const admin = await account('ADMIN');
  const student = await account('STUDENT');
  for (const [path, cookie, heading] of [['/admin/classroom', admin.cookie, 'Bring your class together.'], ['/classroom', student.cookie, 'Your classroom, all in one place.']]) {
    const response = await fetch(base + path, { headers: { Cookie: cookie } });
    assert.equal(response.status, 200); assert.ok((await response.text()).includes(heading)); checks++;
  }
  const other = await account('STUDENT', 11);
  const sinhala = await account('STUDENT', 10, 'SINHALA');
  for (const path of ['courses', 'lessons', 'papers', 'quizzes', 'users']) status(await api(`/api/admin/${path}`, student.cookie), 403);
  status(await api('/api/admin/users', student.cookie, 'PATCH', { userId: student.id, role: 'ADMIN' }), 403);
  const activity = { kind: 'ASSIGNMENT', title: 'HTML practice', description: 'Build an accessible page.', grade: 10, medium: 'ENGLISH', maxPoints: 50, dueAt: '2026-01-01T10:00:00Z' };
  status(await api('/api/classroom', student.cookie, 'POST', activity), 403);
  status(await api('/api/classroom', admin.cookie, 'POST', { ...activity, grade: 99 }), 400);
  const created = await api('/api/classroom', admin.cookie, 'POST', activity); status(created, 201); itemIds.push(created.data.id);
  const itemId = created.data.id;
  const announcement = await api('/api/classroom', admin.cookie, 'POST', { ...activity, kind: 'ANNOUNCEMENT', title: 'Class reminder' }); status(announcement, 201); itemIds.push(announcement.data.id);
  const scheduled = await api('/api/classroom', admin.cookie, 'POST', { ...activity, kind: 'CLASS', dueAt: '2026-12-01T10:00:00Z', endsAt: '2026-12-01T11:00:00Z', meetingUrl: 'https://meet.google.com/test' }); status(scheduled, 201); itemIds.push(scheduled.data.id);
  const listed = await api('/api/classroom', student.cookie); status(listed, 200); assert.equal(listed.data.items.filter(i => itemIds.includes(i.id)).length, 3); checks++;
  for (const u of [other, sinhala]) {
    assert.equal((await api('/api/classroom', u.cookie)).data.items.some(i => i.id === itemId), false); checks++;
    status(await api('/api/classroom/submissions', u.cookie, 'POST', { itemId, content: 'forged' }), 404);
  }
  status(await api('/api/classroom/submissions', student.cookie, 'POST', { itemId, content: 'answer', attachmentUrl: 'javascript:alert(1)' }), 400);
  const submit = await api('/api/classroom/submissions', student.cookie, 'POST', { itemId, content: '<main>Hello ICT</main>', attachmentUrl: 'https://example.com/answer' }); status(submit, 201);
  status(await api('/api/classroom/submissions', student.cookie, 'POST', { itemId, content: 'overwrite' }), 409);
  status(await api('/api/classroom/submissions', student.cookie, 'PATCH', { id: submit.data.id, score: 50, feedback: 'forged' }), 403);
  status(await api('/api/classroom/submissions', admin.cookie, 'PATCH', { id: submit.data.id, score: 51, feedback: 'too high' }), 400);
  status(await api('/api/classroom/submissions', admin.cookie, 'PATCH', { id: submit.data.id, score: 43, feedback: 'Good semantic structure.' }), 200);
  const graded = (await api('/api/classroom', student.cookie)).data.items.find(i => i.id === itemId).submissions[0];
  assert.equal(graded.score, 43); assert.equal(graded.feedback, 'Good semantic structure.'); checks++;
  status(await api('/api/classroom', admin.cookie, 'PUT', { ...activity, id: itemId, title: 'Updated instructions' }), 200);
  status(await api('/api/classroom', admin.cookie, 'PUT', { ...activity, id: itemId, grade: 11 }), 400);
  const course = await prisma.course.create({ data: { title: 'Test course', grade: 10, medium: 'ENGLISH', category: 'Programming', description: 'Integration test', modules: { create: { title: 'Module', description: 'Test', lessons: { create: { title: 'Test lesson', sections: [] } } } }, quizzes: { create: { title: 'Test quiz', description: 'Test', grade: 10, medium: 'ENGLISH', questions: { create: { text: 'HTML means?', options: [{ id: 0, text: 'Hypertext Markup Language' }, { id: 1, text: 'Other' }], correctAnswers: [0], explanation: 'Markup language' } } } } }, include: { modules: { include: { lessons: true } }, quizzes: { include: { questions: true } } } });
  courseId = course.id;
  const lessonId = course.modules[0].lessons[0].id, quiz = course.quizzes[0];
  status(await api('/api/progress', other.cookie, 'POST', { lessonId }), 404);
  const completed = await Promise.all(Array.from({ length: 5 }, () => api('/api/progress', student.cookie, 'POST', { lessonId })));
  completed.forEach(r => status(r, 200));
  const me = (await api('/api/auth/me', student.cookie)).data.user;
  assert.equal(me.points, student.points + 25); assert.equal(me.completedLessonIds.filter(id => id === lessonId).length, 1); checks++;
  const publicQuiz = await api(`/api/quizzes?id=${quiz.id}`, student.cookie); status(publicQuiz, 200);
  assert.ok(!('correctAnswers' in publicQuiz.data.questions[0])); assert.ok(!('explanation' in publicQuiz.data.questions[0])); checks++;
  status(await api(`/api/quizzes?id=${quiz.id}`, other.cookie), 404);
  status(await api('/api/submit', student.cookie, 'POST', { quizId: quiz.id, answers: { [quiz.questions[0].id]: [99] } }), 400);
  const quizResult = await api('/api/submit', student.cookie, 'POST', { quizId: quiz.id, studentName: 'Forged name', answers: { [quiz.questions[0].id]: [0] }, timeSpentSeconds: 30 }); status(quizResult, 201);
  assert.equal(quizResult.data.scorePercentage, 100); assert.equal(quizResult.data.studentName, student.name); checks++;
  status(await api(`/api/results?id=${quizResult.data.id}`, student.cookie), 200);
  status(await api(`/api/results?id=${quizResult.data.id}`, other.cookie), 404);
  const profile = await api('/api/auth/me', student.cookie, 'PATCH', { name: 'Updated Student', email: student.email, role: 'ADMIN', grade: 13 }); status(profile, 200);
  assert.equal(profile.data.user.role, 'STUDENT'); assert.equal(profile.data.user.grade, 10); checks++;
  // A stale administrator token must not retain access after demotion.
  await prisma.user.update({ where: { id: admin.id }, data: { role: 'STUDENT' } });
  status(await api('/api/admin/users', admin.cookie), 403);
  status(await api('/api/classroom', admin.cookie, 'POST', activity), 403);
  await prisma.user.update({ where: { id: admin.id }, data: { role: 'ADMIN' } });
  status(await api(`/api/classroom?id=${itemId}`, admin.cookie, 'DELETE'), 200);
  assert.equal(await prisma.submission.count({ where: { itemId } }), 0); checks++;
  const logout = await api('/api/auth/logout', student.cookie, 'POST'); status(logout, 200);
  console.log(`PASS: ${checks} integration checks covering roles, cohorts, activities, grading, progress concurrency, quizzes, ownership, profile and logout.`);
} finally {
  await prisma.classroomItem.deleteMany({ where: { id: { in: itemIds } } });
  if (courseId) await prisma.course.delete({ where: { id: courseId } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  await prisma.$disconnect(); await pool.end();
}
