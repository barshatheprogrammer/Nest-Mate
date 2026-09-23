const ConnectionRequest = require('../models/ConnectionRequest');
const Match = require('../models/Match');

// @desc    Send a connection request
// @route   POST /api/requests
// @access  Private
const sendRequest = async (req, res) => {
  try {
    const { receiverId, flatId, matchId, compatibilityScore } = req.body;
    
    // Check if request already exists
    const existingRequest = await ConnectionRequest.findOne({
      senderId: req.user.id,
      receiverId,
      flatId
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Request already sent for this flat' });
    }

    const newRequest = new ConnectionRequest({
      senderId: req.user.id,
      receiverId,
      flatId,
      matchId,
      compatibilityScore
    });

    await newRequest.save();
    
    // Update match status to requested if match exists
    if (matchId) {
      await Match.findByIdAndUpdate(matchId, { status: 'requested' });
    }

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get received requests
// @route   GET /api/requests/received
// @access  Private
const getReceivedRequests = async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({ receiverId: req.user.id })
      .populate('senderId', 'name profileImage college city')
      .populate('flatId', 'title location monthlyRent')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sent requests
// @route   GET /api/requests/sent
// @access  Private
const getSentRequests = async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({ senderId: req.user.id })
      .populate('receiverId', 'name profileImage college city')
      .populate('flatId', 'title location monthlyRent')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update request status (Accept/Reject)
// @route   PUT /api/requests/:id
// @access  Private
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await ConnectionRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.receiverId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    request.status = status;
    await request.save();

    if (status === 'accepted' && request.matchId) {
      await Match.findByIdAndUpdate(request.matchId, { status: 'connected' });
    } else if (status === 'rejected' && request.matchId) {
      await Match.findByIdAndUpdate(request.matchId, { status: 'rejected' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendRequest,
  getReceivedRequests,
  getSentRequests,
  updateRequestStatus
};
