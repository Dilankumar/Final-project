// index.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import userRoutes from './routes/userroutes.js';
import authRoutes from './routes/authroutes.js';
import themeRoutes from './routes/themeRoutes.js';
import adminroutes from './routes/adminroutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';


dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Routes
// app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/admin', adminroutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/portfolio', portfolioRoutes);




// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
