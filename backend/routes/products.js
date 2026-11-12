const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// ── GET all products (with optional search & sort query params) ──
// e.g. /api/products?search=iphone&sort=price_asc&category=Phones
router.get('/', async (req, res) => {
  try {
    const { search, sort, category } = req.query;

    // Build query filter
    const filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort option
    let sortOption = {};
    if (sort === 'price_asc')   sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'reviews') sortOption = { reviews: -1 };
    // default: newest first
    else sortOption = { createdAt: -1 };

    const products = await Product.find(filter).sort(sortOption);
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error('GET /api/products error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── GET products by category ── (MUST come before /:id)
router.get('/category/:category', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category }).sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── GET single product by ID ──
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── POST create product ──
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ── PUT update product ──
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ── DELETE product ──
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;