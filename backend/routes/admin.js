const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isAdmin } = require('../middleware');
const reportController = require('../controllers/reports');

router.get('/reports', isLoggedIn, isAdmin, wrapAsync(reportController.getAllReports));
router.patch('/reports/:id', isLoggedIn, isAdmin, wrapAsync(reportController.updateReportStatus));

module.exports = router;
