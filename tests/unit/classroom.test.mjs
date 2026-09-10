import test from 'node:test';
import assert from 'node:assert/strict';
import { validateItem, safeWebUrl, submissionStatus, calendarFile } from '../../src/features/classroom/lib/classroom.ts';
import { gradeQuiz } from '../../src/features/quizzes/lib/grading.ts';

const assignment = { kind: 'ASSIGNMENT', title: 'Build a page', description: 'Use semantic HTML.', grade: 10, medium: 'ENGLISH', dueAt: '2026-09-12T10:00:00Z', maxPoints: 50 };
test('validates cohorts, marks, dates and required instructions', () => {
  assert.equal(validateItem(assignment).maxPoints, 50);
  for (const patch of [{ grade: 14 }, { grade: 6.5 }, { medium: 'OTHER' }, { maxPoints: -1 }, { maxPoints: 3.5 }, { title: ' ' }, { description: '' }, { dueAt: 'invalid' }, { kind: 'QUIZ' }]) assert.throws(() => validateItem({ ...assignment, ...patch }));
  assert.throws(() => validateItem({ ...assignment, kind: 'CLASS', endsAt: assignment.dueAt }));
  assert.equal(validateItem({ ...assignment, kind: 'ANNOUNCEMENT', dueAt: 'bad' }).dueAt, null);
});
test('rejects executable and credential-bearing links', () => {
  assert.equal(safeWebUrl('https://example.com/work'), 'https://example.com/work');
  assert.equal(safeWebUrl(''), null);
  for (const url of ['javascript:alert(1)', 'data:text/html,bad', 'file:///etc/passwd', 'https://user:pass@example.com', '//example.com']) assert.throws(() => safeWebUrl(url));
});
test('submitted and graded work is never counted as overdue', () => {
  const item = { ...assignment, submissions: [] };
  const now = Date.parse('2026-09-13T10:00:00Z');
  assert.equal(submissionStatus(item, now), 'Overdue');
  assert.equal(submissionStatus(item, now - 2 * 86400000), 'To do');
  assert.equal(submissionStatus({ ...item, submissions: [{}] }, now), 'Submitted');
  assert.equal(submissionStatus({ ...item, submissions: [{ gradedAt: '2026-09-13T09:00:00Z' }] }, now), 'Graded');
});
test('calendar export escapes text, folds Sinhala safely and uses UTC dates', () => {
  const title = 'සිංහල'.repeat(30) + ', HTML; next\nlesson';
  const ics = calendarFile([{ ...assignment, id: 'item-1', title, createdAt: assignment.dueAt, submissions: [] }]);
  assert.match(ics, /DTSTART:20260912T100000Z/);
  assert.match(ics.replace(/\r\n /g, ''), /\\, HTML\\; next\\nlesson/);
  assert.ok(ics.split('\r\n').every(line => Buffer.byteLength(line) <= 75));
  assert.ok(!ics.includes('\uFFFD'));
  assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
});
const questions = [{ id: 'q1', quizId: 'quiz', text: 'Choose two', type: 'multiple', options: [{ id: 0, text: 'A' }, { id: 1, text: 'B' }, { id: 2, text: 'C' }], correctAnswers: [0, 2], explanation: 'A and C' }, { id: 'q2', quizId: 'quiz', text: 'Choose one', type: 'single', options: [{ id: 0, text: 'Yes' }, { id: 1, text: 'No' }], correctAnswers: [1], explanation: 'No' }];
test('quiz grading compares sets and handles missing answers without mutation', () => {
  const answers = { q1: [2, 0], q2: [1] };
  const result = gradeQuiz(questions, answers, 70);
  assert.equal(result.scorePercentage, 100);
  assert.equal(result.passed, true);
  assert.deepEqual(answers.q1, [2, 0]);
  assert.equal(gradeQuiz(questions, {}, 70).scorePercentage, 0);
  assert.equal(gradeQuiz(questions, { q2: [1] }, 70).passed, false);
});
test('quiz grading rejects forged, duplicate and malformed selections', () => {
  for (const answers of [null, [], { bogus: [0] }, { q1: [0, 0] }, { q1: [99] }, { q1: ['0'] }, { q2: [0, 1] }, { q1: '0' }]) assert.throws(() => gradeQuiz(questions, answers, 70));
  assert.throws(() => gradeQuiz([], {}, 70));
});
