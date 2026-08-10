# ICT Class Learning Management System (LMS) Architecture

## 🚀 Overview
A modern, full-stack learning management system built for Grade 6-13 ICT students.

**Tech Stack:**
*   **Framework:** Next.js (App Router) for both Frontend and Backend API routes.
*   **Database:** PostgreSQL (via Supabase or NeonDB).
*   **Deployment:** Vercel for seamless frontend and API hosting.

---

## 🎨 UI/UX Strategy (Grade 6 - Grade 13)

Students in this age range (11–19) are digitally native. The UI should be structured, fast, and similar to the modern apps they already use, avoiding overly childish designs.

### Core Interface Principles
1.  **Dark Mode Support:** Essential for this demographic. Implement a theme toggle (e.g., using `next-themes` and Tailwind CSS) to make the platform feel premium.
2.  **Light Gamification:** Use visual progress bars for course completion and immediate, clear score feedback after quizzes to keep students motivated.
3.  **Mobile-First Design:** A significant portion of users will access the platform via smartphones. Ensure layouts collapse cleanly (e.g., sidebars shifting to bottom tab navigation or hamburger menus).

### Key User Flows

*   **Student Dashboard:** 
    *   A "Resume Learning" card showing the last accessed module.
    *   A clean list of pending quizzes or assignments.
    *   A circular progress indicator for overall class completion.
*   **Content View (Lessons):**
    *   Keep the reading column narrow (around `max-w-2xl` or `max-w-3xl`) for comfortable reading.
    *   Include a sticky sidebar (on desktop) showing the lesson index for context.
*   **Quiz View:**
    *   **Focus Mode:** Hide the main navigation to prevent distractions during a test.
    *   **Pagination:** Display one question at a time with "Next" and "Previous" controls, avoiding infinite scrolling for long quizzes.
    *   **Review Screen:** Show a summary of answered vs. skipped questions before final submission.

---

## 📁 Next.js Folder Structure

Utilizing the Next.js **App Router** (`app/` directory) allows for seamless separation of frontend pages and backend API endpoints.

```text
my-ict-lms/
├── app/
│   ├── (auth)/                 # Grouped routes for authentication (URLs do not include '/auth')
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/            # Main app shell (requires login)
│   │   ├── layout.tsx          # Contains sidebar and top navigation
│   │   ├── page.tsx            # Student Dashboard
│   │   ├── courses/
│   │   │   ├── [courseId]/page.tsx       # Course overview
│   │   │   └── lesson/[lessonId]/page.tsx # Reading content viewer
│   │   └── quizzes/
│   │       ├── page.tsx                  # List of available quizzes
│   │       ├── [quizId]/page.tsx         # The active quiz UI
│   │       └── result/[resultId]/page.tsx # Post-quiz score and review
│   ├── api/                    # Backend API Routes
│   │   ├── courses/route.ts
│   │   ├── quizzes/route.ts    # Fetch quizzes here
│   │   └── submit/route.ts     # Grade quizzes and save to DB
│   ├── layout.tsx              # Root HTML/Body layout
│   └── globals.css             # Tailwind imports
├── components/                 # Reusable UI components
│   ├── ui/                     # Base elements: Buttons, inputs, cards (e.g., shadcn/ui)
│   ├── quiz/                   # Domain specific: QuizPlayer, QuestionCard, Timer
│   └── layout/                 # Structural: Sidebar, Topbar
├── lib/                        # Utilities and Configurations
│   ├── db.ts                   # PostgreSQL connection setup
│   └── utils.ts                # Helper functions (date formatting, class merging)
├── types/                      # TypeScript interfaces (Course, Quiz, User, Question)
├── middleware.ts               # Route protection (redirect unauthenticated users to login)
├── tailwind.config.js
└── package.json
```

### Architectural Notes:
*   **Route Groups `(...)`:** Organizes routes without affecting the URL path. This allows specific layouts (like a dashboard sidebar) to apply only where needed, keeping auth pages clean.
*   **Dynamic Routes `[id]`:** Handled dynamically by fetching specific course or quiz data from the database based on the URL parameter.
*   **Isolated Backend:** The `api/` folder acts as the backend. Frontend components call these routes, or React Server Components can fetch directly from PostgreSQL.

---

```python
# And just in case you need it to fly:
import antigravity
```
