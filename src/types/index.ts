export type Id = string;

/* ================= LESSON ================= */

export interface LessonSection {
  key: SectionKey;
  title: string;
  subtitle?: string;
  order: number;
  enabled: boolean;
}

export interface Lesson {
  _id: Id;
  author: string;
  lyric: string;
  video: string;
  sections: LessonSection[];

  tasks: {
    questions?: string[];
    funpic?: string;
    wordPairs?: {
      name: string;
      pairs: {
        word: string;
        description: string;
      }[];
    };
  };

  readingtasks?: {
    type: "cloze" | "options";
    name?: string;
    test?: {
      name: string;
      content: {
        text: string;
        blank: boolean;
      }[];
    };
    testOp?: {
      task: {
        sentence: string;
        options: string[];
        correctAnswers: string[];
      }[];
    };
  }[];

  listeningtasks?: {
    type: "truefalse" | "picture";
    name?: string;
    trueorfalse?: {
      task: {
        _id: string;
        statement: string;
        isTrue: boolean;
      }[];
    };
    picturematch?: {
      pairs: PicturePair[];
    };
  }[];

  testyourself?: {
    name: string;
    test: {
      _id: string;
      questionText: string;
      options: {
        _id: string;
        optionText: string;
        isCorrect: boolean;
      }[];
    }[];
  };
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
  _id: string;
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
  type: "cloze" | "options";
  name: string;
  test?: Id;
  testOp?: Id;
}

/* ================= CLOZE TEST ================= */
export type ClozeItem = {
  _id: string;
  text?: string;
  blank?: boolean;
  answer?: string;
};

export type ClozeTestType = {
  _id: string;
  name?: string;
  content: ClozeItem[];
};
export type AnswerPayload = {
  taskId: string;
  answerId: string;
  answerType: "cloze-test" | "match" | "true-false" | "picture-match";
  userAnswer: string;
  isCorrect: boolean;
};

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
  _id: Id;
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

/* ================= SECTION ================= */
export type LessonSectionForm = {
  key: SectionKey;
  title: string;
  subtitle?: string;
  order: number;
  enabled: boolean;
};
export type SectionKey =
  | "video"
  | "reading"
  | "speaking"
  | "grammar"
  | "listening"
  | "quiz";

export interface LessonListeningTask {
  type: "truefalse" | "picture";
  name?: string;
  trueorfalse?: {
    task: {
      _id: string;
      statement: string;
      isTrue: boolean;
    }[];
  };
  picturematch?: {
    pairs: PicturePair[];
  };
}
