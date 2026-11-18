# Viva Demonstration Plan

## Aim

Show that the team understands the application, can demonstrate existing security controls honestly, can explain the current gaps, and has a practical design for treating the highest risks.

## Safe setup

- Use a disposable local/test database and synthetic student names and assignments.
- Prepare one student and one administrator account; use test-only credentials.
- Do not use a real production database, student record, password, session cookie, or harmful exploit payload.
- Keep browser developer tools open for the API response checks. Redact cookies and personal information from any screenshots.

## Suggested 8–10 minute sequence

| Time | Presenter | Demonstration and explanation |
| --- | --- | --- |
| 0:00–1:00 | Member 1 | Introduce the LMS, its users and sensitive assets: identity data, grades, submissions, and administrator capability. Show the high-level architecture/data-flow diagram. |
| 1:00–2:00 | Member 1 | Sign out and request a protected API route. Show the unauthenticated request is rejected. Sign in as a student and explain the HttpOnly/SameSite cookie and bcrypt-backed password check in the current code. |
| 2:00–3:00 | Member 2 | As a student, call an administrator API such as `/api/admin/users`; show that it is denied. Explain that the proxy gate and server-side `requireUser('ADMIN')` are separate checks. |
| 3:00–4:00 | Member 2 | Show a student quiz payload from `/api/quizzes?id=...` and confirm it contains question/options but no `correctAnswers`. Open a result URL belonging to another test student and show that the API returns not found. |
| 4:00–5:00 | Member 2 | Show the classroom view and a cohort-scoped assignment. Explain the grade/medium checks. Present the `/api/papers` finding: its filters currently come from request parameters, so the recommended fix is to derive the student cohort on the server. Do not claim it is fixed. |
| 5:00–6:30 | Member 3 | Walk through `MarkdownRenderer.tsx`. Point to raw HTML, `new Function`, and `dangerouslySetInnerHTML` as the highest-risk content path. Explain the safe Markdown/sandbox design; do not run an exploit. |
| 6:30–7:30 | Member 4 | Show the data-flow diagram and describe production database isolation, TLS, secret handling, encrypted backups, and restore-test requirements. Clearly identify which items depend on hosting configuration. |
| 7:30–8:30 | Member 5 | Present audit events, a redacted sample event format, the login alert/rate-limit plan, and the first incident-response steps. Explain that operational logging/backup status must be verified in deployment. |
| 8:30–10:00 | All | Summarize the top three risks and controls; answer questions using the risk register and policy. |

## Optional request examples

Run against the local test server while signed out, or through the browser's Network panel after signing in as the relevant test account. Use synthetic IDs only.

```sh
# Expected: 401 while signed out
curl -i http://127.0.0.1:3107/api/courses

# In the browser, signed in as a student: expected 403
fetch('/api/admin/users').then(async r => ({status: r.status, body: await r.json()}))
```

For a result-ownership demonstration, use two seeded test users and a result ID created by the other test user. Explain that [`/api/results`](../../src/app/api/results/route.ts) scopes the query to `userId` from the current server-side account. Do not place a live session cookie in a terminal command or slide.

## Likely viva questions

**Why use both middleware/proxy checks and API checks?** Page and navigation checks improve routing, but only the server-side route check protects the data operation. A client-visible role is never the security boundary.

**Why is the lesson code runner a major risk?** It evaluates content in the learner's browser. Same-origin code may make requests as the logged-in learner. Sanitization and an isolated execution context reduce that risk.

**Why is a hashed password not enough against guessing?** Hashing protects stored passwords if the database is exposed; it does not limit online guesses. Rate limiting and administrator MFA address that separate threat.

**What does residual risk mean?** The estimated risk left after controls are implemented and verified. It is not a guarantee and should be recalculated using actual verification evidence.

**What is the biggest deployment assumption?** Hosting and database configuration are outside this source review. HTTPS, database isolation, secret management, backups, logging, and recovery need confirmation in the deployed environment.

## Completion checklist

- Each member can explain their assigned control and point to the related code or policy section.
- Existing controls and proposed controls are distinguished in speech and slides.
- All demo accounts and data are synthetic.
- The team can explain the top risk, the control owner, and the evidence required to close each high-priority risk.
