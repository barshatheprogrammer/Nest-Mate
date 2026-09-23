const FlatInterest = require('../models/FlatInterest');
const Flat = require('../models/Flat');
const Match = require('../models/Match');
const Profile = require('../models/Profile');

// @desc    Express interest in a flat
// @route   POST /api/flats/:id/interest
// @access  Private
const expressInterest = async (req, res) => {
  try {
    const flatId = req.params.id;
    const userId = req.user.id;
    const { lookingForRoommate, roommateRequirements } = req.body;

    // Check if already interested
    let interest = await FlatInterest.findOne({ userId, flatId });
    if (interest) {
      // Update existing interest
      interest.lookingForRoommate = lookingForRoommate || interest.lookingForRoommate;
      if (roommateRequirements) {
        interest.roommateRequirements = roommateRequirements;
      }
      if (lookingForRoommate) interest.status = 'looking_for_roommate';
      
      await interest.save();
    } else {
      // Create new interest
      interest = new FlatInterest({
        userId,
        flatId,
        lookingForRoommate: lookingForRoommate || false,
        roommateRequirements: roommateRequirements || null,
        status: lookingForRoommate ? 'looking_for_roommate' : 'interested'
      });
      await interest.save();
    }

    // Trigger matching if they are looking for a roommate
    if (interest.lookingForRoommate) {
      await calculateMatchesForUser(userId, flatId, interest);
    }

    res.status(200).json(interest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get users interested in a specific flat
// @route   GET /api/flats/:id/interested-users
// @access  Private
const getInterestedUsers = async (req, res) => {
  try {
    const interests = await FlatInterest.find({ flatId: req.params.id, userId: { $ne: req.user.id }, lookingForRoommate: true })
      .populate('userId', 'name profileImage college city')
      .sort({ createdAt: -1 });
    res.json(interests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's flat interests
// @route   GET /api/flats/my-interests
// @access  Private
const getMyInterests = async (req, res) => {
  try {
    const interests = await FlatInterest.find({ userId: req.user.id }).populate('flatId');
    res.json(interests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Matching Engine
const calculateMatchesForUser = async (userId, flatId, userInterest) => {
  try {
    const otherInterests = await FlatInterest.find({
      flatId,
      userId: { $ne: userId },
      lookingForRoommate: true
    });

    const userProfile = await Profile.findOne({ user: userId });
    
    for (let other of otherInterests) {
      const otherProfile = await Profile.findOne({ user: other.userId });
      
      if (!userProfile || !otherProfile) continue;

      // 1. Flat Compatibility (Assumed High since they are interested in the same flat)
      // We can factor in budget matches from their profiles
      let flatScore = 80;
      if (userProfile.budgetMax >= otherProfile.budgetMin && userProfile.budgetMin <= otherProfile.budgetMax) {
        flatScore += 20; // Budgets overlap perfectly
      } else {
        flatScore += 10; // Still want same flat
      }

      // 2. Roommate Compatibility
      let roommateScore = 0;
      
      // Weights: Food = 10, Smoking = 10, Drinking = 10, Pets = 5, Study = 15, Sleep = 15, Clean = 20, Social = 15
      if (userProfile.foodPreference === 'Any' || otherProfile.foodPreference === 'Any' || userProfile.foodPreference === otherProfile.foodPreference) roommateScore += 10;
      if (userProfile.smoking === otherProfile.smoking || userProfile.smoking === 'Occasionally' || otherProfile.smoking === 'Occasionally') roommateScore += 10;
      if (userProfile.drinking === otherProfile.drinking || userProfile.drinking === 'Occasionally' || otherProfile.drinking === 'Occasionally') roommateScore += 10;
      if (userProfile.pets === otherProfile.pets || userProfile.pets === 'Comfortable with pets' || otherProfile.pets === 'Comfortable with pets') roommateScore += 5;
      if (userProfile.studySchedule === otherProfile.studySchedule) roommateScore += 15;
      if (userProfile.sleepSchedule === otherProfile.sleepSchedule || userProfile.sleepSchedule === 'Flexible' || otherProfile.sleepSchedule === 'Flexible') roommateScore += 15;
      if (userProfile.cleanliness === otherProfile.cleanliness) roommateScore += 20;
      else if (Math.abs(['Low', 'Moderate', 'High'].indexOf(userProfile.cleanliness) - ['Low', 'Moderate', 'High'].indexOf(otherProfile.cleanliness)) === 1) roommateScore += 10;
      if (userProfile.socialPreference === otherProfile.socialPreference || userProfile.socialPreference === 'Balanced' || otherProfile.socialPreference === 'Balanced') roommateScore += 15;

      const overall = Math.round((flatScore * 0.4) + (roommateScore * 0.6));

      // Save Match
      const existingMatch = await Match.findOne({
        $or: [
          { user1: userId, user2: other.userId, flatId },
          { user1: other.userId, user2: userId, flatId }
        ]
      });

      if (!existingMatch) {
        await Match.create({
          user1: userId,
          user2: other.userId,
          flatId,
          flatMatchScore: flatScore,
          roommateMatchScore: roommateScore,
          overallScore: overall
        });
      } else {
        existingMatch.flatMatchScore = flatScore;
        existingMatch.roommateMatchScore = roommateScore;
        existingMatch.overallScore = overall;
        await existingMatch.save();
      }
    }
  } catch (err) {
    console.error('Error calculating matches:', err);
  }
};

module.exports = {
  expressInterest,
  getInterestedUsers,
  getMyInterests
};
