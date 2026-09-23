const Flat = require('../models/Flat');
const FlatInterest = require('../models/FlatInterest');
const User = require('../models/User');

// @desc    Add a new flat
// @route   POST /api/owner/flats
// @access  Private/Owner
const addFlat = async (req, res) => {
  try {
    const flat = new Flat({
      ...req.body,
      ownerId: req.user.id,
      status: 'approved' // Setting to approved by default as per plan discussion
    });
    const createdFlat = await flat.save();
    res.status(201).json(createdFlat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get owner's flats
// @route   GET /api/owner/flats
// @access  Private/Owner
const getOwnerFlats = async (req, res) => {
  try {
    const flats = await Flat.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
    res.json(flats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single owner flat by ID
// @route   GET /api/owner/flats/:id
// @access  Private/Owner
const getOwnerFlatById = async (req, res) => {
  try {
    const flat = await Flat.findOne({ _id: req.params.id, ownerId: req.user.id });
    if (!flat) return res.status(404).json({ message: 'Flat not found' });
    res.json(flat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update owner's flat
// @route   PUT /api/owner/flats/:id
// @access  Private/Owner
const updateOwnerFlat = async (req, res) => {
  try {
    const flat = await Flat.findOne({ _id: req.params.id, ownerId: req.user.id });
    if (!flat) return res.status(404).json({ message: 'Flat not found' });

    // Ensure ownerId is not changed
    const updateData = { ...req.body };
    delete updateData.ownerId;

    const updatedFlat = await Flat.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    res.json(updatedFlat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete owner's flat
// @route   DELETE /api/owner/flats/:id
// @access  Private/Owner
const deleteOwnerFlat = async (req, res) => {
  try {
    const flat = await Flat.findOne({ _id: req.params.id, ownerId: req.user.id });
    if (!flat) return res.status(404).json({ message: 'Flat not found' });

    await Flat.deleteOne({ _id: req.params.id });
    
    // Also delete associated interests
    await FlatInterest.deleteMany({ flatId: req.params.id });

    res.json({ message: 'Flat removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get interested students for owner's flats
// @route   GET /api/owner/interests
// @access  Private/Owner
const getOwnerInterests = async (req, res) => {
  try {
    // Find all flats owned by this owner
    const flats = await Flat.find({ ownerId: req.user.id }).select('_id title');
    const flatIds = flats.map(f => f._id);

    // Find all interests for these flats
    const interests = await FlatInterest.find({ flatId: { $in: flatIds } })
      .populate('userId', 'name email phone college profileImage')
      .populate('flatId', 'title location monthlyRent')
      .sort({ createdAt: -1 });

    res.json(interests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get owner profile
// @route   GET /api/owner/profile
// @access  Private/Owner
const getOwnerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update owner profile
// @route   PUT /api/owner/profile
// @access  Private/Owner
const updateOwnerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.city = req.body.city || user.city;
    if (req.body.profileImage) user.profileImage = req.body.profileImage;
    if (req.body.coverImage) user.coverImage = req.body.coverImage;
    if (req.body.password) user.password = req.body.password;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      city: updatedUser.city,
      profileImage: updatedUser.profileImage,
      coverImage: updatedUser.coverImage
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addFlat,
  getOwnerFlats,
  getOwnerFlatById,
  updateOwnerFlat,
  deleteOwnerFlat,
  getOwnerInterests,
  getOwnerProfile,
  updateOwnerProfile
};
