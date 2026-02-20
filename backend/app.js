if (process.env.NODE_ENV !== 'production') {
  try { require('dotenv').config(); } catch(e) { console.log('dotenv not loaded:', e.message); }
}

const express = require("express");
const app = express();
const mongodb = require("mongoose");
const cors = require("cors");
const path = require("path");
const method = require("method-override");

const ExpressError = require("./utils/ExpressError");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('./utils/flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// ── CORS — set headers on absolutely every response ───────────────────
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
];

function setCorsHeaders(req, res) {
  const origin = req.headers.origin || '';
  const dynamicOrigins = [...ALLOWED_ORIGINS];
  if (process.env.FRONTEND_URL) dynamicOrigins.push(process.env.FRONTEND_URL);

  if (!origin || dynamicOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', origin); // echo back so browser can inspect
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Cookie');
  res.setHeader('Vary', 'Origin');
}

// Run before everything else
app.use((req, res, next) => {
  setCorsHeaders(req, res);
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ── BODY PARSERS ──────────────────────────────────────────────────────
app.use(method("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── DATABASE ──────────────────────────────────────────────────────────
const dbUrl = process.env.MONGODB_ATLAS_URL;
const secret = process.env.SECRET || 'fallbacksecret123';

if (dbUrl) {
  mongodb.connect(dbUrl)
    .then(() => console.log("✓ MongoDB connected"))
    .catch((err) => console.error("✗ MongoDB error:", err.message));
} else {
  console.error("✗ MONGODB_ATLAS_URL is not set!");
}

// ── SESSION ───────────────────────────────────────────────────────────
const isProduction = process.env.NODE_ENV === 'production';

let sessionStore;
if (dbUrl) {
  sessionStore = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600
  });
  sessionStore.on('error', (err) => console.error('MongoStore error:', err.message));
}

app.use(session({
  store: sessionStore,
  secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  }
}));

app.use(flash());

// ── PASSPORT ──────────────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ── STATIC ────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "/public")));

// ── ROUTES ────────────────────────────────────────────────────────────
const listingRouter  = require("./routes/listing");
const reviewRoutes   = require("./routes/review");
const listingsRoutes = require('./routes/listings');
const userRoutes     = require('./routes/user');

app.use("/listing", listingRouter);
app.use("/listing/:id/review", reviewRoutes);
app.use("/listings/:id", listingsRoutes);
app.use("/user", userRoutes);

// Auth status — always 200
app.get('/user/auth-status', (req, res) => {
  return res.status(200).json({
    authenticated: req.isAuthenticated(),
    user: req.isAuthenticated() ? req.user : null
  });
});

app.get('/user/current', (req, res) => {
  if (req.isAuthenticated()) return res.json({ user: req.user });
  return res.status(401).json({ message: 'Not authenticated' });
});

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'WanderLust API is running',
    frontend: process.env.FRONTEND_URL || 'not set',
    env: process.env.NODE_ENV
  });
});

// ── 404 ───────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  next(new ExpressError("Route not found", 404));
});

// ── ERROR HANDLER ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";
  console.error(`[${statusCode}] ${message}`);
  res.status(statusCode).json({ success: false, error: message });
});

// ── LOCAL DEV ONLY ────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`✓ Server running on http://localhost:${PORT}`));
}

module.exports = app;
