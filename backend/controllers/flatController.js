const Flat = require('../models/Flat');

// @desc    Get all flats (with filters)
// @route   GET /api/flats
// @access  Public
const getFlats = async (req, res) => {
  try {
    const { location, minRent, maxRent, bhk, furnished, availableFrom } = req.query;
    
    let query = { status: 'approved' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (bhk) query.bhk = Number(bhk);
    if (furnished) query.furnished = furnished;
    
    if (minRent || maxRent) {
      query.monthlyRent = {};
      if (minRent) query.monthlyRent.$gte = Number(minRent);
      if (maxRent) query.monthlyRent.$lte = Number(maxRent);
    }
    
    if (availableFrom) {
      query.availableFrom = { $gte: new Date(availableFrom) };
    }

    const flats = await Flat.find(query).sort({ createdAt: -1 });
    res.json(flats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single flat by ID
// @route   GET /api/flats/:id
// @access  Public
const getFlatById = async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id)
      .populate('ownerId', 'name email phone profileImage');
      
    if (!flat) return res.status(404).json({ message: 'Flat not found' });
    res.json(flat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a flat (Admin only normally, but allowing for demo)
// @route   POST /api/flats
// @access  Private
const createFlat = async (req, res) => {
  try {
    const flat = new Flat(req.body);
    const createdFlat = await flat.save();
    res.status(201).json(createdFlat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getFlats,
  getFlatById,
  createFlat
};
