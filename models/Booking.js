import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  studioName: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  theme: { type: String, required: true },
  reference: { type: String }, // text input reference
  referenceImage: { type: String }, // image URL/path
  timeSlot: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Booking', bookingSchema);
