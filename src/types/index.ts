export type Id = string;

/* ================= LESSON ================= */

export interface Lesson {
  _id: Id;
  author: string;
  lyric: string;
  video: string;

  tasks: Id;
  readingtasks?: Id[];
  listeningtasks?: Id[];
  testyourself?: Id;
}

/* ================= TASK INTRO ================= */

export interface TaskBlock {
  _id: Id;
  questions: string[];
  funpic: string;
  wordPairs: Id;
}

/* ================= WORD PAIRS ================= */

export interface WordPair {
  word: string;
  description: string;
}

export interface WordPairs {
  _id: Id;
  name: string;
  pairs: WordPair[];
}

/* ================= READING ================= */

export interface ReadingTask {
  _id: Id;
  name: string;
  test?: Id;
  testOp?: Id;
}

/* ================= CLOZE TEST ================= */

export interface ClozeContent {
  text: string;
  blank: string;
  answer?: string;
}

export interface ClozeTest {
  _id: Id;
  name: string;
  content: ClozeContent[];
}

/* ================= SENTENCE OPTIONS ================= */

export interface SentenceOptionTask {
  sentence: string;
  options: string[];
  correctAnswers: string[];
}

export interface SentenceOptions {
  _id: Id;
  test: string;
  task: SentenceOptionTask[];
}

/* ================= LISTENING ================= */

export interface ListeningTask {
  _id: Id;
  name: string;
  trueorfalse?: Id;
  picturematch?: Id;
}

/* ================= TRUE FALSE ================= */

export interface TrueFalseItem {
  statement: string;
  isTrue: boolean | string;
}

export interface TrueOrFalse {
  _id: Id;
  name: string;
  task: TrueFalseItem[];
}

/* ================= PICTURE MATCH ================= */

export interface PicturePair {
  picture: string;
  description: string;
}

export interface PictureMatchGame {
  _id: Id;
  name: string;
  pairs: PicturePair[];
}

/* ================= FINAL TEST ================= */

export interface TestOption {
  optionText: string;
  isCorrect: boolean;
}

export interface TestQuestion {
  questionText: string;
  options: TestOption[];
}

export interface TestYourself {
  _id: Id;
  name: string;
  test: TestQuestion[];
}

/* ================= USER ================= */

export interface LessonProgress {
  lessonId: Id;
  progress: number;
  completed: boolean;
}

export interface User {
  _id: Id;
  email: string;
  name?: string;

  lessonsProgress: LessonProgress[];

  answers: Id[];
}

/* ================= ANSWER ================= */

export interface AnswerDetail {
  _id: Id;

  lessonId: Id;
  taskId: Id;
  userId: Id;

  answerType: string;
  userAnswer: string;

  isCorrect: boolean;
}
