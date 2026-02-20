if (process.env.NODE_ENV !== 'production') require('dotenv').config();

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

// ── CORS ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    // Build allowed list fresh each request so env changes take effect
    const allowed = [
      'http://localhost:5173',
      'http://localhost:4173',
      process.env.FRONTEND_URL,
    ].filter(Boolean);
    // No origin = server-to-server / curl / Postman — always allow
    if (!origin) return callback(null, true);
    if (allowed.includes(origin)) return callback(null, true);
    // Log blocked origin to help debug
    console.warn('CORS blocked origin:', origin, '| allowed:', allowed);
    return callback(new Error('CORS: origin not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight OPTIONS for all routes
app.options('*', cors());

// ── BODY PARSERS ──────────────────────────────────────────────────────
app.use(method("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── DATABASE ──────────────────────────────────────────────────────────
const dbUrl = process.env.MONGODB_ATLAS_URL;
const secret = process.env.SECRET || 'fallbacksecret123';

// Only connect if dbUrl exists
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
const listingRouter = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const listingsRoutes = require('./routes/listings');
const userRoutes = require('./routes/user');

app.use("/listing", listingRouter);
app.use("/listing/:id/review", reviewRoutes);
app.use("/listings/:id", listingsRoutes);
app.use("/user", userRoutes);

app.get('/user/auth-status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false, user: null });
  }
});

app.get('/user/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Health check — visiting / in browser shows this instead of 500
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'WanderLust API is running' });
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
