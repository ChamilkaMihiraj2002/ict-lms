# ICT tuition LMS

An ICT learning and tuition workspace for Grades 6–13, with English and Sinhala teaching cohorts. Built with Next.js, React, Prisma and PostgreSQL.

Students can study ordered lessons, watch videos, access papers, track completed lessons across devices, take automatically graded quizzes, submit assignments and read teacher feedback. The classroom includes announcements, scheduled classes, meeting links and calendar downloads.

Teachers use **Admin → Classroom & Assignments** to publish activities for a grade and medium, review student submissions and return marks. **Students** manages class grades, teaching medium and roles. Existing course, lesson, quiz and paper editors remain available.

## Project structure

Application code lives in `src/`: `app/` defines pages and API routes, `features/` groups LMS components and logic by domain, `components/` holds shared UI, and `server/` contains authentication and database access. The `@/` import alias resolves to `src/`.

Prisma files, public assets, scripts, tests and configuration stay at the project root. See [the folder structure guide](docs/FOLDER_STRUCTURE.md) for the directory tree and conventions.

## Local setup

Use Node.js 24+ and PostgreSQL. Copy `.env.example` to `.env` and configure `DATABASE_URL` and a random `JWT_SECRET`. The app and CLI must point to the same database; check for overrides in `.env.local`.

```sh
npm ci
npm run db:migrate
npm run dev
```

**Existing installations:** follow [the migration guide](docs/MIGRATIONS.md) before running `db:migrate`. An existing database created using `db push` needs to be baselined first.

To create your first teacher account, set `LMS_ADMIN_EMAIL`, `LMS_ADMIN_PASSWORD` and optionally `LMS_ADMIN_NAME` in your local environment, then run:

```sh
node scripts/create-admin.mjs
```

The command creates a new account only. It does not replace passwords or promote existing users. Students register at `/register`; teachers can adjust their grade and medium afterward. Login no longer creates an administrator from an arbitrary password.

## Classroom workflow

1. Open `/admin/classroom`, choose **Create activity**, then select Assignment, Scheduled class or Announcement.
2. Choose grade and medium, add instructions, and set the deadline or class times. Publishing makes it visible immediately to that cohort.
3. Students open `/classroom` to see their work, schedule and announcements. They submit an answer and optionally a shared file URL.
4. Expand an assignment’s submissions to award marks and return feedback. Students see their marks both on the assignment and under **My grades**, alongside quiz history.
5. Use **Download calendar** to import deadlines and classes into a calendar application. The file is a snapshot, not a live subscription.

Assignments allow one hand-in per student. Late work is accepted and labelled late. Published type, cohort and maximum marks cannot change; title, instructions and dates can be edited. Deleting an activity also deletes its submissions after confirmation. File attachments use links; students must grant their teacher access at the file provider. No files are uploaded to this application.

## Verification

```sh
npm run lint
npx tsc --noEmit
npm test
npm run build
```

If the environment cannot run Turbopack workers, `npm run build -- --webpack` builds the same app using Webpack. Google Fonts require network access during builds.

[Integration testing](docs/TESTING.md) covers permissions, cohort privacy, assignment grading, concurrent lesson completion, quiz results and profile changes using an isolated local database.

See the [application review and follow-up priorities](docs/APPLICATION_REVIEW.md) for the scope of this improvement and remaining tuition-management features.
