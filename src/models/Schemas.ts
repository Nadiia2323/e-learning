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
export { taskModel, UserModel, LyricModel, WordPairsModel,ReadingtaskModel,ClozetestModel,SentenceoptionsModel,listeningtasksModel,trueorfalseModel,pictureMatchModel,testyourselfModel };

//Carmdel created to test populate
//#region
// const CarSchema = new mongoose.Schema({
//     name: String,
//     user:{type:mongoose.Schema.Types.ObjectId, ref:"user"}
// })

// const CarModel = mongoose.models.car || mongoose.model('car', CarSchema);
//#endregion
