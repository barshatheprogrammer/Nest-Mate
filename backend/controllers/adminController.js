const User = require('../models/User');
const Flat = require('../models/Flat');
const Report = require('../models/Report');
const Review = require('../models/Review');
const Match = require('../models/Match');
const ConnectionRequest = require('../models/ConnectionRequest');
const AdminActivity = require('../models/AdminActivity');
const Notification = require('../models/Notification');

// Utility to log admin actions
const logAdminAction = async (adminId, action, targetType, targetId, description) => {
  try {
    await AdminActivity.create({
      adminId,
      action,
      targetType,
      targetId,
      description
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
};

// @desc    Get dashboard KPIs
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalOwners = await User.countDocuments({ role: 'owner' });
    const totalFlats = await Flat.countDocuments();
    const pendingFlats = await Flat.countDocuments({ status: 'pending' });
    const totalMatches = await Match.countDocuments();
    const activeConnections = await ConnectionRequest.countDocuments({ status: 'accepted' });
    const pendingReports = await Report.countDocuments({ status: 'Pending' });

    res.json({
      totalStudents,
      totalOwners,
      totalFlats,
      pendingFlats,
      totalMatches,
      activeConnections,
      pendingReports
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recent admin activity
// @route   GET /api/admin/activity
// @access  Private/Admin
const getRecentActivity = async (req, res) => {
  try {
    const activities = await AdminActivity.find()
      .populate('adminId', 'name')
      .sort({ timestamp: -1 })
      .limit(20);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get users by role (paginated)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10, search, status } = req.query;
    
    let query = { role: role || 'student' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
      
    const total = await User.countDocuments(query);

    res.json({
      users,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user details (including activity)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // We could fetch related profile, flats, matches, etc. based on role
    // For now, return basic user info. Frontend can make additional calls if needed.
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot modify admin status here' });

    user.status = status;
    await user.save();
    
    await logAdminAction(req.user.id, `Changed user status to ${status}`, 'User', user._id, `Admin ${req.user.name} changed ${user.name}'s status to ${status}`);

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all flats (paginated)
// @route   GET /api/admin/flats
// @access  Private/Admin
const getFlats = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const flats = await Flat.find(query)
      .populate('ownerId', 'name email status')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
      
    const total = await Flat.countDocuments(query);

    res.json({
      flats,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update flat status (approve/reject)
// @route   PUT /api/admin/flats/:id/status
// @access  Private/Admin
const updateFlatStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const flat = await Flat.findById(req.params.id);
    
    if (!flat) return res.status(404).json({ message: 'Flat not found' });

    flat.status = status;
    await flat.save();
    
    await logAdminAction(req.user.id, `Changed flat status to ${status}`, 'Flat', flat._id, `Admin ${req.user.name} changed flat ${flat.title} status to ${status}`);

    res.json(flat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reports (paginated)
// @route   GET /api/admin/reports
// @access  Private/Admin
const getReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = {};
    if (status && status !== 'all') query.status = status;

    const reports = await Report.find(query)
      .populate('reportedBy', 'name email')
      .populate('reportedUser', 'name email')
      .populate('flatId', 'title')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
      
    const total = await Report.countDocuments(query);

    res.json({
      reports,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update report status
// @route   PUT /api/admin/reports/:id/status
// @access  Private/Admin
const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const report = await Report.findById(req.params.id);
    
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.status = status;
    if (status === 'Resolved' || status === 'Dismissed') {
      report.resolvedAt = Date.now();
    }
    await report.save();
    
    await logAdminAction(req.user.id, `Changed report status to ${status}`, 'Report', report._id, `Admin ${req.user.name} marked report as ${status}`);

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    // We can expand this with complex aggregations later
    // For now, return basic counts for charts
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    
    const flatsByStatus = await Flat.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const flatsByBhk = await Flat.aggregate([
      { $group: { _id: '$bhk', count: { $sum: 1 } } }
    ]);
    
    const flatsByLocation = await Flat.aggregate([
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      usersByRole,
      flatsByStatus,
      flatsByBhk,
      flatsByLocation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getRecentActivity,
  getUsers,
  getUserDetails,
  updateUserStatus,
  getFlats,
  updateFlatStatus,
  getReports,
  updateReportStatus,
  getAnalytics
};
