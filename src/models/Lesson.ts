import mongoose, { Types } from "mongoose";

export interface LessonType extends mongoose.Document {
  lyric: string;
  author: string;
  video: string;

  tasks?: Types.ObjectId;
  readingtasks?: Types.ObjectId[];
  listeningtasks?: Types.ObjectId[];
  testyourself?: Types.ObjectId;
}

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
});

export const LessonModel =
  mongoose.models.lesson || mongoose.model("lesson", LessonSchema);
