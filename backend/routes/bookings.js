const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn } = require('../middleware');
const bookingController = require('../controllers/bookings');

// My trips — as a guest
router.get('/mine', isLoggedIn, wrapAsync(bookingController.getMyBookings));

// Reservations on listings I host
router.get('/hosting', isLoggedIn, wrapAsync(bookingController.getHostBookings));

// Cancel a booking — guest or host
router.delete('/:bookingId', isLoggedIn, wrapAsync(bookingController.cancelBooking));

module.exports = router;
