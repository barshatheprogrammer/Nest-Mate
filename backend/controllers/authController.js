const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, college, city } = req.body;

    // Validation
    if (!name || !email || !password || !college || !city) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      college,
      city
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        city: user.city,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sync Clerk user and get custom token
// @route   POST /api/auth/clerk-sync
// @access  Public
const syncClerkUser = async (req, res) => {
  try {
    const { email, clerkId, name, imageUrl } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required for syncing' });
    }

    // Check for user
    let user = await User.findOne({ email });

    if (!user) {
      // Race condition: Webhook hasn't finished, create user here
      user = new User({
        clerkId,
        email,
        name: name || 'User',
        profileImage: imageUrl || 'default.jpg',
        college: 'Not specified',
        city: 'Not specified',
        password: 'OAUTH_PROVIDER_NO_PASSWORD'
      });
      await user.save();
      
      // Also create an empty profile
      const Profile = require('../models/Profile');
      const newProfile = new Profile({ user: user._id });
      await newProfile.save();
    }

    // Always sync the latest profile image from Clerk
    if (user && imageUrl && user.profileImage !== imageUrl) {
      user.profileImage = imageUrl;
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      college: user.college,
      city: user.city,
      profileImage: user.profileImage,
      token: generateToken(user._id)
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error means webhook created it just now
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          college: user.college,
          city: user.city,
          profileImage: user.profileImage,
          token: generateToken(user._id)
        });
      }
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  syncClerkUser
};
