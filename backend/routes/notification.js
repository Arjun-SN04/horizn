const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn } = require('../middleware');
const notificationController = require('../controllers/notifications');

router.get('/', isLoggedIn, wrapAsync(notificationController.getNotifications));
router.patch('/read-all', isLoggedIn, wrapAsync(notificationController.markAllRead));
router.patch('/:id/read', isLoggedIn, wrapAsync(notificationController.markRead));

module.exports = router;
