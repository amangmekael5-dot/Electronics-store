import { useState, useMemo, useEffect } from "react";
import { FaShoppingCart, FaSearch, FaBolt, FaFilter, FaHeart, FaSlidersH, FaTimes, FaUndo, FaTag } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { useCart } from "../context/CartContext";
import ProductCard from "./ProductCard";
import QuickViewModal, { getProductBrand } from "./QuickViewModal";
import ProductFilters from "./ProductFilters";
import "./ProductsPage.css";

// ─── Static Fallback Product Data with Real Images, Brands, & Conditions ──────
export const STATIC_PRODUCTS = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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
    id: 7,
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
    id: 8,
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
    id: 9,
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
    id: 10,
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
    id: 11,
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
    id: 12,
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
  },
];

const CATEGORIES = ["All", "Phones", "Laptops", "Audio", "Wearables", "Tablets", "Cameras"];

// ─── Main Products Page ───────────────────────────────────────────────────────
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // ── Requested Sorting Options:
  // Featured, Newest arrivals, Price: Low to High, Price: High to Low, Best Selling, Highest Rated
  const [sortBy, setSortBy] = useState("featured");

  // ── Requested Recommended Filters:
  // 1. Price range
  const [priceFilter, setPriceFilter] = useState({ min: "", max: "" });
  // 2. Brand (multi-select)
  const [selectedBrands, setSelectedBrands] = useState([]);
  // 3. Customer rating
  const [minRating, setMinRating] = useState(0);
  // 4. Availability
  const [availability, setAvailability] = useState("all"); // 'all' | 'in-stock' | 'out-of-stock'
  // 5. Product condition
  const [conditionFilter, setConditionFilter] = useState("all"); // 'all' | 'Brand New' | 'Certified Refurbished'
  // 6. Discount percentage
  const [discountFilter, setDiscountFilter] = useState("all"); // 'all' | 'any' | '10' | '15'

  // Mobile and Desktop Sidebar Controls
  const [isOpenMobileFilters, setIsOpenMobileFilters] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Cart Context
  const { cart, addToCart, totalItems } = useCart();

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

  // Cart Toast Notification
  const [showCartToast, setShowCartToast] = useState(false);
  const [toastProduct, setToastProduct] = useState(null);

  // Persist Wishlist
  useEffect(() => {
    try {
      localStorage.setItem("elec_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.warn("Could not save wishlist to localStorage:", e);
    }
  }, [wishlist]);

  // Fetch Products dynamically from Backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error(`Backend returned ${response.status}`);
        const json = await response.json();
        const list = json.data ?? json;
        if (Array.isArray(list) && list.length > 0) {
          const enriched = list.map((p) => {
            const staticMatch = STATIC_PRODUCTS.find(
              (sp) => sp.name.toLowerCase() === p.name.toLowerCase()
            );
            return {
              ...p,
              brand: p.brand || staticMatch?.brand || getProductBrand(p),
              image: p.image || staticMatch?.image || "",
              condition: p.condition || staticMatch?.condition || "Brand New",
              salesCount: p.salesCount || staticMatch?.salesCount || 1000,
            };
          });
          setProducts(enriched);
        } else {
          setProducts(STATIC_PRODUCTS);
        }
      } catch (err) {
        console.warn("⚠️ Backend offline — using local data.", err.message);
        setProducts(STATIC_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Compute Brand Counts for the filters
  const brandCounts = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      const b = p.brand || getProductBrand(p);
      if (b) counts[b] = (counts[b] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (priceFilter.min !== "" || priceFilter.max !== "") count++;
    if (selectedBrands.length > 0) count += selectedBrands.length;
    if (minRating > 0) count++;
    if (availability !== "all") count++;
    if (conditionFilter !== "all") count++;
    if (discountFilter !== "all") count++;
    return count;
  }, [priceFilter, selectedBrands, minRating, availability, conditionFilter, discountFilter]);

  // Reset All Filters
  const handleResetAllFilters = () => {
    setPriceFilter({ min: "", max: "" });
    setSelectedBrands([]);
    setMinRating(0);
    setAvailability("all");
    setConditionFilter("all");
    setDiscountFilter("all");
  };

  // Handle Add to Cart
  const handleAddToCart = (product, quantity = 1) => {
    addToCart(product, quantity);
    setToastProduct(product);
    setShowCartToast(true);
    setTimeout(() => setShowCartToast(false), 2500);
  };

  // Handle Wishlist Toggle
  const handleToggleWishlist = (product) => {
    const pid = product.id || product._id;
    setWishlist((prev) => {
      if (prev.includes(pid)) {
        return prev.filter((id) => id !== pid);
      } else {
        return [...prev, pid];
      }
    });
  };

  // Quick View Handlers
  const handleOpenQuickView = (product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  // ── Multi-Criteria Filtering & Sorting Execution ────────────────────────────
  const filtered = useMemo(() => {
    let list = products;

    // 1. Category Filter
    if (activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
    }

    // 2. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q))
      );
    }

    // 3. Price Range Filter
    if (priceFilter.min !== "" && !isNaN(Number(priceFilter.min))) {
      list = list.filter((p) => p.price >= Number(priceFilter.min));
    }
    if (priceFilter.max !== "" && !isNaN(Number(priceFilter.max))) {
      list = list.filter((p) => p.price <= Number(priceFilter.max));
    }

    // 4. Brand Filter (Multi-Select)
    if (selectedBrands.length > 0) {
      list = list.filter((p) => {
        const b = p.brand || getProductBrand(p);
        return selectedBrands.includes(b);
      });
    }

    // 5. Customer Rating Filter
    if (minRating > 0) {
      list = list.filter((p) => (p.rating || 5) >= minRating);
    }

    // 6. Availability Filter
    if (availability === "in-stock") {
      list = list.filter((p) => p.inStock !== false);
    } else if (availability === "out-of-stock") {
      list = list.filter((p) => p.inStock === false);
    }

    // 7. Product Condition Filter
    if (conditionFilter !== "all") {
      list = list.filter(
        (p) => (p.condition || "Brand New") === conditionFilter
      );
    }

    // 8. Discount Percentage Filter
    if (discountFilter !== "all") {
      list = list.filter((p) => {
        const disc =
          p.originalPrice && p.originalPrice > p.price
            ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
            : 0;
        if (discountFilter === "any") return disc > 0;
        return disc >= Number(discountFilter);
      });
    }

    // ── Sorting Execution ──
    if (sortBy === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      list = [...list].sort(
        (a, b) =>
          (b.newArrival || b.isNew ? 1 : 0) - (a.newArrival || a.isNew ? 1 : 0) ||
          (b.id || 0) - (a.id || 0)
      );
    } else if (sortBy === "best-selling") {
      list = [...list].sort(
        (a, b) =>
          ((b.badge === "Best Seller" ? 10000 : 0) +
            (b.salesCount || b.reviews || 0)) -
          ((a.badge === "Best Seller" ? 10000 : 0) +
            (a.salesCount || a.reviews || 0))
      );
    } else if (sortBy === "highest-rated") {
      list = [...list].sort(
        (a, b) =>
          (b.rating || 0) - (a.rating || 0) ||
          (b.reviews || 0) - (a.reviews || 0)
      );
    }

    return list;
  }, [
    products,
    activeCategory,
    searchQuery,
    priceFilter,
    selectedBrands,
    minRating,
    availability,
    conditionFilter,
    discountFilter,
    sortBy,
  ]);

  return (
    <div className="ep-page">
      {/* ── Hero Banner ── */}
      <section className="ep-hero">
        <div className="ep-hero-glow ep-hero-glow--1" />
        <div className="ep-hero-glow ep-hero-glow--2" />
        <div className="ep-hero-content">
          <span className="ep-hero-tag">
            <FaBolt /> Premium Tech Catalog
          </span>
          <h1 className="ep-hero-title">Discover the Future of Electronics</h1>
          <p className="ep-hero-sub">
            Explore authentic flagship gadgets, smartphones, laptops, audio, and wearables with advanced filtering.
          </p>

          {/* Search */}
          <div className="ep-search-wrap">
            <FaSearch className="ep-search-icon" />
            <input
              id="product-search"
              className="ep-search"
              type="text"
              placeholder="Search by brand, product name, or specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ── Controls Bar ── */}
      <section className="ep-controls">
        {/* Category Pills */}
        <div className="ep-cats">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`filter-${cat.toLowerCase()}`}
              className={`ep-cat-btn ${activeCategory === cat ? "ep-cat-btn--active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="ep-controls-right">
          {/* Filter Toggle Button */}
          <button
            type="button"
            className={`ep-filter-toggle-btn ${activeFilterCount > 0 ? "ep-filter-toggle-btn--active" : ""}`}
            onClick={() => {
              setIsOpenMobileFilters(true);
              setShowSidebar(!showSidebar);
            }}
            title="Toggle Filter Sidebar"
          >
            <FaSlidersH />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="ep-filter-badge">{activeFilterCount}</span>
            )}
          </button>

          {/* Requested Sorting Dropdown */}
          <div className="ep-sort-wrap">
            <FaFilter className="ep-sort-icon" />
            <select
              id="sort-select"
              className="ep-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="best-selling">Best Selling</option>
              <option value="highest-rated">Highest Rated</option>
            </select>
          </div>
        </div>
      </section>

      {/* ── Results Bar & Active Filter Chips ── */}
      <div className="ep-results-bar">
        <div className="ep-results-meta">
          {loading ? (
            <span>Connecting to catalog database...</span>
          ) : (
            <span className="ep-results-count">
              Showing <strong>{filtered.length}</strong> of {products.length} products
            </span>
          )}

          {/* Active Filter Chips */}
          {activeFilterCount > 0 && (
            <div className="ep-active-chips">
              {priceFilter.min !== "" && (
                <span className="ep-chip">
                  Min: ${priceFilter.min}
                  <button onClick={() => setPriceFilter({ ...priceFilter, min: "" })}>
                    <FaTimes />
                  </button>
                </span>
              )}
              {priceFilter.max !== "" && (
                <span className="ep-chip">
                  Max: ${priceFilter.max}
                  <button onClick={() => setPriceFilter({ ...priceFilter, max: "" })}>
                    <FaTimes />
                  </button>
                </span>
              )}
              {selectedBrands.map((b) => (
                <span key={b} className="ep-chip">
                  {b}
                  <button
                    onClick={() =>
                      setSelectedBrands(selectedBrands.filter((br) => br !== b))
                    }
                  >
                    <FaTimes />
                  </button>
                </span>
              ))}
              {minRating > 0 && (
                <span className="ep-chip">
                  {minRating}+ ★
                  <button onClick={() => setMinRating(0)}>
                    <FaTimes />
                  </button>
                </span>
              )}
              {availability !== "all" && (
                <span className="ep-chip">
                  {availability === "in-stock" ? "In Stock" : "Out of Stock"}
                  <button onClick={() => setAvailability("all")}>
                    <FaTimes />
                  </button>
                </span>
              )}
              {conditionFilter !== "all" && (
                <span className="ep-chip">
                  {conditionFilter}
                  <button onClick={() => setConditionFilter("all")}>
                    <FaTimes />
                  </button>
                </span>
              )}
              {discountFilter !== "all" && (
                <span className="ep-chip">
                  {discountFilter === "any" ? "On Sale" : `${discountFilter}%+ Off`}
                  <button onClick={() => setDiscountFilter("all")}>
                    <FaTimes />
                  </button>
                </span>
              )}

              <button
                type="button"
                className="ep-clear-all-btn"
                onClick={handleResetAllFilters}
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Wishlist & Cart Summary */}
        <div className="ep-header-stats">
          {wishlist.length > 0 && (
            <span className="ep-wishlist-count">
              <FaHeart /> {wishlist.length} saved
            </span>
          )}
          {totalItems > 0 && (
            <span className="ep-cart-count">
              <FaShoppingCart /> {totalItems} item{totalItems > 1 ? "s" : ""} in cart
            </span>
          )}
        </div>
      </div>

      {/* ── Main Layout: Sidebar Filters + Products Grid ── */}
      <div className="ep-catalog-layout">
        {/* Mobile Backdrop */}
        {isOpenMobileFilters && (
          <div
            className="ep-mobile-backdrop"
            onClick={() => setIsOpenMobileFilters(false)}
          />
        )}

        {/* Sidebar Filters */}
        <div className={`ep-sidebar-wrapper ${!showSidebar ? "ep-sidebar-wrapper--hidden" : ""}`}>
          <ProductFilters
            priceFilter={priceFilter}
            setPriceFilter={setPriceFilter}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            minRating={minRating}
            setMinRating={setMinRating}
            availability={availability}
            setAvailability={setAvailability}
            conditionFilter={conditionFilter}
            setConditionFilter={setConditionFilter}
            discountFilter={discountFilter}
            setDiscountFilter={setDiscountFilter}
            onResetAll={handleResetAllFilters}
            activeFilterCount={activeFilterCount}
            brandCounts={brandCounts}
            isOpenMobile={isOpenMobileFilters}
            onCloseMobile={() => setIsOpenMobileFilters(false)}
          />
        </div>

        {/* Products Grid Area */}
        <main className="ep-grid-container">
          {filtered.length > 0 ? (
            <div className="ep-grid">
              {filtered.map((product) => {
                const pid = product.id || product._id;
                const inCartItem = cart.find((i) => (i.id || i._id) === pid);
                return (
                  <ProductCard
                    key={pid}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleOpenQuickView}
                    cartCount={inCartItem ? inCartItem.qty : 0}
                    isWishlisted={wishlist.includes(pid)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                );
              })}
            </div>
          ) : (
            <div className="ep-empty">
              <span className="ep-empty-icon">🔍</span>
              <h3>No products match your filters</h3>
              <p>Try loosening your price, brand, or discount filters to see more results.</p>
              <button
                type="button"
                className="ep-btn ep-btn--reset-filters"
                onClick={handleResetAllFilters}
              >
                <FaUndo /> Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ── Quick View Modal ── */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={handleCloseQuickView}
        onAddToCart={handleAddToCart}
        isWishlisted={
          quickViewProduct
            ? wishlist.includes(quickViewProduct.id || quickViewProduct._id)
            : false
        }
        onToggleWishlist={handleToggleWishlist}
      />

      {/* ── Cart Toast Notification ── */}
      <div className={`ep-toast ${showCartToast ? "ep-toast--show" : ""}`}>
        <MdVerified className="ep-toast-icon" />
        <div>
          <strong>{toastProduct?.name}</strong>
          <p>Added to your cart!</p>
        </div>
      </div>
    </div>
  );
}
