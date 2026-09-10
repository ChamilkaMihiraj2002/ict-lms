# Testing the LMS

`npm test` runs six unit tests for classroom validation, unsafe links, submission state, calendar encoding (including Sinhala), set-based quiz grading and malformed answers. Node.js 24+ runs TypeScript stripping without adding a test framework.

## Isolated integration tests

Use a dedicated temporary PostgreSQL cluster listening on `127.0.0.1:55439`. Never point these tests at a real tuition database. The script rejects other database hosts and ports, creates uniquely named fixtures, and removes its fixtures afterward. It expects no pre-existing `admin@ict.lk` account.

Example with local PostgreSQL tools (substitute your local database username):

```sh
initdb -D /tmp/ict-lms-test-pg -A trust --no-locale -E UTF8
pg_ctl -D /tmp/ict-lms-test-pg -l /tmp/ict-lms-test-pg.log -o '-p 55439 -h 127.0.0.1 -k /tmp' start
DATABASE_URL=postgresql://YOUR_USER@127.0.0.1:55439/postgres npm run db:migrate
```

Start an isolated server in a separate terminal:

```sh
NEXT_BUILD_DIR=.next-test DATABASE_URL=postgresql://YOUR_USER@127.0.0.1:55439/postgres JWT_SECRET=local-test-only-secret npm run dev -- --webpack --hostname 127.0.0.1 --port 3107
```

Then run:

```sh
LMS_TEST_DATABASE_URL=postgresql://YOUR_USER@127.0.0.1:55439/postgres npm run test:integration
```

The integration script checks unauthenticated access; student restrictions on admin routes; stale administrator tokens after demotion; grade and medium isolation; assignment, announcement and class creation; duplicate and invalid submissions; grade limits; teacher feedback; editing constraints; private quiz results; answer-key exclusion; server-side quiz grading; five simultaneous completion requests awarding points once; profile restrictions; and logout. Stop the test server, then stop the temporary cluster with `pg_ctl -D /tmp/ict-lms-test-pg stop`.

## Manual interface checks

In a disposable database, sign in separately as a teacher and a student in the same cohort. Verify activity creation/edit/delete, assignment hand-in, feedback, a scheduled class link, calendar import and quiz-result navigation. Repeat at a narrow mobile width, in light and dark themes, and with keyboard-only modal navigation. Verify that network failures display an error without falsely reporting a successful save.

Automated integration tests exercise real HTTP handlers and PostgreSQL. They do not replace visual browser testing. The in-app browser execution tool was unavailable in this session, and the fallback desktop connection did not respond, so visual QA remains a manual check.
