const Listing = require('../models/listing');
const { geocodeLocation } = require('../utils/geocode');

module.exports.getShowPage = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: 'reviews', populate: { path: 'author' } })
    .populate('owner');

  if (!listing) {
    return res.status(404).json({ message: 'Listing not found' });
  }
  res.json({ listing });
};

module.exports.getEditRender = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    return res.status(404).json({ message: 'Listing not found' });
  }
  const originalUrl = listing.image
    ? listing.image.replace('/upload', '/upload/h_300/w_250')
    : '';
  res.json({ listing, originalUrl });
};

module.exports.getNewRender = async (req, res) => {
  res.json({ message: 'Ready to create new listing' });
};

module.exports.createNewListing = async (req, res, next) => {
  const coverFile = req.files?.['lististing[image]']?.[0];
  if (!coverFile) {
    return res.status(400).json({ success: false, message: 'Image is required' });
  }
  const galleryFiles = req.files?.['lististing[images]'] || [];

  const geometry = await geocodeLocation(`${req.body.lististing.location}, ${req.body.lististing.country}`);
  if (!geometry) {
    return res.status(400).json({ success: false, message: 'Could not geocode the given location' });
  }

  const newListing = new Listing(req.body.lististing);
  newListing.owner    = req.user._id;
  newListing.image    = coverFile.path;
  newListing.images   = galleryFiles.map((f) => f.path);
  newListing.geometry = geometry;
  await newListing.save();

  res.json({ success: true, message: 'Successfully created a new listing', listing: newListing });
};

module.exports.updateListing = async (req, res) => {
  if (!req.body.lististing) {
    return res.status(400).json({ success: false, message: 'Send valid listing data' });
  }
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.lististing }, { new: true });

  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }

  const coverFile = req.files?.['lististing[image]']?.[0];
  if (coverFile) {
    listing.image = coverFile.path;
  }

  if (req.body.removeImages) {
    try {
      const toRemove = new Set(JSON.parse(req.body.removeImages));
      listing.images = listing.images.filter((url) => !toRemove.has(url));
    } catch { /* ignore malformed payload */ }
  }

  const galleryFiles = req.files?.['lististing[images]'] || [];
  if (galleryFiles.length) {
    listing.images = [...listing.images, ...galleryFiles.map((f) => f.path)];
  }

  await listing.save();
  res.json({ success: true, message: 'Successfully updated the listing', listing });
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndDelete(id);
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }
  res.json({ success: true, message: 'Successfully deleted the listing' });
};

module.exports.getAllListings = async (req, res) => {
  const filter = req.query.owner ? { owner: req.query.owner } : {};
  const allListings = await Listing.find(filter).populate('reviews');
  res.json({ allListings });
};
