// import mongoose, { Types } from "mongoose";

// export interface LessonType extends mongoose.Document {
//   lyric: string;
//   author: string;
//   video: string;

//   tasks?: Types.ObjectId;
//   readingTasks?: Types.ObjectId[];
//   listeningTasks?: Types.ObjectId[];
//   testYourself?: Types.ObjectId;
// }

// const LessonSchema = new mongoose.Schema({
//   lyric: String,
//   author: String,
//   video: String,

//   tasks: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "task",
//   },

//   readingTasks: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "readingtask",
//     },
//   ],

//   listeningTasks: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "listeningtask",
//     },
//   ],

//   testYourself: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "testyourself",
//   },
// });

// export const LessonModel =
//   mongoose.models.lesson || mongoose.model("lesson", LessonSchema);
import mongoose, { Types } from "mongoose";

export interface LessonType extends mongoose.Document {
  lyric: string;
  author: string;
  video: string;

  tasks?: Types.ObjectId;
  readingtasks?: Types.ObjectId[];
  listeningtasks?: Types.ObjectId[];
  testyourself?: Types.ObjectId;
  sections: SectionType[];
}
export type SectionKey =
  | "video"
  | "reading"
  | "speaking"
  | "grammar"
  | "listening"
  | "quiz";

export interface SectionType {
  key: SectionKey;
  title: string;
  subtitle?: string;
  order: number;
  enabled: boolean;
}
const SectionSchema = new mongoose.Schema<SectionType>(
  {
    key: {
      type: String,
      required: true,
      enum: ["video", "reading", "speaking", "grammar", "listening", "quiz"],
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      required: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false },
);

const LessonSchema = new mongoose.Schema({
  lyric: String,
  author: String,
  video: String,

  tasks: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "task",
  },

  readingtasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "readingtask",
    },
  ],

  listeningtasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "listeningtask",
    },
  ],

  testyourself: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "testyourself",
  },
  sections: {
    type: [SectionSchema],
  },
});

export const LessonModel =
  mongoose.models.lesson || mongoose.model("lesson", LessonSchema);
