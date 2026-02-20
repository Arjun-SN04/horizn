const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl, validateUser } = require("../middleware");
const userController = require("../controllers/users");

// Signup — no wrapAsync because createUser uses callbacks, not async/await
router.route("/signup")
  .get(userController.renderSignup)
  .post(validateUser, userController.createUser);

// Login — custom passport callback returns JSON on failure
router.route("/login")
  .get(userController.renderLogin)
  .post(saveRedirectUrl, (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: info?.message || "Invalid username or password"
        });
      }
      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        return userController.loginUser(req, res);
      });
    })(req, res, next);
  });

// Logout
router.get("/logout", isLoggedIn, userController.logoutUser);

// Profile - Get user profile
router.get("/profile", isLoggedIn, userController.getUserProfile);

// Profile - Update user profile
router.put("/profile", isLoggedIn, userController.updateUserProfile);

// Profile - Change username
router.put("/profile/username", isLoggedIn, userController.changeUsername);

// Profile - Change password
router.put("/profile/password", isLoggedIn, userController.changePassword);

module.exports = router;