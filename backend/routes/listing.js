const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isOwner, validateListing } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudConfig');
const upload = multer({ storage });

const listingControllers = require('../controllers/listings');

// Get all listings — no login required
router.get('/', wrapAsync(listingControllers.getAllListings));

// New listing form
router.get('/new', isLoggedIn, wrapAsync(listingControllers.getNewRender));

// Create new listing — upload FIRST, then validate
router.post('/new', isLoggedIn, upload.single('lististing[image]'), validateListing, wrapAsync(listingControllers.createNewListing));

// Update listing — upload FIRST, then validate
router.patch('/:id', isLoggedIn, isOwner, upload.single('lististing[image]'), validateListing, wrapAsync(listingControllers.updateListing));

// Delete listing
router.delete('/:id/delete', isLoggedIn, isOwner, wrapAsync(listingControllers.deleteListing));

module.exports = router;
