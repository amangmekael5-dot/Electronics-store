const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    brand: {
      type: String,
      trim: true,
      default: ''
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    originalPrice: {
      type: Number,
      min: 0
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Laptops', 'Phones', 'Audio', 'Wearables', 'Tablets', 'Cameras', 'Accessories', 'TVs', 'Gaming']
    },
    image: {
      type: String,
      default: ''
    },
    emoji: {
      type: String,
      default: '📦'
    },
    gradient: {
      type: String,
      default: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
    },
    badge: {
      type: String
    },
    badgeColor: {
      type: String,
      default: '#7c3aed'
    },
    inStock: {
      type: Boolean,
      default: true
    },
    condition: {
      type: String,
      enum: ['Brand New', 'Certified Refurbished', 'Open Box'],
      default: 'Brand New'
    },
    salesCount: {
      type: Number,
      default: 0
    },
    // renamed from isNew to avoid Mongoose reserved key warning
    newArrival: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    reviews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,           // auto createdAt / updatedAt
    suppressReservedKeysWarning: true
  }
);

module.exports = mongoose.model('Product', productSchema);