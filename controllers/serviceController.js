import Service from '../models/Service.js';

// Create a service (Admin)
export const createService = async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;

    const service = new Service({
      title,
      description,
      imageUrl,
      createdBy: req.user._id
    });

    await service.save();
    res.status(201).json({ message: 'Service created', service });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all services (User)
export const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a service (Admin)
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await Service.findByIdAndDelete(id);
    res.status(200).json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
