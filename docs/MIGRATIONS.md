# Database migration guide

This change adds `ClassroomItem` and `Submission`. Existing users, courses, lessons and quiz results are preserved. Lesson progress continues using the existing `User.completedLessonIds` column, with an atomic completion award. No existing browser-local progress or quiz results are imported automatically because they are not verified server records.

The migration files were generated from the repository's original schema and tested on a separate local PostgreSQL database. Apply them to each installation before using the classroom features. The configured local development database was backed up, baselined, and migrated successfully on 2026-09-11; its schema matches Prisma and its existing table row counts were preserved.

## New empty database

Configure `DATABASE_URL`, then run:

```sh
npm run db:migrate
npx prisma generate
```

## Existing database without Prisma migration history

Back up the database first. Confirm that the database matches `prisma/migrations/20260910000000_baseline/migration.sql`; this baseline represents the schema before these changes. If the existing database differs, reconcile that difference in a staging copy first.

Mark the original schema as already applied, then apply the new classroom tables:

```sh
npx prisma migrate resolve --applied 20260910000000_baseline
npm run db:migrate
npx prisma generate
```

Do not execute the baseline SQL against populated tables. Do not use `migrate reset` on an existing installation. If the database already has migration history from another branch, reconcile that history before using these commands.

Deploy the application after the migration succeeds. The prior application can still use the database with the additional tables, so an application rollback does not require dropping classroom data.

## Authentication changes

`JWT_SECRET` is mandatory. All admin handlers check the current database role, so a demoted or deleted administrator cannot use a stale token to modify data. Students can edit their name and email; only administrators manage grade and medium. Login accepts bcrypt hashes only; legacy plain-text passwords need an administrator-managed reset before those accounts can sign in.

The old demo seed uses published demonstration passwords and can change existing demo records. It now requires `ALLOW_DEMO_SEED=true` and refuses production mode. Use it only in a disposable development database. The first real administrator should be provisioned with `scripts/create-admin.mjs`, which requires a supplied password and refuses to overwrite existing accounts.
