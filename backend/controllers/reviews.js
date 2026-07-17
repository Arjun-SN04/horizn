const Listing = require('../models/listing');
const Review = require('../models/review');
const Notification = require('../models/notification');

module.exports.postReview = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; // Set the author to the current user
    await newReview.save();

    await Listing.findByIdAndUpdate(id, { $push: { reviews: newReview } });

    if (listing && listing.owner && !listing.owner.equals(req.user._id)) {
        await Notification.create({
            recipient: listing.owner,
            message: `${req.user.username} left a ${newReview.rating}-star review on your listing "${listing.title}"`,
            listing: listing._id,
        });
    }

    res.json({ success: true, message: 'Successfully added a new review' });
}

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.json({ success: true, message: 'Successfully deleted the review' });
}
