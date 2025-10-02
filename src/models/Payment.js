const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  stripePaymentId: { type: String },
  amount: { type: Number },
  currency: { type: String, default: process.env.STRIPE_CURRENCY || 'usd' },
  status: { type: String },
  invoiceUrl: { type: String } 
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
