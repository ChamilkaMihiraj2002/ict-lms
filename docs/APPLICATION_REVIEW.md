# Application review

## Starting point

The repository contained student authentication, grade/medium profiles, course and lesson editors, videos/PDF links, past papers and quiz screens. Several student screens fell back to hard-coded demo data. Completion, quiz results and profile edits were browser-local; quiz-taking used bundled questions even when teachers created quizzes in PostgreSQL. The public quiz endpoint returned correct answers. Admin API handlers lacked consistent authorization, and logging in as a missing demo administrator created that administrator with the supplied password. Dashboard calendar/notification content was illustrative.

## Implemented

- Cohort-targeted assignments, text/link submissions, late labels, marks and written teacher feedback.
- Scheduled classes with start/end times and optional web meeting links.
- Announcements, real dashboard deadlines, and calendar export with UTC times and safe UTF-8 line folding.
- Student gradebook combining assignment feedback and the latest 100 persisted quiz attempts.
- Database-backed lesson completion with one atomic 25-point award per lesson, even under concurrent requests.
- Database-backed quiz-taking, server-side grading and result retrieval restricted to the result owner. Answer keys are excluded from the student quiz endpoint.
- Course and quiz data scoped to the student's grade and medium; ordered course modules/resources; explicit errors instead of demo fallback in the learning workflows.
- Working course overview filters for all, in-progress and completed courses.
- Persisted profile updates, server-session logout, and teacher control of grade/medium.
- Current database role checks for every existing admin handler and new classroom mutation; removal of automatic demo-admin creation and default JWT secret; guarded demo seeding and a separate administrator provisioning command.
- Additive schema migrations, setup documentation, unit tests, and isolated PostgreSQL integration tests.

## Feature references

The selection prioritizes assignment workflows, progress, feedback and planning, which are established LMS capabilities. See [Moodle LMS features](https://moodle.com/solutions/lms/features/), [Moodle feature documentation](https://docs.moodle.org/402/en/Features), and [Canvas calendar documentation](https://community.instructure.com/en/kb/articles/662743-unknown). This implementation is not a claim of full Moodle or Canvas parity.

## Next tuition-management priorities

| Priority | Feature | Decisions needed |
| --- | --- | --- |
| 1 | Tuition batches, enrollment approval and attendance | Multiple batches per grade, class capacity, student transfer rules, teacher-recorded versus student check-in |
| 2 | Monthly fees, receipts and payment tracking | Currency, billing cycle, concessions, partial payments, payment-provider integration |
| 3 | Parent/guardian accounts and reports | Consent, student/guardian linking, what parents can view |
| 4 | Password reset, email verification and login abuse protection | Mail provider, rate-limit store, recovery and administrator-reset policy |
| 5 | Reliable notifications and reminders | Email/SMS provider and consent; persistent per-user read state; background job delivery |
| 6 | Structured enrollments and teacher ownership | Multiple teachers, per-course access, enrollment changes, historical access after grade transfers |
| 7 | Larger-scale assessment | Server-timed attempts, autosaved drafts, attempt limits, question pools, rubrics, resubmissions, pagination and grading exports |
| 8 | Discussion, direct file uploads and interoperability | Moderation, storage limits, file scanning, SCORM/LTI requirements |

## Current limits

A cohort is the existing grade/medium pair, not a separate tuition batch or paid enrollment. Assignments permit one immutable hand-in; there is no draft or resubmission workflow. Calendar files are snapshots. Announcement read status is session-local. Quizzes are practice assessments: grading is server-side, but the timer is client-side and there are no exam-grade attempt limits or proctoring. Retaking a quiz records another result; it does not award unlimited XP. Existing streak values are not recalculated by an activity engine. Attachments are external links, not managed uploads. Classroom lists are not yet paginated. Fee collection, attendance and parent accounts are not implemented in this change.
