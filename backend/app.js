if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require("express");
const app = express();
const mongodb = require("mongoose");
const cors = require("cors");
const path = require("path");
const method = require("method-override");

const ExpressError = require("./utils/ExpressError");
const listingRouter = require("./routes/listing");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('./utils/flash');

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// ── CORS ────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// ── BODY PARSERS ─────────────────────────────────────────────────────
app.use(method("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── DATABASE ──────────────────────────────────────────────────────────
const dbUrl = process.env.MONGODB_ATLAS_URL;
const secret = process.env.SECRET || 'fallbacksecret123';

async function main() {
  await mongodb.connect(dbUrl);
}
main()
  .then(() => console.log("✓ MongoDB connected"))
  .catch((err) => console.log("✗ MongoDB error:", err));

// ── SESSION STORE ─────────────────────────────────────────────────────
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600
});
store.on('error', (err) => console.log('MongoStore error:', err));

const isProduction = process.env.NODE_ENV === 'production';

const sessionOptions = {
  store,
  secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    secure: isProduction,           // true on Vercel (HTTPS)
    sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-site cookies
  }
};

app.use(session(sessionOptions));
app.use(flash());

// ── PASSPORT ──────────────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ── STATIC FILES ──────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "/public")));

// ── ROUTES ────────────────────────────────────────────────────────────
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

// ── 404 ───────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  next(new ExpressError("Page not found!", 404));
});

// ── ERROR HANDLER ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const { statusCode = 500, message = "Something went wrong!" } = err;
  console.error('Error:', statusCode, message);
  res.status(statusCode).json({ success: false, error: message });
});

// ── START (local dev only — Vercel uses module.exports) ───────────────
if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => console.log("✓ Backend running on http://localhost:3000"));
}

module.exports = app;
