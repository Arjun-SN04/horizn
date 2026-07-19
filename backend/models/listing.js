const mongodb = require("mongoose");
const schema = mongodb.Schema;
const review = require("./review");

const listingschema = new schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    // default:
    //   "https://plus.unsplash.com/premium_photo-1751107029838-c341391ea8b2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // set: (v) =>
    //   v === ""
    //     ? "https://plus.unsplash.com/premium_photo-1751107029838-c341391ea8b2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    //     : v,
  },
  images: {
    type: [String],
    default: [],
  },
  price: Number,
  location: String,
  country: String,
  guests: {
    type: Number,
    default: 1,
  },
  bedrooms: {
    type: Number,
    default: 1,
  },
  bathrooms: {
    type: Number,
    default: 1,
  },
  amenities: {
    type: [String],
    default: [],
  },
  reviews: [
    {
      type: schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner:{
    type: schema.Types.ObjectId,
    ref: "User",
   
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"], // 'location' must be a string
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});
//middleware to delete reviews and cancel bookings when listing is deleted
listingschema.post("findOneAndDelete", async (listing) => {
  if (!listing) return;
  await review.deleteMany({ _id: { $in: listing.reviews } });

  const Booking = require("./booking");
  const Notification = require("./notification");
  const affectedBookings = await Booking.find({ listing: listing._id, status: "confirmed" });
  if (affectedBookings.length) {
    await Booking.updateMany({ _id: { $in: affectedBookings.map((b) => b._id) } }, { status: "cancelled" });
    await Notification.insertMany(affectedBookings.map((b) => ({
      recipient: b.guest,
      message: `Your reservation for "${listing.title}" was cancelled because the listing was removed`,
      listing: listing._id,
    })));
  }
});

const listing = mongodb.model("listing", listingschema);

module.exports = listing;
