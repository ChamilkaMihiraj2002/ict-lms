# LMS Layouts and Screens Explanation

This document breaks down the purpose and structural design of the key layouts and screens within the ICT Learning Management System.

## 1. Root Layout (`app/layout.tsx`)
**Purpose:** The foundational wrapper for the entire application. It contains the `<html>` and `<body>` tags, and injects global styles, fonts, and application-wide providers.
**Key Elements:**
*   **Theme Provider:** Wraps the app to enable seamless switching between Light and Dark mode.
*   **Toast Notifications:** A global container for success/error messages (e.g., "Login Successful", "Quiz Submitted").
*   **Global Fonts & CSS:** Imports Tailwind CSS (`globals.css`) and Next.js optimized fonts.

---

## 2. Authentication Flow (`app/(auth)/...`)

### Auth Layout (`app/(auth)/layout.tsx`)
**Purpose:** Provides a clean, distraction-free environment for login and registration.
**Structure:** Typically a split-screen design or a centered card layout. It does *not* include the main app navigation or sidebar.

### Screens
*   **Login (`login/page.tsx`):** Contains the login form (Email/Password or OAuth buttons). Focuses on quick access.
*   **Register (`register/page.tsx`):** Student account creation. Collects necessary details like Name, Grade (6-13), and Email.

---

## 3. Main Dashboard Flow (`app/(dashboard)/...`)

### Dashboard Layout (`app/(dashboard)/layout.tsx`)
**Purpose:** The main application shell that wraps all authenticated content.
**Structure:**
*   **Sidebar (Desktop) / Bottom Nav (Mobile):** Contains navigation links (Home, Courses, Quizzes, Profile).
*   **Top Bar:** Displays the current page title, breadcrumbs, user profile dropdown, and the Dark Mode toggle.
*   **Main Content Area:** A responsive container where the specific page content is rendered.

### Screens

#### Student Dashboard (`page.tsx`)
**Purpose:** The landing page after logging in. Acts as a central hub.
**Key Elements:**
*   **Welcome Banner:** Personalized greeting.
*   **"Resume Learning" Card:** A prominent widget showing the last incomplete lesson or quiz with a quick "Continue" button.
*   **Progress Overview:** Circular charts or progress bars showing completion percentages for active ICT modules.
*   **Upcoming Tasks:** A short list of pending quizzes or new course materials.

#### Course Overview (`courses/[courseId]/page.tsx`)
**Purpose:** Details a specific course (e.g., "Grade 10 ICT - Web Development").
**Key Elements:**
*   **Course Header:** Title, description, and overall progress.
*   **Syllabus/Module List:** An accordion or list view of all lessons in the course. Completed lessons have checkmarks; locked lessons are grayed out.

#### Lesson Viewer (`courses/lesson/[lessonId]/page.tsx`)
**Purpose:** Where the actual learning happens (reading text, watching embedded videos, viewing code snippets).
**Key Elements:**
*   **Content Column:** Narrow, centered text column (`max-w-3xl`) for readability.
*   **Sticky Table of Contents (Desktop):** A sidebar that highlights the current section being read.
*   **Navigation Buttons:** Large "Previous Lesson" and "Next Lesson" buttons at the bottom.

#### Quizzes List (`quizzes/page.tsx`)
**Purpose:** Displays all available, completed, and pending quizzes.
**Key Elements:**
*   **Filter/Tabs:** Allow students to toggle between "To Do", "Completed", and "Missed".
*   **Quiz Cards:** Displays the quiz title, associated lesson, time limit, and score (if completed).

#### Active Quiz UI (`quizzes/[quizId]/page.tsx`)
**Purpose:** The testing environment. Must be distraction-free.
**Key Elements:**
*   **Focus Mode Layout:** Hides the main dashboard sidebar and top bar.
*   **Header:** Displays a countdown timer (if applicable) and a progress bar (e.g., "Question 3 of 10").
*   **Question Card:** Displays a single question with clear, selectable answer options (radio buttons for single choice, checkboxes for multiple choice).
*   **Pagination:** "Previous" and "Next" buttons instead of scrolling.
*   **Submit Button:** Only appears on the final question or via a "Review & Submit" screen.

#### Quiz Result (`quizzes/result/[resultId]/page.tsx`)
**Purpose:** Immediate feedback after quiz submission.
**Key Elements:**
*   **Score Summary:** Large, gamified display of the final score (e.g., "85% - Great Job!").
*   **Detailed Review:** A breakdown of all questions, showing what the student selected versus the correct answer, often with an "Explanation" box to reinforce learning.
