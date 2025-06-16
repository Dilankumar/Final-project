// controllers/themeController.js
import Theme from '../models/theme.js';
import User from '../models/User.js';

// Admin creates a theme for a user
export const createTheme = async (req, res) => {
  try {
    const { userId, prompt, colors, font, layoutType } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const theme = new Theme({
      userId,
      colors,
      layoutType,
      createdBy: req.user._id,
    });

    await theme.save();
    res.status(201).json({ message: 'Theme created successfully', theme });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// User gets their theme
export const getUserTheme = async (req, res) => {
  try {
    const { userId } = req.params;

    const theme = await Theme.findOne({ userId });
    if (!theme) return res.status(404).json({ message: 'Theme not found' });

    res.status(200).json(theme);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
