// One-off CLI helper: grant admin access to an existing user.
// Usage: node scripts/make-admin.js <username-or-email>
if (process.env.NODE_ENV != 'production') require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../models/user');

const identifier = process.argv[2];
if (!identifier) {
  console.error('Usage: node scripts/make-admin.js <username-or-email>');
  process.exit(1);
}

(async () => {
  await mongoose.connect(process.env.MONGODB_ATLAS_URL);

  const user = await User.findOneAndUpdate(
    { $or: [{ username: identifier }, { email: identifier }] },
    { isAdmin: true },
    { new: true }
  );

  if (!user) {
    console.error(`No user found matching "${identifier}"`);
  } else {
    console.log(`✓ ${user.username} (${user.email}) is now an admin`);
  }

  await mongoose.disconnect();
})();
