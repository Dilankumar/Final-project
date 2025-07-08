import mongoose from 'mongoose';


const bookingSchema = new mongoose.Schema({
  studioName: String,
  fullName: String,
  email: String,
  address: String,
  theme: String,
  reference: String,
  referenceImage: { type: String }, // Cloudinary image URL
referenceImageId: { type: String },
  additionalNotes: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  adminMessage: String,
  createdAt: { type: Date, default: Date.now },
  date: { type: Date, required: true },  // This is the new field
  meetLink: { type: String },

  
});

const Booking = mongoose.model('Booking', bookingSchema);

// sessionDate: {
//   type: Date,
//   default: null,
// },


export default Booking;