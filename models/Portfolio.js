import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },     
    publicId: String,  
    category: {
      type: String,
      enum: ['wedding', 'portrait', 'event', 'commercial'],
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Refers to Admin
      
    },
  },
  { timestamps: true }
);

export default mongoose.model('Portfolio', portfolioSchema);
