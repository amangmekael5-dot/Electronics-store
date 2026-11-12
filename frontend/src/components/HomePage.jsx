import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaGlobe, FaShieldAlt, FaHeadset, FaRocket, FaArrowRight, FaStar, FaPlay, FaCube, FaBolt, FaTag, FaShippingFast, FaFire, FaCheckCircle } from "react-icons/fa";
import { MdElectricBolt, MdOutlineKeyboardDoubleArrowRight, MdViewInAr, MdLocalShipping } from "react-icons/md";
import { useCart } from "../context/CartContext";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";
import { STATIC_PRODUCTS } from "./ProductsPage";
import "./HomePage.css";

const TRUST_PERKS = [
  {
    icon: <FaGlobe />,
    title: "International Shipping",
    desc: "Fast, reliable worldwide courier network straight to your door.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Official Brand Warranty",
    desc: "100% genuine products with full manufacturer warranty protection.",
  },
  {
    icon: <FaHeadset />,
    title: "24/7 Global Support",
    desc: "Expert tech assistance available round the clock in multiple languages.",
  },
  {
    icon: <FaRocket />,
    title: "Seamless Customs Handling",
    desc: "Pre-cleared customs documentation for smooth international delivery.",
  },
];

const CATEGORIES = [
  { name: "Phones", emoji: "📱", count: "120+ Products", path: "phones", color: "#3b82f6" },
  { name: "Laptops", emoji: "💻", count: "80+ Products", path: "laptops", color: "#7c3aed" },
  { name: "Audio", emoji: "🎧", count: "150+ Products", path: "audio", color: "#10b981" },
  { name: "Wearables", emoji: "⌚", count: "90+ Products", path: "wearables", color: "#f59e0b" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();
  const [tiltStyle, setTiltStyle] = useState({ transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)" });
  const [active3DTab, setActive3DTab] = useState(0);

  // Wishlist State persisted in localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("elec_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Quick View Modal State
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleToggleWishlist = (product) => {
    const pid = product.id || product._id;
    setWishlist((prev) => {
      const next = prev.includes(pid) ? prev.filter((id) => id !== pid) : [...prev, pid];
      try {
        localStorage.setItem("elec_wishlist", JSON.stringify(next));
      } catch (err) {
        console.warn(err);
      }
      return next;
    });
  };

  // Interactive 3D mouse move handler
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`,
      transition: "transform 0.1s ease-out"
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
    });
  };

  const handleCategoryClick = () => {
    navigate("/products");
  };

  const SHOWCASE_3D_ITEMS = [
    {
      title: "Vision Pro Spatial Audio 3D",
      subtitle: "Next-Generation Spatial Computing",
      img: "/tech_3d_spatial.png",
      tag: "SPATIAL 3D",
      desc: "Ultra-high resolution micro-OLED displays with real-time ray-traced spatial sound.",
      price: "$3,499"
    },
    {
      title: "Futuristic Cyber Laptop 3D",
      subtitle: "Liquid-Cooled Quantum Processing",
      img: "/electronics_hero.png",
      tag: "CYBER CORE",
      desc: "Architected with carbon-fiber chassis and dual vapor-chamber cooling.",
      price: "$2,899"
    }
  ];

  return (
    <div className="hp-page">
      {/* ── Professional Promotional Banner ── */}
      <div className="hp-promo-banner">
        <div className="hp-promo-banner-inner">
          <span className="hp-promo-tag">
            <FaFire /> LIMITED TIME EVENT
          </span>
          <span className="hp-promo-text">
            Spring Tech Fest: Save up to <strong>30% OFF</strong> Flagship Devices + <strong>Free Worldwide Express Shipping</strong>
          </span>
          <Link to="/products" className="hp-promo-cta">
            Shop Deals <FaArrowRight />
          </Link>
        </div>
      </div>

      {/* ── Hero Section (Streamlined Vertical Space) ── */}
      <section className="hp-hero">
        <div className="hp-glow hp-glow--1" />
        <div className="hp-glow hp-glow--2" />
        
        <div className="hp-hero-container">
          <div className="hp-hero-text">
            {/* Free Shipping Announcement */}
            <div className="hp-hero-tags-row">
              <span className="hp-shipping-announcement">
                <FaShippingFast /> Free Global Express Shipping & No Customs Fees
              </span>
              <span className="hp-badge-tag hp-badge-tag--special">
                <FaTag /> Special Offers Live
              </span>
            </div>

            <h1 className="hp-hero-title">
              Next-Gen Electronics <span className="hp-gradient-text">Without Borders</span>
            </h1>

            <p className="hp-hero-sub">
              Direct-import flagship smartphones, OLED laptops, spatial audio, and smart wearables at verified factory-direct pricing.
            </p>

            {/* Special Offers Highlight Bar */}
            <div className="hp-special-offers-bar">
              <span className="hp-offer-pill">
                <FaTag /> Save up to $300 on MacBooks & S25 Ultra
              </span>
              <span className="hp-offer-pill">
                <FaShieldAlt /> 2-Year Official Brand Warranty
              </span>
              <span className="hp-offer-pill">
                <FaCheckCircle /> 100% Genuine Guaranteed
              </span>
            </div>

            {/* CTA Actions with Shop Now button */}
            <div className="hp-hero-actions">
              <Link to="/products" className="hp-btn-primary hp-btn-shop-now">
                <FaShoppingCart /> Shop Now <FaArrowRight />
              </Link>
              <Link to="/products" className="hp-btn-secondary">
                <FaTag /> Explore All Deals
              </Link>
            </div>

            {/* Trust rating */}
            <div className="hp-hero-rating">
              <div className="hp-stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <span>Trusted by 10,000+ tech enthusiasts globally</span>
            </div>
          </div>

          {/* Featured Product Image Showcase */}
          <div className="hp-hero-visual">
            <div 
              className="hp-image-container hp-3d-tilt-card"
              style={tiltStyle}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Featured Flagship Product Photo */}
              <img 
                src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900&auto=format&fit=crop&q=85" 
                alt="Featured Flagship Device - iPhone 16 Pro Max" 
                className="hp-hero-img hp-featured-flagship-img"
                onError={(e) => {
                  e.target.src = "/electronics_hero.png";
                }}
              />

              {/* Special Offer Ribbon */}
              <div className="hp-floating-offer-ribbon">
                <FaFire /> SAVE $200 (13% OFF)
              </div>

              {/* Free Shipping Badge */}
              <div className="hp-floating-badge hp-floating-badge--1">
                <FaShippingFast /> Free Express Delivery
              </div>

              {/* In Stock Badge */}
              <div className="hp-floating-badge hp-floating-badge--2">
                <FaCheckCircle /> Verified In Stock
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive 3D Product Showcase Section ── */}
      <section className="hp-3d-showcase-section">
        <div className="hp-section-header">
          <span className="hp-tag"><MdViewInAr /> Interactive 3D Showcase</span>
          <h2 className="hp-section-title">Explore Tech in 3D Perspective</h2>
          <p className="hp-section-subtitle">
            Experience our flagship innovations with full depth, tactile details, and holographic previews.
          </p>
        </div>

        <div className="hp-3d-showcase-container">
          <div className="hp-3d-tabs">
            {SHOWCASE_3D_ITEMS.map((item, idx) => (
              <button
                key={idx}
                className={`hp-3d-tab-btn ${active3DTab === idx ? "hp-3d-tab-btn--active" : ""}`}
                onClick={() => setActive3DTab(idx)}
              >
                <FaCube /> {item.title}
              </button>
            ))}
          </div>

          <div className="hp-3d-display-card">
            <div className="hp-3d-display-info">
              <span className="hp-3d-tag">{SHOWCASE_3D_ITEMS[active3DTab].tag}</span>
              <h3 className="hp-3d-display-title">{SHOWCASE_3D_ITEMS[active3DTab].title}</h3>
              <p className="hp-3d-display-sub">{SHOWCASE_3D_ITEMS[active3DTab].subtitle}</p>
              <p className="hp-3d-display-desc">{SHOWCASE_3D_ITEMS[active3DTab].desc}</p>
              <div className="hp-3d-display-bottom">
                <span className="hp-3d-price">{SHOWCASE_3D_ITEMS[active3DTab].price}</span>
                <Link to="/products" className="hp-btn-primary">
                  <FaShoppingCart /> Buy Now
                </Link>
              </div>
            </div>

            <div className="hp-3d-display-visual">
              <img 
                src={SHOWCASE_3D_ITEMS[active3DTab].img} 
                alt="3D Product View" 
                className="hp-3d-view-img"
              />
              <div className="hp-3d-badge-floating">
                <MdViewInAr size={20} /> 360° Interactive Visual
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Global Trust Perks ── */}
      <section className="hp-perks-section">
        <div className="hp-perks-grid">
          {TRUST_PERKS.map((perk, idx) => (
            <div className="hp-perk-card" key={idx}>
              <div className="hp-perk-icon">{perk.icon}</div>
              <h3 className="hp-perk-title">{perk.title}</h3>
              <p className="hp-perk-desc">{perk.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Categories ── */}
      <section className="hp-cats-section">
        <div className="hp-section-header">
          <span className="hp-tag">Curated Collections</span>
          <h2 className="hp-section-title">Shop by Category</h2>
          <p className="hp-section-subtitle">Browse through our international catalogue of top-tier hardware.</p>
        </div>

        <div className="hp-cats-grid">
          {CATEGORIES.map((cat, idx) => (
            <div 
              className="hp-cat-card hp-3d-hover-card" 
              key={idx}
              onClick={handleCategoryClick}
            >
              <span className="hp-cat-emoji">{cat.emoji}</span>
              <h3 className="hp-cat-name">{cat.name}</h3>
              <span className="hp-cat-count">{cat.count}</span>
              <span className="hp-cat-link">
                Browse <MdOutlineKeyboardDoubleArrowRight />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Flagships Section ── */}
      <section className="hp-featured-section">
        <div className="hp-section-header">
          <span className="hp-tag"><FaBolt /> Trending Flagships</span>
          <h2 className="hp-section-title">Featured Tech Devices</h2>
          <p className="hp-section-subtitle">
            Hand-picked flagship smartphones, laptops, audio gear, and wearables with verified warranty.
          </p>
        </div>

        <div className="hp-featured-grid">
          {STATIC_PRODUCTS.slice(0, 4).map((product) => {
            const pid = product.id || product._id;
            const inCart = cart.find((i) => (i.id || i._id) === pid);
            return (
              <ProductCard
                key={pid}
                product={product}
                onAddToCart={addToCart}
                onQuickView={(p) => {
                  setQuickViewProduct(p);
                  setIsQuickViewOpen(true);
                }}
                cartCount={inCart ? inCart.qty : 0}
                isWishlisted={wishlist.includes(pid)}
                onToggleWishlist={handleToggleWishlist}
              />
            );
          })}
        </div>

        <div className="hp-featured-action">
          <Link to="/products" className="hp-btn-primary">
            Explore All Products <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* ── Cinematic Video Showcase Section ── */}
      <section className="hp-video-section">
        <div className="hp-section-header">
          <span className="hp-tag"><FaPlay /> Cinematic Experience</span>
          <h2 className="hp-section-title">Futuristic Micro-Engineering Video</h2>
          <p className="hp-section-subtitle">
            Watch our high-tech circuit board processing power and micro-chip assembly in 4K resolution.
          </p>
        </div>

        <div className="hp-video-container">
          <div className="hp-video-wrapper">
            <iframe
              className="hp-video-player"
              src="https://www.youtube-nocookie.com/embed/LXb3EKWsInQ?autoplay=1&mute=1&loop=1&playlist=LXb3EKWsInQ&controls=1&modestbranding=1&rel=0"
              title="Futuristic Tech Showcase Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div className="hp-video-overlay">
              <span className="hp-video-badge">🔴 LIVE 4K HARDWARE SHOWCASE</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Promo Banner ── */}
      <section className="hp-promo-section">
        <div className="hp-promo-card">
          <div className="hp-promo-content">
            <span className="hp-badge-tag hp-badge-tag--green">Limited Time Offer</span>
            <h2 className="hp-promo-title">Upgrade to the Ultimate Creative Setup</h2>
            <p className="hp-promo-desc">
              Get up to 15% off on MacBook Pro M4 & Dell XPS series laptops. Guaranteed international warranty included.
            </p>
            <Link to="/products" className="hp-btn-primary hp-btn-primary--dark">
              Shop Laptops Now
            </Link>
          </div>
          <div className="hp-promo-visual">
            <span className="hp-promo-emoji">💻</span>
          </div>
        </div>
      </section>

      {/* ── Newsletter Section ── */}
      <section className="hp-newsletter">
        <div className="hp-newsletter-glow" />
        <div className="hp-newsletter-content">
          <h2 className="hp-news-title">Stay Ahead of the Curve</h2>
          <p className="hp-news-sub">Subscribe to our newsletter for exclusive deals, early access to device launches, and international shipping discounts.</p>
          
          <form className="hp-news-form" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="hp-news-input"
              required 
            />
            <button type="submit" className="hp-news-btn">
              Subscribe
            </button>
          </form>
          <span className="hp-news-note">Zero spam. Unsubscribe anytime.</span>
        </div>
      </section>

      {/* ── Quick View Modal ── */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false);
          setQuickViewProduct(null);
        }}
        onAddToCart={addToCart}
        isWishlisted={
          quickViewProduct
            ? wishlist.includes(quickViewProduct.id || quickViewProduct._id)
            : false
        }
        onToggleWishlist={handleToggleWishlist}
      />
    </div>
  );
}
