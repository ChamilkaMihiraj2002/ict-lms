# Folder structure

This repository is one Next.js application. Pages and HTTP endpoints live together under the App Router, while reusable LMS code is grouped by feature.

```text
ict-lms/
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login and registration routes
│   │   ├── (dashboard)/        # Student pages
│   │   ├── (admin)/admin/      # Teacher and administrator pages
│   │   ├── api/                # HTTP route handlers
│   │   ├── layout.tsx          # Root layout
│   │   ├── globals.css
│   │   └── favicon.ico
│   ├── features/
│   │   ├── auth/lib/           # Browser user storage
│   │   ├── classroom/
│   │   │   ├── components/     # Classroom hub and timeline
│   │   │   └── lib/            # Validation, status and calendar helpers
│   │   ├── courses/components/ # Course cards
│   │   └── quizzes/
│   │       ├── components/     # Question card and timer
│   │       └── lib/            # Quiz grading
│   ├── components/
│   │   ├── layout/             # Navigation, top bar and drawers
│   │   ├── providers/          # Application context providers
│   │   └── ui/                 # Shared modal, Markdown and theme controls
│   ├── server/
│   │   ├── auth/               # JWT sessions, authorization and API errors
│   │   └── db/                 # Prisma client and PostgreSQL adapter
│   ├── lib/                    # Shared formatting and Drive URL helpers
│   ├── types/                  # Shared TypeScript domain contracts
│   ├── data/                   # Existing demo data
│   └── proxy.ts               # Request authentication and redirects
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── public/                     # Static assets served by URL
├── tests/
│   ├── unit/                  # Validation and grading tests
│   └── integration/           # HTTP and database workflow tests
├── scripts/                    # Administrative CLI scripts
├── docs/                       # Setup, architecture and testing guides
├── .github/workflows/          # CI
└── …                           # Root configuration and package files
```

## Where new code belongs

- **Routes:** add pages, layouts and `route.ts` handlers under `src/app/`. Keep the existing route groups and URLs. As pages grow, extract reusable components and domain logic into their feature folder.
- **Features:** place code specific to an LMS domain under `src/features/<feature>/`. Create `components/`, `lib/`, hooks or type files only when there is code for them. For example, reusable paper components would belong under `src/features/papers/components/`.
- **Shared components:** use `src/components/ui/` for components with no LMS domain responsibility. A course card belongs to courses even when the dashboard also renders it.
- **Server code:** keep database access, secrets and session authorization under `src/server/`. Import these modules only from server execution paths, such as route handlers, server components and the request proxy. The folder name itself does not enforce this boundary.
- **Browser state:** `src/features/auth/lib/user-storage.ts` manages the cached user in local storage. Server authorization remains in `src/server/auth/`.
- **Shared helpers and types:** use `src/lib/` for helpers used across domains and `src/types/` for shared contracts. Keep feature-specific helpers beside their feature.
- **Data:** `src/data/demo.ts` preserves the existing sample data; PostgreSQL and Prisma remain the source of persisted application data.
- **Tests:** put database-independent tests in `tests/unit/` and workflows that require the isolated app and PostgreSQL in `tests/integration/`. See [TESTING.md](TESTING.md).

## Imports and tooling

`@/` resolves to `src/`, for example:

```ts
import { CourseCard } from '@/features/courses/components/CourseCard';
import { getStoredUser } from '@/features/auth/lib/user-storage';
import { prisma } from '@/server/db/prisma'; // Server execution paths only
```

Use direct imports so dependencies are visible. Node-based tests use relative paths with `.ts` extensions for runtime imports because Node does not resolve the TypeScript `@/` alias. Type-only imports are erased.

Keep `public/`, `prisma/`, environment files and framework configuration at the repository root. `src/proxy.ts` sits alongside `src/app/`. Global CSS and the favicon stay in the App Router directory.

The normal commands remain `npm run dev`, `npm run lint`, `npm test`, `npm run test:integration` and `npm run build`.
