// models/Theme.js
import mongoose from 'mongoose';

const themeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  colors: {
    background: String,
    primary: String,
    text: String,
  },
  font: {
    type: String,
  },
  layoutType: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Theme = mongoose.model('Theme', themeSchema);
export default Theme;
