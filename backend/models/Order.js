const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:       { type: mongoose.Schema.Types.Mixed },
  name:          { type: String, required: true },
  image:         { type: String },
  emoji:         { type: String },
  category:      { type: String },
  price:         { type: Number, required: true },
  qty:           { type: Number, required: true, min: 1 },
  gradient:      { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],

    // Shipping
    shipping: {
      fullName:   { type: String, required: true },
      email:      { type: String, required: true },
      phone:      { type: String },
      address:    { type: String, required: true },
      city:       { type: String, required: true },
      country:    { type: String, required: true },
      zip:        { type: String },
    },

    // Payment
    payment: {
      method:       { type: String, enum: ['card', 'paypal', 'mobile', 'telebirr', 'cbe', 'boa', 'awash', 'qrcode'], required: true },
      txnRef:       { type: String },
      payerPhone:   { type: String },
      cardLast4:    { type: String },
      cardBrand:    { type: String },
    },

    // Financials
    subtotal:       { type: Number, required: true },
    shippingCost:   { type: Number, default: 0 },
    tax:            { type: Number, default: 0 },
    total:          { type: Number, required: true },

    // Status
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'processing',
    },
    isPaid:   { type: Boolean, default: true },
    paidAt:   { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
