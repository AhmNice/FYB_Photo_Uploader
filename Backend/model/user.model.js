import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  nickname: {
    type: String,
    trim: true
  },
  filePath: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

 export const User = mongoose.model('User', userSchema);