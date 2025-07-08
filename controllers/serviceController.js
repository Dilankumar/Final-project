import Service from '../models/Service.js';
import cloudinary from '../utils/Cloudinary.js';

// @desc    Create a new service
// @route   POST /api/services
// @access  Admin
export const createService = async (req, res) => {
  try {
    const { title, description} = req.body;

      if (!req.file) {
          return res.status(400).json({ message: 'Image file is required' });
        }
    
         // Upload  temp file to Cloudinary
         const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: 'services',
        });

        const imageUrl = uploadResult.secure_url;
    const publicId = uploadResult.public_id;


    const newService = new Service({
      title,
      description,
      image: imageUrl,
      publicId,
      createdBy: req.user._id,
    });

    await newService.save();
    res.status(201).json({ message: 'Service created', service: newService });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    console.error('Fetch services error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Admin
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Handle updates from multipart/form-data
    const { title, description } = req.body;

    // Update fields
    service.title = title || service.title;
    service.description = description || service.description;

    // If a new image is uploaded
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (service.publicId) {
        await cloudinary.uploader.destroy(service.publicId);
      }

      // Upload new image
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'services',
      });

      service.image = uploadResult.secure_url;
      service.publicId = uploadResult.public_id;
    }

    await service.save();
    res.status(200).json({ message: 'Service updated', service });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Admin
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.publicId) {
      try {
        await cloudinary.uploader.destroy(service.publicId);
      } catch (err) {
        console.warn('Cloudinary image deletion failed:', err.message);
      }
    }

    await Service.findByIdAndDelete(id);
    res.status(200).json({ message: 'Service deleted' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
