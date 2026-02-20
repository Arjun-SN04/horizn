const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { listingschema } = require('../schema');
const { isLoggedIn, isOwner, validateListing } = require('../middleware');
const Listing = require('../models/listing');
const multer = require('multer');
const { storage } = require('../cloudConfig');
const upload = multer({ storage });

const listingControllers = require('../controllers/listings');

// Get new listing form / Create new listing
router.route('/new')
  .get(isLoggedIn, wrapAsync(listingControllers.getNewRender))
  .post(isLoggedIn, validateListing, upload.single('lististing[image]'), wrapAsync(listingControllers.createNewListing));

// Update listing
router.patch('/:id', isLoggedIn, isOwner, validateListing, upload.single('lististing[image]'), wrapAsync(listingControllers.updateListing));

// Delete listing
router.delete('/:id/delete', isLoggedIn, isOwner, wrapAsync(listingControllers.deleteListing));

// Get all listings — no login required so guests can browse
router.get('/', wrapAsync(listingControllers.getAllListings));

module.exports = router;