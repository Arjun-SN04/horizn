const Booking = require('../models/booking');
const Listing = require('../models/listing');
const Notification = require('../models/notification');

const MS_PER_NIGHT = 1000 * 60 * 60 * 24;

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

module.exports.getBookedDates = async (req, res) => {
  const { id } = req.params;
  const bookings = await Booking.find({ listing: id, status: 'confirmed' }).select('checkIn checkOut -_id');
  res.json({ success: true, bookedRanges: bookings });
};

module.exports.createBooking = async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut, guests } = req.body.booking;

  const listing = await Listing.findById(id);
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }
  if (listing.owner?.equals(req.user._id)) {
    return res.status(400).json({ success: false, message: "You can't book your own listing" });
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkInDate < startOfToday()) {
    return res.status(400).json({ success: false, message: 'Check-in date cannot be in the past' });
  }
  if (guests > (listing.guests || 1)) {
    return res.status(400).json({ success: false, message: `This listing sleeps a maximum of ${listing.guests || 1} guests` });
  }

  const overlap = await Booking.findOne({
    listing: id,
    status: 'confirmed',
    checkIn: { $lt: checkOutDate },
    checkOut: { $gt: checkInDate },
  });
  if (overlap) {
    return res.status(409).json({ success: false, message: 'These dates are no longer available for this listing' });
  }

  const nights = Math.round((checkOutDate - checkInDate) / MS_PER_NIGHT);
  const totalPrice = nights * listing.price;

  const booking = await Booking.create({
    listing: id,
    guest: req.user._id,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    guests,
    nights,
    totalPrice,
  });

  const notifications = [
    {
      recipient: req.user._id,
      message: `Your stay at "${listing.title}" is confirmed for ${nights} night${nights !== 1 ? 's' : ''}`,
      listing: listing._id,
    },
  ];
  if (listing.owner) {
    notifications.push({
      recipient: listing.owner,
      message: `${req.user.username} booked "${listing.title}" for ${nights} night${nights !== 1 ? 's' : ''}`,
      listing: listing._id,
    });
  }
  await Notification.insertMany(notifications);

  res.status(201).json({ success: true, message: 'Booking confirmed', booking });
};

module.exports.getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ guest: req.user._id })
    .populate('listing')
    .sort({ checkIn: 1 });
  res.json({ success: true, bookings });
};

module.exports.getHostBookings = async (req, res) => {
  const myListings = await Listing.find({ owner: req.user._id }).select('_id');
  const listingIds = myListings.map((l) => l._id);

  const bookings = await Booking.find({ listing: { $in: listingIds }, status: 'confirmed' })
    .populate('listing')
    .populate('guest', 'username')
    .sort({ checkIn: 1 });

  res.json({ success: true, bookings, listingCount: myListings.length });
};

module.exports.cancelBooking = async (req, res) => {
  const { bookingId } = req.params;
  const booking = await Booking.findById(bookingId).populate('listing');
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  const isGuest = booking.guest.equals(req.user._id);
  const isHost = booking.listing?.owner?.equals(req.user._id);
  if (!isGuest && !isHost) {
    return res.status(403).json({ success: false, message: 'You do not have permission to cancel this booking' });
  }

  booking.status = 'cancelled';
  await booking.save();

  const notifyRecipient = isGuest ? booking.listing?.owner : booking.guest;
  const cancelledBy = isGuest ? req.user.username : 'The host';
  if (notifyRecipient) {
    await Notification.create({
      recipient: notifyRecipient,
      message: `${cancelledBy} cancelled the reservation for "${booking.listing?.title}"`,
      listing: booking.listing?._id,
    });
  }

  res.json({ success: true, message: 'Booking cancelled' });
};
