require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const retellRoutes = require("./routes/retellRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const { errorHandler } = require("./middleware/errorHandler");
const passport = require("passport");
const session = require("express-session");
require("./config/passport");

const app = express();
const PORT = process.env.PORT;

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(cookieParser());
app.use(
  cors({
    // origin: process.env.CLIENT_URL,
    origin: ["http://localhost:3000", "http://192.168.31.217:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow Authorization header
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

connectDB(process.env.MONGO_URI);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/retell", retellRoutes);
app.use("/api/conversations", conversationRoutes);

// global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Connected to the server!`);
});
