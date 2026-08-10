import { Course, Quiz, User } from '@/types';

export const INITIAL_USER: User = {
  id: 'user-std-101',
  name: 'Alex Perera',
  email: 'alex.ict@school.lk',
  grade: 10,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  enrolledCourseIds: ['g10-web-dev', 'g11-python-prog', 'g12-db-sql'],
  completedLessonIds: ['g10-web-lesson-1'],
  points: 420,
  streakDays: 5,
};

export const COURSES: Course[] = [
  {
    id: 'g10-web-dev',
    title: 'Grade 10 ICT: HTML5 & Web Development',
    grade: 10,
    category: 'Web Development',
    description: 'Master the fundamental building blocks of the Web: HTML5 elements, semantic structure, links, tables, and responsive forms.',
    iconName: 'Code',
    bannerGradient: 'from-blue-600 to-cyan-500',
    modules: [
      {
        id: 'g10-m1',
        courseId: 'g10-web-dev',
        title: 'Module 1: Foundations of Web Pages',
        description: 'Understand client-server architecture and create your first structured HTML document.',
        order: 1,
        lessons: [
          {
            id: 'g10-web-lesson-1',
            courseId: 'g10-web-dev',
            moduleId: 'g10-m1',
            title: 'Introduction to Web Pages & HTML Structure',
            order: 1,
            durationMinutes: 15,
            isCompleted: true,
            sections: [
              {
                heading: 'What is HTML?',
                text: 'HTML stands for HyperText Markup Language. It is the standard markup language for documents designed to be displayed in a web browser.',
                tip: 'Remember: HTML gives content structure, CSS adds visual styling, and JavaScript adds interactive behavior.',
              },
              {
                heading: 'Anatomy of an HTML Document',
                text: 'Every standard HTML5 document begins with <!DOCTYPE html> followed by <html>, <head>, and <body> tags.',
                codeSnippet: {
                  language: 'html',
                  code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My First ICT Web Page</title>
</head>
<body>
  <h1>Welcome to Grade 10 ICT!</h1>
  <p>Learning HTML is fun and essential for web development.</p>
</body>
</html>`,
                },
              },
              {
                heading: 'Headings and Paragraphs',
                text: 'Headings range from <h1> (most important) to <h6> (least important). Paragraphs are enclosed in <p> tags.',
              },
            ],
          },
          {
            id: 'g10-web-lesson-2',
            courseId: 'g10-web-dev',
            moduleId: 'g10-m1',
            title: 'Building Interactive HTML Forms & Links',
            order: 2,
            durationMinutes: 20,
            isCompleted: false,
            sections: [
              {
                heading: 'Hyperlinks and Anchors',
                text: 'Hyperlinks connect web pages. The <a> tag uses the href attribute to specify the destination URL.',
                codeSnippet: {
                  language: 'html',
                  code: `<a href="https://example.com" target="_blank">Visit ICT Resource Portal</a>`,
                },
              },
              {
                heading: 'HTML Form Inputs',
                text: 'Forms allow user input using text fields, radio buttons, checkboxes, and submit buttons inside a <form> container.',
                codeSnippet: {
                  language: 'html',
                  code: `<form action="/submit" method="POST">
  <label for="studentName">Student Name:</label>
  <input type="text" id="studentName" name="name" required />
  <button type="submit">Submit Details</button>
</form>`,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'g11-python-prog',
    title: 'Grade 11 ICT: Python Programming Fundamentals',
    grade: 11,
    category: 'Programming',
    description: 'Learn logic, variable types, conditional statements, loops, and functions using clean Python syntax.',
    iconName: 'Terminal',
    bannerGradient: 'from-amber-500 to-emerald-500',
    modules: [
      {
        id: 'g11-m1',
        courseId: 'g11-python-prog',
        title: 'Module 1: Variables and Logic Flow',
        description: 'Understand input/output, data types, and logical operators in Python.',
        order: 1,
        lessons: [
          {
            id: 'g11-py-lesson-1',
            courseId: 'g11-python-prog',
            moduleId: 'g11-m1',
            title: 'Variables, Operators, and Input',
            order: 1,
            durationMinutes: 18,
            isCompleted: false,
            sections: [
              {
                heading: 'Variables & Data Types',
                text: 'Python dynamically assigns data types such as int, float, str, and bool without needing explicit declaration.',
                codeSnippet: {
                  language: 'python',
                  code: `marks = 85
student_name = "Kavindi"
is_passed = marks >= 50

print(f"Student: {student_name}, Passed: {is_passed}")`,
                },
              },
            ],
          },
          {
            id: 'g11-py-lesson-2',
            courseId: 'g11-python-prog',
            moduleId: 'g11-m1',
            title: 'Conditionals & Loops in Python',
            order: 2,
            durationMinutes: 25,
            isCompleted: false,
            sections: [
              {
                heading: 'If-Else Statements',
                text: 'Branching logic allows programs to take decisions based on Boolean expressions.',
                codeSnippet: {
                  language: 'python',
                  code: `score = int(input("Enter quiz score: "))

if score >= 75:
    print("Grade: Distinction")
elif score >= 50:
    print("Grade: Pass")
else:
    print("Grade: Needs Improvement")`,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'g12-db-sql',
    title: 'Grade 12-13 ICT: Database Systems & SQL',
    grade: 12,
    category: 'Databases',
    description: 'Design relational database tables, establish foreign key relationships, and query datasets with SQL.',
    iconName: 'Database',
    bannerGradient: 'from-purple-600 to-indigo-600',
    modules: [
      {
        id: 'g12-m1',
        courseId: 'g12-db-sql',
        title: 'Module 1: Relational Queries & SQL',
        description: 'Explore relational schema design and write data manipulation queries.',
        order: 1,
        lessons: [
          {
            id: 'g12-sql-lesson-1',
            courseId: 'g12-db-sql',
            moduleId: 'g12-m1',
            title: 'Database Normalization & ER Diagrams',
            order: 1,
            durationMinutes: 22,
            isCompleted: false,
            sections: [
              {
                heading: 'What is Relational Normalization?',
                text: 'Normalization eliminates data redundancy and enhances data integrity (1NF, 2NF, 3NF).',
              },
            ],
          },
          {
            id: 'g12-sql-lesson-2',
            courseId: 'g12-db-sql',
            moduleId: 'g12-m1',
            title: 'Writing SELECT, JOIN, and WHERE Statements',
            order: 2,
            durationMinutes: 30,
            isCompleted: false,
            sections: [
              {
                heading: 'Querying Data with SQL',
                text: 'SQL SELECT queries filter records using WHERE clauses and combine tables using INNER JOIN.',
                codeSnippet: {
                  language: 'sql',
                  code: `SELECT s.name, c.course_title, q.score
FROM students s
INNER JOIN quiz_results q ON s.id = q.student_id
INNER JOIN courses c ON q.course_id = c.id
WHERE q.score >= 80;`,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'g8-hardware',
    title: 'Grade 8 ICT: Computer Hardware & Systems',
    grade: 8,
    category: 'Hardware & Systems',
    description: 'Explore the architecture of modern computers, CPU execution cycles, RAM vs Storage, and input/output units.',
    iconName: 'Cpu',
    bannerGradient: 'from-rose-500 to-pink-600',
    modules: [
      {
        id: 'g8-m1',
        courseId: 'g8-hardware',
        title: 'Module 1: System Unit Components',
        description: 'Discover how hardware components interact during the Fetch-Decode-Execute cycle.',
        order: 1,
        lessons: [
          {
            id: 'g8-hw-lesson-1',
            courseId: 'g8-hardware',
            moduleId: 'g8-m1',
            title: 'Inside the System Unit: CPU & Memory',
            order: 1,
            durationMinutes: 15,
            isCompleted: false,
            sections: [
              {
                heading: 'The Central Processing Unit (CPU)',
                text: 'The CPU is the brain of the computer containing the Control Unit (CU) and Arithmetic Logic Unit (ALU).',
              },
            ],
          },
        ],
      },
    ],
  },
];

export const QUIZZES: Quiz[] = [
  {
    id: 'g10-web-quiz-1',
    courseId: 'g10-web-dev',
    lessonId: 'g10-web-lesson-1',
    title: 'HTML & Web Fundamentals Knowledge Test',
    description: 'Assess your understanding of document structure, tags, attributes, and semantic layout.',
    grade: 10,
    durationMinutes: 10,
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        quizId: 'g10-web-quiz-1',
        text: 'Which HTML tag is used to define the largest heading in a webpage?',
        type: 'single',
        options: [
          { id: 0, text: '<heading>' },
          { id: 1, text: '<h6>' },
          { id: 2, text: '<h1>' },
          { id: 3, text: '<head>' },
        ],
        correctAnswers: [2],
        explanation: '<h1> represents the top-level section heading in HTML document hierarchy.',
      },
      {
        id: 'q2',
        quizId: 'g10-web-quiz-1',
        text: 'What is the correct HTML element for inserting a line break?',
        type: 'single',
        options: [
          { id: 0, text: '<break>' },
          { id: 1, text: '<br>' },
          { id: 2, text: '<lb>' },
          { id: 3, text: '<hr>' },
        ],
        correctAnswers: [1],
        explanation: '<br> is a self-closing tag used to produce a line break in text.',
      },
      {
        id: 'q3',
        quizId: 'g10-web-quiz-1',
        text: 'Which of the following are semantic HTML5 layout elements? (Select all that apply)',
        type: 'multiple',
        options: [
          { id: 0, text: '<header>' },
          { id: 1, text: '<div>' },
          { id: 2, text: '<nav>' },
          { id: 3, text: '<article>' },
        ],
        correctAnswers: [0, 2, 3],
        explanation: '<header>, <nav>, and <article> provide semantic context, whereas <div> is a generic non-semantic container.',
      },
      {
        id: 'q4',
        quizId: 'g10-web-quiz-1',
        text: 'Which attribute specifies an alternate text for an image if the image cannot be displayed?',
        type: 'single',
        options: [
          { id: 0, text: 'src' },
          { id: 1, text: 'alt' },
          { id: 2, text: 'title' },
          { id: 3, text: 'caption' },
        ],
        correctAnswers: [1],
        explanation: 'The "alt" attribute defines alternative descriptive text for web accessibility and fallback display.',
      },
      {
        id: 'q5',
        quizId: 'g10-web-quiz-1',
        text: 'Where should <meta> charset definitions and page titles be placed?',
        type: 'single',
        options: [
          { id: 0, text: 'Inside the <body> tag' },
          { id: 1, text: 'Inside the <head> tag' },
          { id: 2, text: 'At the bottom of <footer>' },
          { id: 3, text: 'Inside a <script> block' },
        ],
        correctAnswers: [1],
        explanation: 'Metadata, character encoding, and page titles belong inside the document <head> element.',
      },
    ],
  },
  {
    id: 'g11-py-quiz-1',
    courseId: 'g11-python-prog',
    lessonId: 'g11-py-lesson-1',
    title: 'Python Logic & Control Flow Quiz',
    description: 'Test your grasp of Python data types, operators, and conditional branching logic.',
    grade: 11,
    durationMinutes: 12,
    passingScore: 75,
    questions: [
      {
        id: 'pq1',
        quizId: 'g11-py-quiz-1',
        text: 'What is the output of `type(3.14)` in Python?',
        type: 'single',
        options: [
          { id: 0, text: '<class "int">' },
          { id: 1, text: '<class "float">' },
          { id: 2, text: '<class "double">' },
          { id: 3, text: '<class "number">' },
        ],
        correctAnswers: [1],
        explanation: 'Floating point numbers with decimal points are classified as type `float` in Python.',
      },
      {
        id: 'pq2',
        quizId: 'g11-py-quiz-1',
        text: 'Which operator is used for integer floor division in Python?',
        type: 'single',
        options: [
          { id: 0, text: '/' },
          { id: 1, text: '//' },
          { id: 2, text: '%' },
          { id: 3, text: '**' },
        ],
        correctAnswers: [1],
        explanation: 'The `//` operator performs floor division, truncating fractional remainders.',
      },
      {
        id: 'pq3',
        quizId: 'g11-py-quiz-1',
        text: 'Which of the following are valid boolean operators in Python? (Select all that apply)',
        type: 'multiple',
        options: [
          { id: 0, text: 'and' },
          { id: 1, text: '&&' },
          { id: 2, text: 'or' },
          { id: 3, text: 'not' },
        ],
        correctAnswers: [0, 2, 3],
        explanation: 'Python uses English words `and`, `or`, and `not` for boolean logical operations (unlike C/JS which use && and ||).',
      },
    ],
  },
  {
    id: 'g12-sql-quiz-1',
    courseId: 'g12-db-sql',
    lessonId: 'g12-sql-lesson-2',
    title: 'Relational Databases & SQL Queries',
    description: 'Test your expertise in SQL keywords, table joins, and primary key constraints.',
    grade: 12,
    durationMinutes: 15,
    passingScore: 70,
    questions: [
      {
        id: 'sq1',
        quizId: 'g12-sql-quiz-1',
        text: 'Which SQL keyword is used to retrieve unique distinct records from a column?',
        type: 'single',
        options: [
          { id: 0, text: 'UNIQUE' },
          { id: 1, text: 'DISTINCT' },
          { id: 2, text: 'DIFFERENT' },
          { id: 3, text: 'FILTER' },
        ],
        correctAnswers: [1],
        explanation: 'SELECT DISTINCT is used to return only unique values in SQL query results.',
      },
      {
        id: 'sq2',
        quizId: 'g12-sql-quiz-1',
        text: 'What type of JOIN returns records that have matching values in both tables?',
        type: 'single',
        options: [
          { id: 0, text: 'LEFT JOIN' },
          { id: 1, text: 'INNER JOIN' },
          { id: 2, text: 'FULL OUTER JOIN' },
          { id: 3, text: 'RIGHT JOIN' },
        ],
        correctAnswers: [1],
        explanation: 'INNER JOIN selects records that have matching keys in both participating tables.',
      },
    ],
  },
];
