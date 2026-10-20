const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isAdmin } = require('../middleware');
const reportController = require('../controllers/reports');
const bookingController = require('../controllers/bookings');

router.get('/reports', isLoggedIn, isAdmin, wrapAsync(reportController.getAllReports));
router.patch('/reports/:id', isLoggedIn, isAdmin, wrapAsync(reportController.updateReportStatus));
router.get('/bookings', isLoggedIn, isAdmin, wrapAsync(bookingController.getAllBookings));

module.exports = router;
