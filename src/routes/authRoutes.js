const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authMiddleware, authController.me);

// Google OAuth routes
// router.get("/current-user", authMiddleware, authController.getCurrentUser);
router.post("/google/verify-token", authController.verifyGoogleToken);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     session: false,
//     failureRedirect: `${process.env.CLIENT_URL}/login`,
//   }),
//   authController.googleAuthRedirect
// );

module.exports = router;
