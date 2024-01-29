import mongoose from 'mongoose';
const { Schema } = mongoose;

const lyricSchema = new Schema({
  lyric: {
    type: String
  },
  author: {
    type: String
  },
  video: {
    type: String
  },
  listening: {
    type: Schema.Types.ObjectId,
    ref: 'Listening' 
  },
  speaking: {
    type: Schema.Types.ObjectId,
    ref: 'Speaking' 
  },
  reading: {
    type: Schema.Types.ObjectId,
    ref: 'Reading'
  },
  writing: {
    type: Schema.Types.ObjectId,
    ref: 'Writing' 
  },
  testYourself: {
    type: Schema.Types.ObjectId,
    ref: 'TestYourself' 
  }
});

export default mongoose.model('Lyric', lyricSchema);
