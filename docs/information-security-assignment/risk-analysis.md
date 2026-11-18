# Security Risk Analysis and Control Plan

## 1. Purpose and scope

This analysis considers the ICT LMS web application and the data it processes. The scope includes the browser, Next.js pages and API routes, authentication and authorization, the Prisma/PostgreSQL data store, administrator functions, and links to external learning resources. It focuses on confidentiality, integrity, and availability of student and teaching data.

The review is based on source inspection, including [`src/server/auth/session.ts`](../../src/server/auth/session.ts), [`src/server/auth/authorization.ts`](../../src/server/auth/authorization.ts), [`src/proxy.ts`](../../src/proxy.ts), the API routes under [`src/app/api`](../../src/app/api), [`src/components/ui/MarkdownRenderer.tsx`](../../src/components/ui/MarkdownRenderer.tsx), and [`prisma/schema.prisma`](../../prisma/schema.prisma). Hosting, database configuration, backups, and production logs were not available for inspection.

## 2. System context and assets

| Asset | Examples | Security need |
| --- | --- | --- |
| Student identity data | Name, email, grade, teaching medium | Confidentiality, accuracy, controlled access |
| Authentication data | Password hashes and signed session cookies | Confidentiality and protection against account takeover |
| Learning records | Assignment answers, feedback, quiz attempts, marks, lesson progress | Confidentiality, integrity, availability |
| Teaching content | Lessons, videos, papers, quizzes, answer keys | Integrity and appropriate cohort access |
| Administrator capability | Manage users, content, assignments, and grades | Strong authentication, least privilege, traceability |
| Application and database secrets | `JWT_SECRET`, database credentials | Confidentiality and rotation |
| Service availability | Web app and PostgreSQL | Recovery from outage, attack, or data loss |

The users include students (including school-age learners), administrators/teachers, and an attacker who may be an unauthenticated internet user or a compromised account. External services include linked file stores, video providers, and meeting platforms.

## 3. Rating method

Likelihood (L) and impact (I) are rated from 1 (rare/low) to 5 (almost certain/severe). The inherent risk score is `L × I`: 1–4 Low, 5–9 Moderate, 10–15 High, and 16–25 Critical. Residual ratings estimate risk after the recommended control is fully implemented and verified. They are planning estimates, not measured results.

## 4. Risk register

