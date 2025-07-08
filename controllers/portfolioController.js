import Portfolio from '../models/Portfolio.js';
import cloudinary from '../utils/Cloudinary.js';

// CREATE
export const createPortfolioItem = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

     // Upload  temp file to Cloudinary
     const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'portfolio',
    });


    const imageUrl = uploadResult.secure_url;
    const publicId = uploadResult.public_id;

    const item = new Portfolio({
      title,
      description,
      category,
      image: imageUrl,
      publicId,
      createdBy: req.user?._id, // Optional: depends on auth middleware
    });

    await item.save();
    res.status(201).json({ message: 'Portfolio item created', item });
  } catch (err) {
    console.error('Create Portfolio Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// READ
export const getAllPortfolioItems = async (req, res) => {
  try {
    const items = await Portfolio.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (err) {
    console.error('Get Portfolio Error:', err);
    res.status(500).json({ message: 'Failed to fetch portfolio items' });
  }
};

// DELETE
export const deletePortfolioItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Portfolio.findById(id);

    if (!item) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    // Delete Cloudinary image if available
    if (item.publicId) {
      await cloudinary.uploader.destroy(item.publicId);
    }

    // Delete document
    await Portfolio.findByIdAndDelete(id);
    res.status(200).json({ message: 'Portfolio item deleted successfully' });
  } catch (err) {
    console.error('Delete Portfolio Error:', err);
    res.status(500).json({ message: 'Failed to delete portfolio item' });
  }
};

// UPDATE
export const updatePortfolioItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    const item = await Portfolio.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    // If a new image file is uploaded, handle Cloudinary replacement
    if (req.file) {
      // Delete the old image
      if (item.publicId) {
        await cloudinary.uploader.destroy(item.publicId);
      }

      // Upload the new one
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'portfolio',
      });

      item.image = uploadResult.secure_url;
      item.publicId = uploadResult.public_id;
    }

    // Update text fields
    item.title = title || item.title;
    item.description = description || item.description;
    item.category = category || item.category;

    await item.save();
    res.status(200).json({ message: 'Portfolio item updated', item });
  } catch (err) {
    console.error('Update Portfolio Error:', err);
    res.status(500).json({ message: 'Failed to update portfolio item' });
  }
};
