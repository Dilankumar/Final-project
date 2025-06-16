// controllers/portfolioController.js
import Portfolio from '../models/Portfolio.js';

// 🔐 Admin - Upload Portfolio Item
export const createPortfolioItem = async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;

    const item = new Portfolio({
      title,
      description,
      imageUrl,
      createdBy: req.user._id // Admin ID
    });

    await item.save();
    res.status(201).json({ message: 'Portfolio item created', item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// 🌐 Public - Get all portfolio items
export const getAllPortfolioItems = async (req, res) => {
  try {
    const items = await Portfolio.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch portfolio items' });
  }
};
