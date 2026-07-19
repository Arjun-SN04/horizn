module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        return res.status(401).json({ success: false, message: 'You must be logged in to do that' });
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
}

const Listing = require('./models/listing');

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(req.user._id) && !req.user.isAdmin) {
        return res.status(403).json({ success: false, message: 'You do not have permission to edit this listing' });
    }
    next();
}

module.exports.isAdmin = (req, res, next) => {
    if (!req.user?.isAdmin) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
}

const Review = require('./models/review');

module.exports.isAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        return res.status(403).json({ success: false, message: 'You do not have permission to delete this review' });
    }
    next();
}

const { listingschema } = require('./schema');
const ExpressError = require('./utils/ExpressError');

module.exports.validateListing = (req, res, next) => {
    if (req.body.lististing && typeof req.body.lististing.amenities === 'string') {
        try {
            req.body.lististing.amenities = JSON.parse(req.body.lististing.amenities);
        } catch {
            req.body.lististing.amenities = [];
        }
    }
    let { error } = listingschema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        return next(new ExpressError(400, msg));
    }
    next();
};

const { userSchema } = require('./schema');

module.exports.validateUser = (req, res, next) => {
    try {
        const { error } = userSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: false
        });

        if (error) {
            const messages = error.details.map(el => el.message);

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: messages,
                details: error.details.map(d => ({ path: d.path.join('.'), message: d.message }))
            });
        }

        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Validation error',
            error: err.message
        });
    }
};