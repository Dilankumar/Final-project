// // controllers/authController.js
// import User from '../models/User.js';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// // Register a new user
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create new user with hashed password and role
//     const newUser = new User({
//       name,
//       email,
//       password:hashedPassword,
//       role,
//     });

//     await newUser.save();

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (err) {
//     console.error('Register Error:', err.message);
//     // res.status(500).json({ message: 'Server Error' });
//   }
// };

// // Login user
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log('Login attempt with:', email);

//     // Check if both fields are present
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     // Find user
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log(' User not found');
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       console.log('Password mismatch');
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Generate JWT
//     const token = jwt.sign(
//       { userId: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     // Respond with token and user info
//     res.status(200).json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     console.error('Login Error:', err.message);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };


import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with hashed password and role
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register Error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt with:', email);

    // Check if both fields are present
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Respond with token and user info
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// View all users (Admin only)
export const viewAllUsers = async (req, res) => {
  try {
    const { role } = req.user; // Assume req.user is populated by middleware
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error('View All Users Error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// View user by ID (Admin only)
export const viewUserById = async (req, res) => {
  try {
    const { role } = req.user; // Assume req.user is populated by middleware
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('View User By ID Error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update user (Admin only)
export const updateUser = async (req, res) => {
  try {
    const { role } = req.user; // Assume req.user is populated by middleware
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Update User Error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const { role } = req.user; // Assume req.user is populated by middleware
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete User Error:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};