export const ITEM_KINDS = ['ASSIGNMENT', 'ANNOUNCEMENT', 'CLASS'] as const;
export type ItemKind = typeof ITEM_KINDS[number];

export interface ClassroomSubmission {
  id: string;
  userId: string;
  content: string;
  attachmentUrl: string | null;
  submittedAt: string;
  score: number | null;
  feedback: string | null;
  gradedAt: string | null;
  user?: { name: string; email: string };
}

export interface ClassroomItem {
  id: string;
  kind: ItemKind;
  title: string;
  description: string;
  grade: number;
  medium: 'ENGLISH' | 'SINHALA';
  dueAt: string | null;
  endsAt: string | null;
  meetingUrl: string | null;
  maxPoints: number;
  createdAt: string;
  submissions: ClassroomSubmission[];
}

export function safeWebUrl(value: unknown): string | null {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string' || value.length > 2000) throw new Error('Use a valid https:// or http:// link.');
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error();
    return url.href;
  } catch { throw new Error('Use a valid https:// or http:// link.'); }
}

export function validateItem(body: Record<string, unknown>) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Provide a valid activity.');
  if (!ITEM_KINDS.includes(body.kind as ItemKind)) throw new Error('Choose a valid activity type.');
  if (typeof body.title !== 'string' || !body.title.trim() || body.title.length > 160) throw new Error('A title of 1–160 characters is required.');
  if (typeof body.description !== 'string' || !body.description.trim() || body.description.length > 10000) throw new Error('Instructions of 1–10,000 characters are required.');
  if (!Number.isInteger(body.grade) || Number(body.grade) < 6 || Number(body.grade) > 13) throw new Error('Choose a grade from 6 to 13.');
  if (body.medium !== 'ENGLISH' && body.medium !== 'SINHALA') throw new Error('Choose a teaching medium.');
  const kind = body.kind as ItemKind;
  const dueAt = kind !== 'ANNOUNCEMENT' && typeof body.dueAt === 'string' ? new Date(body.dueAt) : null;
  if (kind !== 'ANNOUNCEMENT' && (!dueAt || !Number.isFinite(dueAt.getTime()))) throw new Error('A valid date and time is required.');
  const endsAt = kind === 'CLASS' && typeof body.endsAt === 'string' ? new Date(body.endsAt) : null;
  if (kind === 'CLASS' && (!endsAt || !Number.isFinite(endsAt.getTime()) || endsAt <= dueAt!)) throw new Error('Class end must be after its start.');
  const maxPoints = kind === 'ASSIGNMENT' ? body.maxPoints : 100;
  if (!Number.isInteger(maxPoints) || Number(maxPoints) < 1 || Number(maxPoints) > 1000) throw new Error('Maximum marks must be from 1 to 1,000.');
  return { kind, title: body.title.trim(), description: body.description.trim(), grade: Number(body.grade), medium: body.medium as 'ENGLISH' | 'SINHALA',
    dueAt, endsAt, maxPoints: Number(maxPoints), meetingUrl: kind === 'CLASS' ? safeWebUrl(body.meetingUrl) : null };
}

export function submissionStatus(item: ClassroomItem, now = Date.now()) {
  const submission = item.submissions[0];
  if (submission?.gradedAt) return 'Graded';
  if (submission) return 'Submitted';
  if (item.dueAt && new Date(item.dueAt).getTime() < now) return 'Overdue';
  return 'To do';
}

export function calendarFile(items: ClassroomItem[]) {
  const escape = (s: string) => s.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
  const date = (s: string) => new Date(s).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ICT LMS//Classroom//EN', 'CALSCALE:GREGORIAN'];
  for (const item of items.filter(i => i.dueAt)) {
    lines.push('BEGIN:VEVENT', `UID:${item.id}@ict-lms`, `DTSTAMP:${date(item.createdAt)}`, `DTSTART:${date(item.dueAt!)}`);
    if (item.endsAt) lines.push(`DTEND:${date(item.endsAt)}`);
    lines.push(`SUMMARY:${escape(item.title)}`, `DESCRIPTION:${escape(item.description)}`);
    if (item.meetingUrl) lines.push(`URL:${escape(item.meetingUrl)}`);
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  // Fold at UTF-8 byte boundaries for calendar clients, including Sinhala titles.
  return lines.map(line => {
    let output = '', bytes = 0;
    for (const char of line) {
      const size = new TextEncoder().encode(char).length;
      if (bytes + size > 75) { output += '\r\n '; bytes = 1; }
      output += char; bytes += size;
    }
    return output;
  }).join('\r\n') + '\r\n';
}
