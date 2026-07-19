const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { bookingSchema } = require('../schema');
const { isLoggedIn } = require('../middleware');
const bookingController = require('../controllers/bookings');

const validateBooking = (req, res, next) => {
  const { error } = bookingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(', ');
    return next(new ExpressError(400, msg));
  }
  next();
};

// Booked date ranges for a listing — PUBLIC
router.get('/', wrapAsync(bookingController.getBookedDates));

// Create a booking — PROTECTED
router.post('/', isLoggedIn, validateBooking, wrapAsync(bookingController.createBooking));

module.exports = router;
