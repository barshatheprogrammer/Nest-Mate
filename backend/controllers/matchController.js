const Match = require('../models/Match');

// @desc    Get current user matches
// @route   GET /api/matches
// @access  Private
const getMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [{ user1: req.user.id }, { user2: req.user.id }]
    })
      .populate('user1', 'name profileImage college city')
      .populate('user2', 'name profileImage college city')
      .populate('flatId', 'title location monthlyRent')
      .sort({ overallScore: -1 });

    // Format response to always have 'matchedUser' instead of user1/user2 logic on frontend
    const formattedMatches = matches.map(match => {
      const isUser1 = match.user1._id.toString() === req.user.id;
      const matchedUser = isUser1 ? match.user2 : match.user1;
      
      return {
        _id: match._id,
        matchedUser,
        flat: match.flatId,
        flatMatchScore: match.flatMatchScore,
        roommateMatchScore: match.roommateMatchScore,
        overallScore: match.overallScore,
        status: match.status,
        createdAt: match.createdAt
      };
    });

    res.json(formattedMatches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMatches
};
