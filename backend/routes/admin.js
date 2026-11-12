const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const { auth, requireAdmin } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(auth, requireAdmin);

// ── GET /api/admin/stats ── Dashboard summary
router.get('/stats', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers    = await User.countDocuments();
    const totalOrders   = await Order.countDocuments();
    const inStock       = await Product.countDocuments({ inStock: true });
    const outOfStock    = await Product.countDocuments({ inStock: false });

    const products = await Product.find({}, 'price');
    const totalRevenue = products.reduce((s, p) => s + p.price, 0);

    const orders = await Order.find({}, 'total');
    const ordersRevenue = orders.reduce((s, o) => s + o.total, 0);

    const categoryBreakdown = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: { totalProducts, totalUsers, totalOrders, inStock, outOfStock, totalRevenue, ordersRevenue, categoryBreakdown },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── GET /api/admin/profit ── Profit analytics (daily / weekly / monthly)
// Assumes a 30% profit margin on each order total (adjustable below)
const PROFIT_MARGIN = 0.30;

router.get('/profit', async (req, res) => {
  try {
    const now   = new Date();

    // ── Time boundaries ──────────────────────────────────────────────
    const startOfToday   = new Date(now); startOfToday.setHours(0,0,0,0);
    const startOfWeek    = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay()); startOfWeek.setHours(0,0,0,0);
    const startOfMonth   = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOf30Days  = new Date(now); startOf30Days.setDate(now.getDate() - 29); startOf30Days.setHours(0,0,0,0);

    // ── Aggregate helpers ────────────────────────────────────────────
    const sumOrders = async (from, to) => {
      const agg = await Order.aggregate([
        { $match: { createdAt: { $gte: from, $lte: to || now }, isPaid: true } },
        { $group: { _id: null, revenue: { $sum: '$total' }, count: { $sum: 1 } } }
      ]);
      const revenue = agg[0]?.revenue || 0;
      return { revenue, profit: Math.round(revenue * PROFIT_MARGIN), orders: agg[0]?.count || 0 };
    };

    const [daily, weekly, monthly] = await Promise.all([
      sumOrders(startOfToday),
      sumOrders(startOfWeek),
      sumOrders(startOfMonth),
    ]);

    // ── Last 30 days chart data (one row per day) ─────────────────────
    const last30 = await Order.aggregate([
      { $match: { createdAt: { $gte: startOf30Days }, isPaid: true } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders:  { $sum: 1 },
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill missing days with 0
    const chartData = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const row = last30.find(r => r._id === key);
      const revenue = row?.revenue || 0;
      chartData.push({
        date: key,
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue,
        profit: Math.round(revenue * PROFIT_MARGIN),
        orders: row?.orders || 0,
      });
    }

    // ── Best / worst day ─────────────────────────────────────────────
    const bestDay   = [...chartData].sort((a, b) => b.profit - a.profit)[0];
    const worstDay  = [...chartData].filter(d => d.revenue > 0).sort((a, b) => a.profit - b.profit)[0] || null;

    res.json({
      success: true,
      data: {
        profitMarginPct: Math.round(PROFIT_MARGIN * 100),
        daily, weekly, monthly,
        chartData,
        bestDay, worstDay,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── GET /api/admin/products ── All products for admin
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── POST /api/admin/products ── Create product
router.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ── PUT /api/admin/products/:id ── Update product
router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ── DELETE /api/admin/products/:id ── Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── GET /api/admin/users ── All users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── PUT /api/admin/users/:id/role ── Change user role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be user or admin' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ── DELETE /api/admin/users/:id ── Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You can't delete yourself." });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── GET /api/admin/orders ── All orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── PUT /api/admin/orders/:id/status ── Update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ── POST /api/admin/seed-demo ── Regenerate demo sample orders
router.post('/seed-demo', async (req, res) => {
  try {
    const user = await User.findOne({ role: 'user' }) || req.user;
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    const sampleOrders = [
      {
        user: user._id,
        items: [
          { name: "iPhone 16 Pro Max", category: "Phones", price: 1299, qty: 1, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80", emoji: "📱" },
          { name: "Sony WH-1000XM5", category: "Audio", price: 349, qty: 1, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80", emoji: "🎧" }
        ],
        shipping: { fullName: "Alex Rivera", email: "alex.rivera@example.com", phone: "+1 (555) 234-5678", address: "742 Evergreen Terrace", city: "Springfield", country: "United States", zip: "97477" },
        payment: { method: "card", cardBrand: "Visa", cardLast4: "4242", txnRef: "TXN-884920" },
        subtotal: 1648, shippingCost: 0, tax: 131.84, total: 1779.84, status: "delivered", isPaid: true, paidAt: new Date(now - 12 * day), createdAt: new Date(now - 12 * day),
      },
      {
        user: user._id,
        items: [
          { name: "MacBook Pro 16\" M4", category: "Laptops", price: 2499, qty: 1, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80", emoji: "💻" }
        ],
        shipping: { fullName: "Sarah Chen", email: "sarah.chen@techcorp.io", phone: "+1 (555) 876-5432", address: "450 Silicon Way, Suite 300", city: "San Francisco", country: "United States", zip: "94107" },
        payment: { method: "paypal", txnRef: "PP-994012" },
        subtotal: 2499, shippingCost: 0, tax: 199.92, total: 2698.92, status: "delivered", isPaid: true, paidAt: new Date(now - 8 * day), createdAt: new Date(now - 8 * day),
      },
      {
        user: user._id,
        items: [
          { name: "PlayStation 5 Pro", category: "Gaming", price: 699, qty: 1, image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80", emoji: "🎮" }
        ],
        shipping: { fullName: "Michael Brown", email: "m.brown@gaminghub.net", phone: "+1 (555) 345-6789", address: "128 Oak Ridge Lane", city: "Austin", country: "United States", zip: "78701" },
        payment: { method: "card", cardBrand: "Mastercard", cardLast4: "5555", txnRef: "TXN-302918" },
        subtotal: 699, shippingCost: 15, tax: 55.92, total: 769.92, status: "shipped", isPaid: true, paidAt: new Date(now - 5 * day), createdAt: new Date(now - 5 * day),
      },
      {
        user: user._id,
        items: [
          { name: "Samsung Galaxy S25 Ultra", category: "Phones", price: 1199, qty: 1, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80", emoji: "📱" }
        ],
        shipping: { fullName: "Elena Rostova", email: "elena.rostova@designworks.com", phone: "+1 (555) 901-2345", address: "88 North Michigan Ave", city: "Chicago", country: "United States", zip: "60611" },
        payment: { method: "telebirr", payerPhone: "+251911223344", txnRef: "TB-55443322" },
        subtotal: 1199, shippingCost: 0, tax: 95.92, total: 1294.92, status: "processing", isPaid: true, paidAt: new Date(now - 2 * day), createdAt: new Date(now - 2 * day),
      },
      {
        user: user._id,
        items: [
          { name: "iPad Air M2 11\"", category: "Tablets", price: 549, qty: 1, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80", emoji: "📱" },
          { name: "Apple Watch Series 10", category: "Wearables", price: 399, qty: 1, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80", emoji: "⌚" }
        ],
        shipping: { fullName: "David Kim", email: "david.kim@acme.org", phone: "+1 (555) 432-1098", address: "1010 Sunset Blvd, Apt 4B", city: "Los Angeles", country: "United States", zip: "90026" },
        payment: { method: "card", cardBrand: "Visa", cardLast4: "1234", txnRef: "TXN-771122" },
        subtotal: 948, shippingCost: 0, tax: 75.84, total: 1023.84, status: "processing", isPaid: true, paidAt: new Date(now - 1 * day), createdAt: new Date(now - 1 * day),
      },
      {
        user: user._id,
        items: [
          { name: "LG OLED evo G4 65\"", category: "TVs", price: 2299, qty: 1, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80", emoji: "📺" }
        ],
        shipping: { fullName: "Emma Watson", email: "emma.watson@creativemedia.co", phone: "+1 (555) 678-9012", address: "15 Beacon Street", city: "Boston", country: "United States", zip: "02108" },
        payment: { method: "cbe", txnRef: "CBE-998877" },
        subtotal: 2299, shippingCost: 50, tax: 183.92, total: 2532.92, status: "pending", isPaid: true, paidAt: new Date(now - 4 * 60 * 60 * 1000), createdAt: new Date(now - 4 * 60 * 60 * 1000),
      }
    ];

    await Order.deleteMany();
    await Order.insertMany(sampleOrders);

    res.json({ success: true, message: 'Demo orders generated successfully!', count: sampleOrders.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
