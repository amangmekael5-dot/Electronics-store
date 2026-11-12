const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// All order routes require authentication
router.use(auth);

// ── POST /api/orders  ── Place an order (simulate payment)
router.post('/', async (req, res) => {
  try {
    const { items, shipping, payment, subtotal, shippingCost, tax, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order.' });
    }
    if (!shipping?.fullName || !shipping?.address || !shipping?.city || !shipping?.country) {
      return res.status(400).json({ success: false, message: 'Shipping details are required.' });
    }
    if (!payment?.method) {
      return res.status(400).json({ success: false, message: 'Payment method is required.' });
    }

    // Sanitize items: if product id is numeric or non-ObjectId, lookup in MongoDB by name or set to null
    const sanitizedItems = await Promise.all(
      items.map(async (i) => {
        let prodId = i.product;
        if (!mongoose.isValidObjectId(prodId)) {
          const found = await Product.findOne({ name: i.name });
          prodId = found ? found._id : null;
        }
        return {
          product: prodId,
          name: i.name,
          image: i.image,
          emoji: i.emoji,
          category: i.category,
          price: i.price,
          qty: i.qty,
          gradient: i.gradient,
        };
      })
    );

    // Simulate payment processing delay (in production, call Stripe/PayPal here)
    await new Promise((resolve) => setTimeout(resolve, 500));

    const order = new Order({
      user: req.user._id,
      items: sanitizedItems,
      shipping,
      payment: {
        method: payment.method,
        txnRef: payment.txnRef || null,
        payerPhone: payment.payerPhone || null,
        cardLast4: payment.cardLast4 || null,
        cardBrand: payment.cardBrand || null,
      },
      subtotal,
      shippingCost: shippingCost || 0,
      tax: tax || 0,
      total,
      status: 'processing',
      isPaid: true,
      paidAt: new Date(),
    });

    const saved = await order.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── GET /api/orders/my ── Get current user's orders
router.get('/my', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── GET /api/orders/:id ── Get single order (must belong to user)
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
