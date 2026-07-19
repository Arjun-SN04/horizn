if(process.env.NODE_ENV != 'production')
    require('dotenv').config();  // remove the path option entirely

const mongoose = require('mongoose');
const Listing = require('../models/listing');
const Review = require('../models/review');
const User = require('../models/user');
const sampleListings = require('./samplelist');
const { geocodeLocation } = require('../utils/geocode');

const dbUrl = process.env.MONGODB_ATLAS_URL;

// Dummy reviewer accounts used to seed believable reviews on every listing.
// These are display-only bot accounts with no usable password.
const DUMMY_REVIEWERS = [
  { username: 'traveler_jane', email: 'traveler.jane@example.com' },
  { username: 'wanderlust_max', email: 'wanderlust.max@example.com' },
  { username: 'nomad_priya', email: 'nomad.priya@example.com' },
  { username: 'globetrotter_sam', email: 'globetrotter.sam@example.com' },
  { username: 'backpacker_lee', email: 'backpacker.lee@example.com' },
  { username: 'roadtrip_ana', email: 'roadtrip.ana@example.com' },
  { username: 'jetsetter_omar', email: 'jetsetter.omar@example.com' },
  { username: 'explorer_kate', email: 'explorer.kate@example.com' },
  { username: 'voyager_diego', email: 'voyager.diego@example.com' },
  { username: 'trailblazer_mia', email: 'trailblazer.mia@example.com' },
];

