const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// async function createPaymentIntent({
//   amountCents = 10000,
//   metadata = {},
// } = {}) {
//   const pi = await stripe.paymentIntents.create({
//     amount: amountCents,
//     currency: process.env.STRIPE_CURRENCY || "usd",
//     metadata,
//   });
//   return pi;
// }

// function constructEvent(rawBody, sigHeader) {
//   return stripe.webhooks.constructEvent(
//     rawBody,
//     sigHeader,
//     process.env.STRIPE_WEBHOOK_SECRET
//   );
// }

// module.exports = { createPaymentIntent, constructEvent, stripeClient: stripe };

async function paymentIntent({
  amountCents = 10000,
  metadata = {},
} = {}) {
  return stripe.paymentIntents.create({
    amount: amountCents,
    currency: process.env.STRIPE_CURRENCY || "usd",
    metadata,
  });
}

function constructEvent(rawBody, sigHeader) {
  return stripe.webhooks.constructEvent(
    rawBody,
    sigHeader,
    process.env.STRIPE_WEBHOOK_SECRET
  );
}

module.exports = { paymentIntent, constructEvent, stripeClient: stripe };
