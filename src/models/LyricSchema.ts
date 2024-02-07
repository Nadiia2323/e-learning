import mongoose, { Types } from "mongoose";

export interface LyricType extends mongoose.Document {
  lyric: string;
  author: string;
  video: string;
  listening: Types.ObjectId;
  speaking: Types.ObjectId;
  reading: Types.ObjectId;
  writting: Types.ObjectId;
  testYourself: Types.ObjectId;
}

//REVIEW which ones are required and which not??
const LyricSchema = new mongoose.Schema({
  lyric: String,
  author: String,
  video: String,
  listening: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listening",
  },
  tasks: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'task'
  },
  reading: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reading",
  },
  writing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Writing",
  },
  testYourself: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TestYourself",
  },
});

const LyricModel = mongoose.models.lyric || mongoose.model('lyric', LyricSchema);

// export default LyricModel;