const REVIEW_TEMPLATES = [
  { rating: 5, comment: 'Absolutely stunning place, exactly like the photos. We\'d book again in a heartbeat.' },
  { rating: 5, comment: 'Host was incredibly responsive and the location could not be beat. Highly recommend.' },
  { rating: 5, comment: 'One of the best stays we\'ve had. Spotless, comfortable, and beautifully decorated.' },
  { rating: 4, comment: 'Really enjoyed our stay. A couple of minor things could be improved but overall great value.' },
  { rating: 5, comment: 'Woke up to that view every morning and still can\'t believe it was real. Perfect trip.' },
  { rating: 4, comment: 'Great location and a comfortable bed. Check-in was a little confusing but the host sorted it quickly.' },
  { rating: 5, comment: 'Exceeded expectations in every way. Already recommending it to friends.' },
  { rating: 3, comment: 'Decent stay for the price. Nothing special but did the job for a short trip.' },
  { rating: 5, comment: 'Quiet, clean, and close to everything we wanted to see. Would stay again.' },
  { rating: 4, comment: 'Charming spot with a lot of character. Slightly tricky to find at night, bring data/maps.' },
  { rating: 5, comment: 'Felt like a home away from home. The little touches from the host made the whole trip.' },
  { rating: 4, comment: 'Comfortable and well-equipped. WiFi was a bit patchy but everything else was great.' },
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pickRandom = (arr) => arr[randomInt(0, arr.length - 1)];

async function ensureDummyReviewers() {
  const ids = [];
  for (const reviewer of DUMMY_REVIEWERS) {
    const user = await User.findOneAndUpdate(
      { username: reviewer.username },
      { $setOnInsert: { username: reviewer.username, email: reviewer.email } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    ids.push(user._id);
  }
  return ids;
}

async function ensureReviews(listingId, reviewerIds) {
  const listing = await Listing.findById(listingId).select('reviews');
  if (listing.reviews.length > 0) return 0;

  const reviewCount = randomInt(2, 5);
  const shuffledReviewers = [...reviewerIds].sort(() => Math.random() - 0.5).slice(0, reviewCount);
  const reviewIds = [];

  for (const authorId of shuffledReviewers) {
    const template = pickRandom(REVIEW_TEMPLATES);
    const review = await Review.create({
      rating: template.rating,
      comment: template.comment,
      author: authorId,
    });
    reviewIds.push(review._id);
  }

  await Listing.findByIdAndUpdate(listingId, { $push: { reviews: { $each: reviewIds } } });
  return reviewIds.length;
}

// Rough keyword → amenity inference so seeded listings carry believable
// guest/bedroom/bathroom counts and amenities instead of bare schema defaults.
const AMENITY_KEYWORDS = [
  { amenity: 'ocean_view', keywords: ['beach', 'ocean', 'coastal', 'island', 'harbour', 'harbor', 'lake', 'bay', 'copacabana'] },
  { amenity: 'parking', keywords: ['cabin', 'lodge', 'chalet', 'villa', 'house', 'estate', 'farm', 'cottage'] },
  { amenity: 'ac', keywords: ['desert', 'dubai', 'tropical', 'marrakech', 'phuket', 'bali', 'singapore', 'rio', 'havana'] },
  { amenity: 'tv', keywords: ['apartment', 'loft', 'flat', 'penthouse', 'suite'] },
  { amenity: 'gym', keywords: ['penthouse', 'resort', 'villa', 'suite', 'estate'] },
  { amenity: 'washer', keywords: ['apartment', 'loft', 'flat', 'house', 'cottage', 'cabin'] },
  { amenity: 'pets', keywords: ['cabin', 'cottage', 'farm', 'lodge', 'house'] },
  { amenity: 'breakfast', keywords: ['villa', 'resort', 'chalet', 'riad', 'castle', 'estate', 'suite'] },
];

function inferAmenities(listing) {
  const text = `${listing.title} ${listing.description} ${listing.location}`.toLowerCase();
  const amenities = new Set(['wifi', 'kitchen']);
  for (const { amenity, keywords } of AMENITY_KEYWORDS) {
    if (keywords.some((k) => text.includes(k))) amenities.add(amenity);
  }
  return Array.from(amenities);
}

function inferCapacity(price) {
  if (price < 1000) return { guests: 2, bedrooms: 1, bathrooms: 1 };
  if (price < 1800) return { guests: 4, bedrooms: 2, bathrooms: 1.5 };
  if (price < 3000) return { guests: 6, bedrooms: 3, bathrooms: 2 };
  return { guests: 8, bedrooms: 4, bathrooms: 3 };
}

async function seedDB() {
  await mongoose.connect(dbUrl);
  console.log('✓ Connected to MongoDB');

  const reviewerIds = await ensureDummyReviewers();
  console.log(`✓ Dummy reviewer accounts ready (${reviewerIds.length})`);

  const listings = sampleListings.data || sampleListings;
  let created = 0, updated = 0, failed = 0, reviewsAdded = 0;

  for (let listing of listings) {
    try {
      const existing = await Listing.findOne({ title: listing.title }).select('_id');

      const geometry = await geocodeLocation(`${listing.location}, ${listing.country}`) || {
        type: 'Point',
        coordinates: [0, 0]
      };
      const { guests, bedrooms, bathrooms } = inferCapacity(listing.price);
      const amenities = inferAmenities(listing);

      // Upsert by title so re-running this script is safe: existing listings
      // (and any bookings/reviews/favorites referencing their _id) are updated
      // in place rather than wiped and recreated.
      const saved = await Listing.findOneAndUpdate(
        { title: listing.title },
        {
          $set: {
            description: listing.description,
            image: listing.image,
            images: listing.images || [],
            price: listing.price,
            location: listing.location,
            country: listing.country,
            geometry,
            guests,
            bedrooms,
            bathrooms,
            amenities,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      const addedCount = await ensureReviews(saved._id, reviewerIds);
      reviewsAdded += addedCount;

      if (existing) {
        updated++;
        console.log(`↻ Updated: ${listing.title}${addedCount ? ` (+${addedCount} reviews)` : ''}`);
      } else {
        created++;
        console.log(`✓ Created: ${listing.title}${addedCount ? ` (+${addedCount} reviews)` : ''}`);
      }
    } catch (err) {
      failed++;
      console.log(`❌ Failed: ${listing.title} — ${err.message}`);
    }

    // Nominatim's usage policy caps free requests at 1/sec.
    await new Promise((resolve) => setTimeout(resolve, 1100));
  }

  console.log(`\n✅ Seeding complete! Created ${created}, updated ${updated}, failed ${failed}, reviews added ${reviewsAdded}.`);
  await mongoose.connection.close();
}

seedDB().catch((err) => {
  console.error('Seeding failed:', err);
  mongoose.connection.close();
});
