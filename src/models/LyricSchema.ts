import mongoose from 'mongoose';
import {Schema} from 'mongoose'

const lyricSchema = new Schema({
  lyric: { type:String},
  author: { type:String},
  video: { type:String},
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

const Lyric = mongoose.model('Lyric',lyricSchema)

export default Lyric

