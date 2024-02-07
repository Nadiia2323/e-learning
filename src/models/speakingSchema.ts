import { ObjectId } from "mongodb";
import mongoose, { Types, modelNames } from "mongoose";

const taskSchema = new mongoose.Schema({
  questions: {
    type: [String],
  },
  wordPairs: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "wordPair",
  },
});
const wordPairsSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  pairs: [
    {
      word: {
        type: String,
      },

      description: {
        type: String,
      },
    },
  ],
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

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
    ref: "task",
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

const WordPairsModel =
  mongoose.models.wordPair || mongoose.model("wordPair", wordPairsSchema);
const LyricModel =
  mongoose.models.lesson || mongoose.model("lesson", LyricSchema);
const UserModel = mongoose.models.user || mongoose.model("user", userSchema);

const taskModel = mongoose.models.task || mongoose.model("task", taskSchema);

// export default taskModel;
export { taskModel, UserModel, LyricModel, WordPairsModel };

//Carmdel created to test populate
//#region
// const CarSchema = new mongoose.Schema({
//     name: String,
//     user:{type:mongoose.Schema.Types.ObjectId, ref:"user"}
// })

// const CarModel = mongoose.models.car || mongoose.model('car', CarSchema);
//#endregion