| ID | Risk and evidence | L × I | Priority | Recommended controls | Estimated residual |
| --- | --- | ---: | --- | --- | ---: |
| R1 | **Stored script execution through learning content.** [`MarkdownRenderer.tsx`](../../src/components/ui/MarkdownRenderer.tsx) enables raw HTML with `rehypeRaw`; its code runner executes JavaScript using `new Function` and renders HTML with `dangerouslySetInnerHTML`. If an administrator account or content is maliciously changed, code can run in a learner's browser with the LMS origin and act through that browser session. | 4 × 5 = 20 | Critical | Remove raw HTML or sanitize with a strict allowlist; never evaluate lesson JavaScript in the LMS origin. Render code examples in an isolated sandboxed iframe with restrictive permissions and CSP. Add a restrictive Content Security Policy and test stored-XSS cases. | 1 × 5 = 5 (Moderate) |
| R2 | **Password guessing and account takeover.** Login performs bcrypt comparison and uses a generic invalid-credential response, but the route has no visible rate limit, progressive delay, or lockout. Registration checks that a password exists but does not enforce a documented strength rule. | 4 × 4 = 16 | Critical | Apply per-account and per-IP throttling with progressive delays; alert on repeated failures; enforce minimum password length and block common passwords; offer MFA for administrator accounts; document recovery and reset procedures. | 2 × 4 = 8 (Moderate) |
| R3 | **Cross-cohort exposure of past papers.** Student course, quiz, and classroom queries use the authenticated user's cohort, but [`/api/papers`](../../src/app/api/papers/route.ts) accepts grade and medium filters from the request and does not derive them from the signed-in user. Any authenticated user can request other cohorts' paper metadata and links. | 3 × 3 = 9 | Moderate | Derive student grade and medium from the current database user for student requests; keep any administrator-wide view behind an explicit administrator check; reject unsupported grade/medium values. | 1 × 3 = 3 (Low) |
| R4 | **Unauthorized state changes through cross-site requests.** Session cookies use `HttpOnly`, `SameSite=Lax`, and `Secure` in production. Mutating routes rely on that browser behavior and do not visibly validate an `Origin`/`Referer` or CSRF token. A future route or deployment change could weaken the current baseline. | 2 × 4 = 8 | Moderate | For cookie-authenticated state changes, enforce same-origin `Origin` checks (with a carefully defined fallback) or CSRF tokens; keep `SameSite=Lax`; test all mutation routes. | 1 × 4 = 4 (Low) |
| R5 | **Malicious or oversized input causes content injection, unwanted links, or service exhaustion.** Some classroom fields have server-side bounds, but several administrator course/lesson/quiz/paper routes primarily check required fields. No shared schema validation or request-size policy is visible. Student submissions can contain arbitrary external URLs. | 3 × 4 = 12 | High | Apply server-side schemas, length/range limits, URL scheme/host rules, and request body size limits to every route; escape or sanitize rendered content; validate all values again at the API boundary. | 1 × 4 = 4 (Low) |
| R6 | **Limited ability to detect and investigate misuse.** Errors are written using `console.error`, but there is no application audit trail shown for administrator role changes, grading, account deletion, or content edits, and no alerting/retention configuration is documented. | 4 × 4 = 16 | Critical | Add structured, access-controlled audit events for privileged and sensitive changes; centralize logs; alert on repeated login failures, role changes, and unusual access; define retention and incident response procedures. Never log passwords, cookies, or full assignment answers unnecessarily. | 2 × 4 = 8 (Moderate) |
| R7 | **Data loss or extended outage.** Student records and learning history are database-backed. Repository documentation does not establish production backup frequency, encryption, restoration testing, or recovery objectives. | 3 × 5 = 15 | High | Use encrypted automated backups, least-privilege database access, documented retention, and scheduled restore tests. Set recovery point and recovery time objectives with the service owner. | 1 × 5 = 5 (Moderate) |
| R8 | **Compromised administrator can make broad changes.** An administrator can view all users and submissions, change roles, delete users, publish content, and grade work. API handlers re-check the database role through `requireUser`, which is a positive control, but administrator actions are broad and are not shown as audited or protected by MFA. | 3 × 5 = 15 | High | Require MFA for administrators; minimize the number of administrators; add confirmation/re-authentication for role changes and destructive actions; add audit logging and periodic access review; prevent unsafe self-demotion/deletion states. | 1 × 5 = 5 (Moderate) |
| R9 | **Sensitive data exposure after account or session compromise.** The JWT lasts seven days. Logout clears the browser cookie, but there is no server-side token revocation mechanism evident. `requireUser` loads the current database role, limiting stale-role access, but a copied valid token can remain usable until expiry or account removal. | 3 × 4 = 12 | High | Shorten administrator session lifetime; support session revocation/versioning; rotate signing secrets through a managed secret store; require re-authentication for high-impact changes; review active sessions and account recovery. | 1 × 4 = 4 (Low) |
| R10 | **Production transport and browser hardening are unverified.** The cookie is marked `Secure` in production and `JWT_SECRET` is required, which are positive controls. Repository configuration does not show security response headers, production TLS enforcement, database network restrictions, or secret rotation procedures. | 2 × 5 = 10 | High | Enforce HTTPS at the edge; add HSTS, CSP, `X-Content-Type-Options`, `Referrer-Policy`, and a restrictive `Permissions-Policy`; keep PostgreSQL private and use TLS; store and rotate secrets using a managed secret store. Confirm the deployed configuration. | 1 × 5 = 5 (Moderate) |

## 5. Existing controls observed

- Passwords are hashed with bcrypt before persistence in [`register/route.ts`](../../src/app/api/auth/register/route.ts); login compares the submitted password with the stored hash.
- Session cookies are HttpOnly, use `SameSite=Lax`, and are marked Secure in production in the login and registration handlers.
- [`requireUser`](../../src/server/auth/authorization.ts) loads the current user and role from PostgreSQL. Administrator API handlers generally require the `ADMIN` role, so a stale administrator claim alone does not authorize a protected handler.
- Student courses, quizzes, classroom items, assignment submissions, and quiz results have ownership/cohort checks in the relevant API routes. Quiz response selection excludes `correctAnswers`.
- Registration always creates a `STUDENT`; administrator creation is a separate provisioning operation described in [`README.md`](../../README.md).

These controls reduce risk but do not replace operational safeguards or the improvements in the risk register.

## 6. Implementation order and acceptance evidence

| Phase | Controls | Evidence to present |
| --- | --- | --- |
| 1 — Immediate | R1 unsafe rendering/code execution; R2 login abuse protection and administrator MFA; R3 papers cohort authorization | Code review of renderer, rate-limit configuration, MFA enrollment, and API checks showing a student cannot retrieve another cohort's papers |
| 2 — Before production | R4 CSRF/origin protection; R5 validation and request limits; R8 administrator safeguards; R9 session revocation | Route-level negative cases, administrator access review, session revocation demonstration, and change audit events |
| 3 — Operational readiness | R6 audit/logging/incident response; R7 backups and restore; R10 deployment hardening | Sample redacted audit event, alert rule, successful restore record, TLS/header scan, and documented recovery objectives |

Implementation is complete only when the evidence is reviewed and recorded. The project owner should update residual ratings from the verification results.
