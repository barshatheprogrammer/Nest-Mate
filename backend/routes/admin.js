const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
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
} = require('../controllers/adminController');

// All routes are protected and require admin role
router.use(protect, admin);

// Dashboard & Analytics
router.get('/dashboard/stats', getDashboardStats);
router.get('/activity', getRecentActivity);
router.get('/analytics', getAnalytics);

// Users (Students & Owners)
router.get('/users', getUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id/status', updateUserStatus);

// Flats
router.get('/flats', getFlats);
router.put('/flats/:id/status', updateFlatStatus);

// Reports
router.get('/reports', getReports);
router.put('/reports/:id/status', updateReportStatus);

module.exports = router;
