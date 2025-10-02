const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const { setAuthCookies } = require("../helper/auth.helper");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function signToken(userId, userName) {
  return jwt.sign(
    {
      id: userId,
      name: userName,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "2d",
    }
  );
}

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    res.status(201).json({
      message: "Registered Successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.passwordHash)
      return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken(user._id, user.name);
    setAuthCookies(res, token);

    res.status(200).json({
      message: "Login successful",
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.googleAuthRedirect = (req, res) => {
//   const token = signToken(req.user._id);

//   setAuthCookies(res, token);

//   res.redirect(`${process.env.CLIENT_URL}/dashboard`);
// };

exports.me = async (req, res) => {
  res.status(200).json({ user: req.user });
};

exports.verifyGoogleToken = async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { sub, email, name } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        googleId: sub,
        email,
        name,
        password: null,
      });
    }

    const token = signToken(user._id, user.name);
    setAuthCookies(res, token);

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error("Google token verify error:", err);
    res.status(401).json({ error: "Invalid Google Token" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME);
  return res.status(200).json({ message: "Logged out successfully" });
};
