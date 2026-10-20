// ── ENV (dev only) ────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  try { require('dotenv').config(); } catch (e) { console.log('dotenv not loaded:', e.message); }
}

const express    = require('express');
const app        = express();
const mongoose   = require('mongoose');
const path       = require('path');
const method     = require('method-override');
const session    = require('express-session');
const MongoStore = require('connect-mongo');
const passport   = require('passport');
const LocalStrategy = require('passport-local');

const ExpressError = require('./utils/ExpressError');
const flash        = require('./utils/flash');
const User         = require('./models/user');

// ── CORS ──────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
];

// FRONTEND_URL may hold several comma-separated URLs.
const FRONTEND_URLS = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((u) => u.trim().replace(/\/$/, ''))
  .filter(Boolean);

// Optional regex for Vercel deployment/preview URLs, e.g.
// ^https://horizn-og89-[a-z0-9-]+-arjun-sn04s-projects\.vercel\.app$
let ORIGIN_PATTERN = null;
if (process.env.CORS_ORIGIN_PATTERN) {
  try { ORIGIN_PATTERN = new RegExp(process.env.CORS_ORIGIN_PATTERN); }
  catch (e) { console.error('✗ Invalid CORS_ORIGIN_PATTERN:', e.message); }
}

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (FRONTEND_URLS.includes(origin)) return true;
  if (ORIGIN_PATTERN && ORIGIN_PATTERN.test(origin)) return true;
  return false;
}

function setCorsHeaders(req, res) {
  const origin = req.headers.origin || '';
  if (isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Cookie,X-Requested-With');
  res.setHeader('Vary', 'Origin');
}

// Must run before EVERYTHING — including error handlers
app.use((req, res, next) => {
  setCorsHeaders(req, res);
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ── TRUST PROXY (required for secure cookies behind a reverse proxy) ──
app.set('trust proxy', 1);

// ── BODY PARSERS ──────────────────────────────────────────────────────
app.use(method('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── DATABASE ──────────────────────────────────────────────────────────
const dbUrl  = process.env.MONGODB_ATLAS_URL;
const secret = process.env.SECRET;

if (!dbUrl)  console.error('✗ MONGODB_ATLAS_URL is not set!');
if (!secret) console.error('✗ SECRET is not set!');

if (dbUrl) {
  mongoose.connect(dbUrl)
    .then(() => console.log('✓ MongoDB connected'))
    .catch((err) => console.error('✗ MongoDB error:', err.message));
}

// ── SESSION ───────────────────────────────────────────────────────────
const isProduction = process.env.NODE_ENV === 'production';

const sessionStore = dbUrl
  ? MongoStore.create({ mongoUrl: dbUrl, touchAfter: 24 * 3600 })
  : undefined;

if (sessionStore) {
  sessionStore.on('error', (err) => console.error('MongoStore error:', err.message));
}

app.use(session({
  store: sessionStore,
  secret: secret || 'fallback-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge:   1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    secure:   isProduction,             // HTTPS only in prod
    sameSite: isProduction ? 'none' : 'lax', // cross-site cookies in prod
  },
}));

app.use(flash());

// ── PASSPORT ──────────────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ── STATIC ────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '/public')));

// ── ROUTES ────────────────────────────────────────────────────────────
const listingRouter       = require('./routes/listing');
const reviewRoutes        = require('./routes/review');
const userRoutes          = require('./routes/user');
const notificationRoutes  = require('./routes/notification');
const bookingRoutes       = require('./routes/booking');
const myBookingsRoutes    = require('./routes/bookings');
const reportRoutes        = require('./routes/report');
const adminRoutes         = require('./routes/admin');

app.use('/listing',             listingRouter);
app.use('/listing/:id/review',  reviewRoutes);
app.use('/listing/:id/booking', bookingRoutes);
app.use('/listing/:id/report',  reportRoutes);
app.use('/bookings',            myBookingsRoutes);
app.use('/user',                userRoutes);
app.use('/notifications',       notificationRoutes);
app.use('/admin',               adminRoutes);

// ── HEALTH CHECK ──────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status:   'ok',
    message:  'Horizn API is running',
    frontend: process.env.FRONTEND_URL || 'not set',
    env:      process.env.NODE_ENV,
  });
});

// ── 404 ───────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  next(new ExpressError(404, 'Route not found'));
});

// ── ERROR HANDLER (CORS headers must be re-applied here too) ──────────
app.use((err, req, res, next) => {
  // Re-apply CORS so error responses are not blocked by the browser
  setCorsHeaders(req, res);
  if (res.headersSent) return next(err);
  const statusCode = err.statusCode || 500;
  const message    = err.message    || 'Something went wrong!';
  console.error(`[${statusCode}] ${req.method} ${req.path} — ${message}`);
  res.status(statusCode).json({ success: false, error: message });
});

// ── START SERVER ──────────────────────────────────────────────────────
// Listen whenever this file is run directly (`node app.js`: local, Docker, Render).
// When imported (e.g. by a serverless wrapper) it only exports the app.
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => console.log(`✓ Server running on port ${PORT}`));
}

module.exports = app;
