const { paymentIntent, constructEvent } = require("../services/stripeService");
const Payment = require("../models/Payment");
const User = require("../models/User");

exports.createPaymentIntent = async (req, res) => {
  try {
    const amount = 10000; // $100 in cents
    const pi = await paymentIntent({
      amountCents: amount,
      metadata: { userId: req.user?._id?.toString?.() || "anonymous" },
    });

    // console.log("->pi", pi);
    res.status(201).json({ clientSecret: pi.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Stripe webhook endpoint (raw body required)
exports.webhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  try {
    const event = constructEvent(req.body, sig);
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object;
      const userId = pi.metadata.userId;

      await Payment.create({
        user: userId,
        stripePaymentId: pi.id,
        amount: pi.amount / 100,
        currency: pi.currency,
        status: pi.status,
      });
      // console.log("->pi2", pi);
      await User.findByIdAndUpdate(userId, { stripePaid: true });
    } else if (event.type === "payment_intent.payment_failed") {
      const pi = event.data.object;
      const userId = pi.metadata?.userId;

      await Payment.create({
        user: userId,
        stripePaymentId: pi.id,
        amount: pi.amount ? pi.amount / 100 : 0,
        currency: pi.currency,
        status: pi.status,
      });
    }
    res.status(201).json({ received: true });
  } catch (err) {
    // console.error("Webhook error:", err.message);
    res.status(500).send(`Webhook Error: ${err.message}`);
  }
};

exports.getHistory = async (req, res) => {
  const payments = await Payment.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(payments);
};
