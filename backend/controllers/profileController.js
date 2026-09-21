const Profile = require('../models/Profile');

// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private
const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'email', 'profileImage']);
    
    if (!profile) {
      return res.status(404).json({ message: 'There is no profile for this user' });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update user profile
// @route   POST /api/profile
// @access  Private
const createOrUpdateProfile = async (req, res) => {
  try {
    const {
      age, course, location, bio, budgetMin, budgetMax, roomType,
      foodPreference, smoking, drinking, pets, studySchedule, sleepSchedule,
      cleanliness, socialPreference
    } = req.body;

    // Build profile object
    const profileFields = { user: req.user.id };
    
    if (age) profileFields.age = age;
    if (course) profileFields.course = course;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (budgetMin) profileFields.budgetMin = budgetMin;
    if (budgetMax) profileFields.budgetMax = budgetMax;
    if (roomType) profileFields.roomType = roomType;
    if (foodPreference) profileFields.foodPreference = foodPreference;
    if (smoking) profileFields.smoking = smoking;
    if (drinking) profileFields.drinking = drinking;
    if (pets) profileFields.pets = pets;
    if (studySchedule) profileFields.studySchedule = studySchedule;
    if (sleepSchedule) profileFields.sleepSchedule = sleepSchedule;
    if (cleanliness) profileFields.cleanliness = cleanliness;
    if (socialPreference) profileFields.socialPreference = socialPreference;

    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // Update existing profile
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    // Create new profile
    profile = new Profile(profileFields);
    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all profiles (for discovery)
// @route   GET /api/profile/all
// @access  Private
const getAllProfiles = async (req, res) => {
  try {
    // Exclude current user's profile from the list
    const profiles = await Profile.find({ user: { $ne: req.user.id } })
                                  .populate('user', ['name', 'profileImage', 'college', 'city']);
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get profile by user ID
// @route   GET /api/profile/user/:user_id
// @access  Private
const getProfileByUserId = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id })
                                 .populate('user', ['name', 'profileImage', 'college', 'city']);
                                 
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ message: 'Profile not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyProfile,
  createOrUpdateProfile,
  getAllProfiles,
  getProfileByUserId
};
