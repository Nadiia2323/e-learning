import { ObjectId } from "mongodb";
import mongoose, { Types, modelNames } from "mongoose";

const taskSchema = new mongoose.Schema({
  questions: {
    type: [String],
  },
  funpic: {
    type: String
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
const pictureMatchSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  pairs: [
    {
      picture: {
        type: String,
      },

      description: {
        type: String,
      },
    },
  ],
});
const answerDetailsSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
   
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answerType: {
    type: String,
    required: true,
  },
  userAnswer: mongoose.Schema.Types.Mixed, 
  isCorrect: {
    type: Boolean,
    required: true,
  },
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
   lessonsProgress: [
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
    },
    progress: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
      answers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'answerdetail', 
    }],
  },
],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});








// const UserAnswerSchema = new mongoose.Schema({
//   taskId: mongoose.Schema.Types.ObjectId,
//   answerType: String, // Например, 'cloze-test', 'sentence-options', etc.
//   answers: [mongoose.Schema.Types.Mixed], // Может быть массивом строк, объектов или идентификаторов в зависимости от типа задания
// });
// const UserProgressSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
//   completed: { type: Boolean, default: false },
//   progress: { type: Number, default: 0 },
//   answers: [UserAnswerSchema], // Массив ответов на задания
// });


const LyricSchema = new mongoose.Schema({
  lyric: String,
  author: String,
  video: String,
  // listening: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Listening",
  // },
  tasks: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "task",
  },
  readingtasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "readingtask"
  }],
  listeningtasks:[ {
    type: mongoose.Schema.Types.ObjectId,
    ref: "listeningtask",
  }],
  testyourself: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "testyourself",
  },
});
const testyourselfSchema = new mongoose.Schema({
  name: {
    type:String
  },
  test: [{
     questionText: String,
    options: [
      {
        optionText: String,

        isCorrect: Boolean
      },
      
    ]
  }]
})
const readingtasksSchema = new mongoose.Schema({
  name: {
    type:String
  },

  test: {
   type: mongoose.Schema.Types.ObjectId,
    ref: "clozetest",
  },
  testOp:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "sentenceoption"
}

})
const clozetestSchema = new mongoose.Schema({
  
  name:{
type: String
  },

  content: [{
    text: String,
    blank: Boolean
}]
})

const sentenceoptionsSchema = new mongoose.Schema({
 

  task: [{
    sentence: String,
    options: [String],
    correctAnswers:[String]
  }],
  test: {
    type:String
  }

})

const listeningtasksSchema = new mongoose.Schema({
   name: {
    type:String
  },

  trueorfalse: {
   type: mongoose.Schema.Types.ObjectId,
    ref: "trueorfalse",
  },
  picturematch: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"picturematchgame"
  }

})
const trueorfalseSchema = new mongoose.Schema({
   name: {
    type:String
  },

  task: [{
    statement: String,
    isTrue: Boolean
   
  }],

})
const AnswerDetailModel = mongoose.models.аnswerdetail || mongoose.model('аnswerdetail', answerDetailsSchema);
const testyourselfModel = mongoose.models.testyourself || mongoose.model("testyourself", testyourselfSchema)
const pictureMatchModel = mongoose.models.picturematchgame || mongoose.model ("picturematchgame", pictureMatchSchema)
const trueorfalseModel = mongoose.models.trueorfalse || mongoose.model('trueorfalse', trueorfalseSchema)

const listeningtasksModel = mongoose.models.listeningtask || mongoose.model('listeningtask', listeningtasksSchema)
const SentenceoptionsModel = mongoose.models.sentenceoption || mongoose.model('sentenceoption', sentenceoptionsSchema)
const ClozetestModel = mongoose.models.clozetest || mongoose.model('clozetest', clozetestSchema)
const ReadingtaskModel = mongoose.models.readingtask || mongoose.model('readingtask', readingtasksSchema)
const WordPairsModel =
  mongoose.models.wordPair || mongoose.model("wordPair", wordPairsSchema);
const LyricModel =
  mongoose.models.lesson || mongoose.model("lesson", LyricSchema);
const UserModel = mongoose.models.user || mongoose.model("user", userSchema);

const taskModel = mongoose.models.task || mongoose.model("task", taskSchema);

// export default taskModel;
export { taskModel, UserModel, LyricModel, WordPairsModel,ReadingtaskModel,ClozetestModel,SentenceoptionsModel,listeningtasksModel,trueorfalseModel,pictureMatchModel,testyourselfModel,AnswerDetailModel };

//Carmdel created to test populate
//#region
// const CarSchema = new mongoose.Schema({
//     name: String,
//     user:{type:mongoose.Schema.Types.ObjectId, ref:"user"}
// })

// const CarModel = mongoose.models.car || mongoose.model('car', CarSchema);
//#endregion
