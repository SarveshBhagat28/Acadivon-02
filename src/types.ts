export interface QuizQuestion {
  question: string;
  options?: string[];
  answer: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  explanation: string;
  type: 'MCQ' | 'ShortAnswer';
}

export interface StudySession {
  type: 'Study' | 'Break';
  duration: number;
  task: string;
  time: string;
  tip?: string;
}

export interface StudyPlan {
  assignmentName: string;
  totalTime: number;
  sessions: StudySession[];
}
