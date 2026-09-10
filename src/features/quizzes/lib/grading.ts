import type { Question, QuestionResultDetail } from '@/types';

export function gradeQuiz(questions: Question[], answers: unknown, passingScore: number) {
  if (!questions.length) throw new Error('This quiz has no questions.');
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) throw new Error('Invalid answers.');
  const input = answers as Record<string, unknown>;
  if (Object.keys(input).some(id => !questions.some(q => q.id === id))) throw new Error('Unknown question.');
  const details: QuestionResultDetail[] = questions.map(q => {
    const selected = input[q.id] ?? [];
    if (!Array.isArray(selected) || selected.some(id => !Number.isInteger(id) || !q.options.some(o => o.id === id)) || new Set(selected).size !== selected.length || (q.type === 'single' && selected.length > 1)) throw new Error('Invalid answer selection.');
    const userSelection = [...selected].sort((a, b) => a - b);
    const correctAnswers = [...q.correctAnswers].sort((a, b) => a - b);
    const isCorrect = userSelection.length === correctAnswers.length && userSelection.every((v, i) => v === correctAnswers[i]);
    return { questionId: q.id, questionText: q.text, options: q.options, userSelection, correctAnswers, isCorrect, explanation: q.explanation };
  });
  const correctAnswersCount = details.filter(d => d.isCorrect).length;
  const scorePercentage = Math.round(correctAnswersCount / questions.length * 100);
  return { details, correctAnswersCount, scorePercentage, totalQuestions: questions.length, passed: scorePercentage >= passingScore };
}
