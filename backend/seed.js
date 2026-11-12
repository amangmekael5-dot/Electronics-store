const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
require('dotenv').config();

const sampleProducts = [
  {
    name: "iPhone 16 Pro Max",
    brand: "Apple",
    category: "Phones",
    price: 1299,
    originalPrice: 1499,
    rating: 4.9,
    reviews: 2341,
    salesCount: 5400,
    condition: "Brand New",
    badge: "Best Seller",
    badgeColor: "#f59e0b",
    description: "A17 Pro chip, 6.7\" Super Retina XDR, 48MP ProRAW camera system",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
    emoji: "📱",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    inStock: true,
    newArrival: false,
  },
  {
    name: "Samsung Galaxy S25 Ultra",
    brand: "Samsung",
    category: "Phones",
    price: 1199,
    originalPrice: 1399,
    rating: 4.8,
    reviews: 1876,
    salesCount: 4200,
    condition: "Brand New",
    badge: "Hot Deal",
    badgeColor: "#ef4444",
    description: "Snapdragon 8 Elite, 200MP camera, built-in S Pen, 5000mAh",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
    emoji: "📱",
    gradient: "linear-gradient(135deg, #0d0d1a 0%, #1a0533 50%, #2d1b69 100%)",
    inStock: true,
    newArrival: false,
  },
  {
    name: "MacBook Pro 16\" M4",
    brand: "Apple",
    category: "Laptops",
    price: 2499,
    originalPrice: 2799,
    rating: 4.9,
    reviews: 1203,
    salesCount: 3100,
    condition: "Brand New",
    badge: "New",
    badgeColor: "#10b981",
    description: "Apple M4 Pro chip, 16\" Liquid Retina XDR, 36GB RAM, 512GB SSD",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    emoji: "💻",
    gradient: "linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #2a2a2a 100%)",
    inStock: true,
    newArrival: true,
  },
  {
    name: "Dell XPS 15 OLED",
    brand: "Dell",
    category: "Laptops",
    price: 1899,
    originalPrice: 2199,
    rating: 4.7,
    reviews: 892,
    salesCount: 1900,
    condition: "Certified Refurbished",
    badge: "Sale",
    badgeColor: "#8b5cf6",
    description: "Intel Core Ultra 9, 15.6\" OLED 4K, RTX 4070, 32GB DDR5",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80",
    emoji: "💻",
    gradient: "linear-gradient(135deg, #0a0e27 0%, #1a2a4a 50%, #0d47a1 100%)",
    inStock: true,
    newArrival: false,
  },
  {
    name: "Sony WH-1000XM6",
    brand: "Sony",
    category: "Audio",
    price: 399,
    originalPrice: 449,
    rating: 4.9,
    reviews: 5621,
    salesCount: 8900,
    condition: "Brand New",
    badge: "Award Winner",
    badgeColor: "#f59e0b",
    description: "Industry-leading noise cancellation, 40hr battery, Hi-Res Audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    emoji: "🎧",
    gradient: "linear-gradient(135deg, #1a0a0a 0%, #2d152d 50%, #4a1515 100%)",
    inStock: true,
    newArrival: false,
  },
  {
    name: "AirPods Pro 3",
    brand: "Apple",
    category: "Audio",
    price: 279,
    originalPrice: 299,
    rating: 4.8,
    reviews: 3210,
    salesCount: 7800,
    condition: "Brand New",
    badge: "Popular",
    badgeColor: "#3b82f6",
    description: "Adaptive Audio, Conversation Awareness, H3 chip, USB-C",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80",
    emoji: "🎵",
    gradient: "linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #2a2a4e 100%)",
    inStock: true,
    newArrival: false,
  },
  {
    name: "Apple Watch Ultra 3",
    brand: "Apple",
    category: "Wearables",
    price: 799,
    originalPrice: 849,
    rating: 4.8,
    reviews: 987,
    salesCount: 2200,
    condition: "Brand New",
    badge: "New",
    badgeColor: "#10b981",
    description: "49mm titanium, Action button, 72hr battery, dual-frequency GPS",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
    emoji: "⌚",
    gradient: "linear-gradient(135deg, #0a1a0a 0%, #1a2d1a 50%, #1a4a1a 100%)",
    inStock: true,
    newArrival: true,
  },
  {
    name: "Samsung Galaxy Watch 7",
    brand: "Samsung",
    category: "Wearables",
    price: 329,
    originalPrice: 399,
    rating: 4.6,
    reviews: 654,
    salesCount: 1600,
    condition: "Certified Refurbished",
    badge: "Sale",
    badgeColor: "#8b5cf6",
    description: "BioActive Sensor 3.0, AI health insights, sapphire crystal glass",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    emoji: "⌚",
    gradient: "linear-gradient(135deg, #1a1a0a 0%, #2d2d15 50%, #1a2a4a 100%)",
    inStock: false,
    newArrival: false,
  },
  {
    name: "iPad Pro 13\" M4",
    brand: "Apple",
    category: "Tablets",
    price: 1299,
    originalPrice: 1399,
    rating: 4.9,
    reviews: 1456,
    salesCount: 3500,
    condition: "Brand New",
    badge: "Best Seller",
    badgeColor: "#f59e0b",
    description: "M4 chip, Ultra Retina XDR OLED, 13\", Apple Pencil Pro support",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
    emoji: "📟",
    gradient: "linear-gradient(135deg, #0a1a1a 0%, #152d2d 50%, #0d4a4a 100%)",
    inStock: true,
    newArrival: false,
  },
  {
    name: "DJI Osmo Pocket 3",
    brand: "DJI",
    category: "Cameras",
    price: 519,
    originalPrice: 599,
    rating: 4.7,
    reviews: 432,
    salesCount: 1400,
    condition: "Brand New",
    badge: "Hot Deal",
    badgeColor: "#ef4444",
    description: "1-inch CMOS, 4K/120fps, ActiveTrack 6.0, 3-axis stabilization",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
    emoji: "📷",
    gradient: "linear-gradient(135deg, #1a0a1a 0%, #2d152d 50%, #4a0d4a 100%)",
    inStock: true,
    newArrival: false,
  },
  {
    name: "ASUS ROG Zephyrus G16",
    brand: "ASUS",
    category: "Laptops",
    price: 2199,
    originalPrice: 2499,
    rating: 4.8,
    reviews: 723,
    salesCount: 1800,
    condition: "Brand New",
    badge: "Gaming",
    badgeColor: "#10b981",
    description: "AMD Ryzen 9, RTX 4090, 16\" QHD+ 240Hz, 32GB DDR5",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80",
    emoji: "🎮",
    gradient: "linear-gradient(135deg, #0a1a0a 0%, #001a00 50%, #003300 100%)",
    inStock: true,
    newArrival: false,
  },
  {
    name: "Google Pixel 9 Pro",
    brand: "Google",
    category: "Phones",
    price: 999,
    originalPrice: 1099,
    rating: 4.7,
    reviews: 1102,
    salesCount: 2900,
    condition: "Brand New",
    badge: "AI Powered",
    badgeColor: "#3b82f6",
    description: "Google Tensor G4, 50MP camera with AI magic, 7 years of updates",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
    emoji: "📱",
    gradient: "linear-gradient(135deg, #0a1a2a 0%, #153a6b 50%, #1a60a0 100%)",
    inStock: true,
    newArrival: false,
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/electrostore');

    // Seed Products
    await Product.deleteMany();
    await Product.insertMany(sampleProducts);
    console.log('✅ Products seeded successfully!');

    // Seed Users
    await User.deleteMany();

    // Admin account
    const adminUser = new User({
      name: 'Admin',
      email: 'admin@elecstore.com',
      password: 'admin123',
      role: 'admin',
    });
    await adminUser.save();
    console.log('🔑 Admin user created: admin@elecstore.com / admin123');

    // Regular test user
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
    });
    await testUser.save();
    console.log('👤 Test user created: test@example.com / password123');

    // Seed Orders
    await Order.deleteMany();
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    const sampleOrders = [
      {
        user: testUser._id,
        items: [
          {
            name: "iPhone 16 Pro Max",
            category: "Phones",
            price: 1299,
            qty: 1,
            image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
            emoji: "📱"
          },
          {
            name: "Sony WH-1000XM5",
            category: "Audio",
            price: 349,
            qty: 1,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
            emoji: "🎧"
          }
        ],
        shipping: {
          fullName: "Alex Rivera",
          email: "alex.rivera@example.com",
          phone: "+1 (555) 234-5678",
          address: "742 Evergreen Terrace",
          city: "Springfield",
          country: "United States",
          zip: "97477"
        },
        payment: {
          method: "card",
          cardBrand: "Visa",
          cardLast4: "4242",
          txnRef: "TXN-884920"
        },
        subtotal: 1648,
        shippingCost: 0,
        tax: 131.84,
        total: 1779.84,
        status: "delivered",
        isPaid: true,
        paidAt: new Date(now - 12 * day),
        createdAt: new Date(now - 12 * day),
      },
      {
        user: testUser._id,
        items: [
          {
            name: "MacBook Pro 16\" M4",
            category: "Laptops",
            price: 2499,
            qty: 1,
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
            emoji: "💻"
          }
        ],
        shipping: {
          fullName: "Sarah Chen",
          email: "sarah.chen@techcorp.io",
          phone: "+1 (555) 876-5432",
          address: "450 Silicon Way, Suite 300",
          city: "San Francisco",
          country: "United States",
          zip: "94107"
        },
        payment: {
          method: "paypal",
          txnRef: "PP-994012"
        },
        subtotal: 2499,
        shippingCost: 0,
        tax: 199.92,
        total: 2698.92,
        status: "delivered",
        isPaid: true,
        paidAt: new Date(now - 8 * day),
        createdAt: new Date(now - 8 * day),
      },
      {
        user: testUser._id,
        items: [
          {
            name: "PlayStation 5 Pro",
            category: "Gaming",
            price: 699,
            qty: 1,
            image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80",
            emoji: "🎮"
          }
        ],
        shipping: {
          fullName: "Michael Brown",
          email: "m.brown@gaminghub.net",
          phone: "+1 (555) 345-6789",
          address: "128 Oak Ridge Lane",
          city: "Austin",
          country: "United States",
          zip: "78701"
        },
        payment: {
          method: "card",
          cardBrand: "Mastercard",
          cardLast4: "5555",
          txnRef: "TXN-302918"
        },
        subtotal: 699,
        shippingCost: 15,
        tax: 55.92,
        total: 769.92,
        status: "shipped",
        isPaid: true,
        paidAt: new Date(now - 5 * day),
        createdAt: new Date(now - 5 * day),
      },
      {
        user: testUser._id,
        items: [
          {
            name: "Samsung Galaxy S25 Ultra",
            category: "Phones",
            price: 1199,
            qty: 1,
            image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
            emoji: "📱"
          }
        ],
        shipping: {
          fullName: "Elena Rostova",
          email: "elena.rostova@designworks.com",
          phone: "+1 (555) 901-2345",
          address: "88 North Michigan Ave",
          city: "Chicago",
          country: "United States",
          zip: "60611"
        },
        payment: {
          method: "telebirr",
          payerPhone: "+251911223344",
          txnRef: "TB-55443322"
        },
        subtotal: 1199,
        shippingCost: 0,
        tax: 95.92,
        total: 1294.92,
        status: "processing",
        isPaid: true,
        paidAt: new Date(now - 2 * day),
        createdAt: new Date(now - 2 * day),
      },
      {
        user: testUser._id,
        items: [
          {
            name: "iPad Air M2 11\"",
            category: "Tablets",
            price: 549,
            qty: 1,
            image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
            emoji: "📱"
          },
          {
            name: "Apple Watch Series 10",
            category: "Wearables",
            price: 399,
            qty: 1,
            image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80",
            emoji: "⌚"
          }
        ],
        shipping: {
          fullName: "David Kim",
          email: "david.kim@acme.org",
          phone: "+1 (555) 432-1098",
          address: "1010 Sunset Blvd, Apt 4B",
          city: "Los Angeles",
          country: "United States",
          zip: "90026"
        },
        payment: {
          method: "card",
          cardBrand: "Visa",
          cardLast4: "1234",
          txnRef: "TXN-771122"
        },
        subtotal: 948,
        shippingCost: 0,
        tax: 75.84,
        total: 1023.84,
        status: "processing",
        isPaid: true,
        paidAt: new Date(now - 1 * day),
        createdAt: new Date(now - 1 * day),
      },
      {
        user: testUser._id,
        items: [
          {
            name: "LG OLED evo G4 65\"",
            category: "TVs",
            price: 2299,
            qty: 1,
            image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80",
            emoji: "📺"
          }
        ],
        shipping: {
          fullName: "Emma Watson",
          email: "emma.watson@creativemedia.co",
          phone: "+1 (555) 678-9012",
          address: "15 Beacon Street",
          city: "Boston",
          country: "United States",
          zip: "02108"
        },
        payment: {
          method: "cbe",
          txnRef: "CBE-998877"
        },
        subtotal: 2299,
        shippingCost: 50,
        tax: 183.92,
        total: 2532.92,
        status: "pending",
        isPaid: true,
        paidAt: new Date(now - 4 * 60 * 60 * 1000),
        createdAt: new Date(now - 4 * 60 * 60 * 1000),
      }
    ];

    await Order.insertMany(sampleOrders);
    console.log(`📦 Seeded ${sampleOrders.length} sample orders successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
