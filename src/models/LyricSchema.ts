import mongoose from 'mongoose';

const Lyric = new  mongoose.Schema({
  lyric: String,
  author: String,
  video: String,
  listening: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listening' 
  },
  speaking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Speaking' 
  },
  reading: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reading' 
  },
  writing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Writing' 
  },
  testYourself: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestYourself' 
  }
});

export default mongoose.models.Lyric || mongoose.model('lyric', Lyric);



