import { useState } from "react";
import { FaShoppingCart, FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaRegHeart, FaEye, FaBolt } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { getProductBrand } from "./QuickViewModal";
import "./ProductCard.css";

// ─── Rating Stars Component ───────────────────────────────────────────────────
function StarRating({ rating = 5 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} />);
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} />);
    else stars.push(<FaRegStar key={i} />);
  }
  return <span className="pc-stars">{stars}</span>;
}

// ─── Product Card Component ───────────────────────────────────────────────────
export default function ProductCard({
  product,
  onAddToCart,
  onQuickView,
  cartCount = 0,
  isWishlisted = false,
  onToggleWishlist,
}) {
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const pid = product.id || product._id;
  const brand = getProductBrand(product);
  const inStock = product.inStock !== false;

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAdd = (e) => {
    e?.stopPropagation();
    if (!inStock) return;
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlistClick = (e) => {
    e?.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product);
    }
  };

  const handleQuickViewClick = (e) => {
    e?.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div
      className={`pc-card ${!inStock ? "pc-card--oos" : ""}`}
      id={`product-${pid}`}
      onClick={() => onQuickView && onQuickView(product)}
      role="article"
      aria-label={product.name}
    >
      {/* ── Top Bar Badges & Actions ── */}
      <div className="pc-top-bar">
        {/* Discount Percentage Badge */}
        {discount > 0 ? (
          <span className="pc-discount-badge">-{discount}% OFF</span>
        ) : (product.newArrival || product.isNew) ? (
          <span className="pc-new-badge">NEW</span>
        ) : <span />}

        {/* Wishlist Button */}
        <button
          type="button"
          className={`pc-wish-btn ${isWishlisted ? "pc-wish-btn--active" : ""}`}
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>

      {/* ── Real Product Image Visual Area ── */}
      <div
        className="pc-visual"
        style={{ background: product.gradient || "var(--ep-surface2)" }}
      >
        {product.image && !imgError ? (
          <img
            src={product.image}
            alt={product.name}
            className="pc-img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="pc-emoji">{product.emoji || "📦"}</span>
        )}

        {/* Quick View Overlay Button on Hover */}
        <button
          type="button"
          className="pc-quick-view-overlay"
          onClick={handleQuickViewClick}
          aria-label={`Quick view ${product.name}`}
        >
          <FaEye /> Quick View
        </button>
      </div>

      {/* ── Badge (e.g. Best Seller, Hot Deal) ── */}
      {product.badge && (
        <div
          className="pc-badge"
          style={{ backgroundColor: product.badgeColor || "var(--ep-accent)" }}
        >
          <FaBolt size={10} /> {product.badge}
        </div>
      )}

      {/* ── Product Info ── */}
      <div className="pc-info">
        {/* Brand & Category Row */}
        <div className="pc-meta-row">
          <div className="pc-brand-group">
            <span className="pc-brand-tag">{brand}</span>
            {product.condition && product.condition !== "Brand New" && (
              <span className="pc-condition-tag">{product.condition}</span>
            )}
          </div>
          <span className="pc-category-tag">{product.category}</span>
        </div>

        {/* Product Name */}
        <h3 className="pc-name" title={product.name}>
          {product.name}
        </h3>

        {/* Star Rating and Review Count */}
        <div className="pc-rating-row">
          <StarRating rating={product.rating || 5} />
          <span className="pc-rating-val">{product.rating || 5.0}</span>
          <span className="pc-reviews">
            ({(product.reviews || 0).toLocaleString()})
          </span>
        </div>

        {/* Current Price and Original Price */}
        <div className="pc-price-row">
          <div className="pc-prices">
            <span className="pc-price">${product.price.toLocaleString()}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="pc-original">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {discount > 0 && (
            <span className="pc-savings-pill">Save {discount}%</span>
          )}
        </div>

        {/* Stock Availability Indicator */}
        <div className="pc-stock-row">
          {inStock ? (
            <span className="pc-stock-badge pc-stock--in">
              <span className="pc-stock-dot pc-stock-dot--in" />
              In Stock
            </span>
          ) : (
            <span className="pc-stock-badge pc-stock--out">
              <span className="pc-stock-dot pc-stock-dot--out" />
              Out of Stock
            </span>
          )}
        </div>

        {/* ── Card Action Buttons ── */}
        <div className="pc-actions-row">
          {/* Add to Cart Button */}
          {inStock ? (
            <button
              type="button"
              className={`pc-cart-btn ${added ? "pc-cart-btn--added" : ""}`}
              onClick={handleAdd}
              id={`add-to-cart-${pid}`}
              aria-label={`Add ${product.name} to cart`}
            >
              {added ? (
                <>
                  <MdVerified /> Added!
                </>
              ) : (
                <>
                  <FaShoppingCart />
                  <span>Add to Cart</span>
                  {cartCount > 0 && (
                    <span className="pc-cart-count-chip">{cartCount}</span>
                  )}
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              className="pc-cart-btn pc-cart-btn--oos"
              disabled
            >
              Out of Stock
            </button>
          )}

          {/* Quick View Button */}
          <button
            type="button"
            className="pc-qv-btn"
            onClick={handleQuickViewClick}
            title="Quick View"
            aria-label={`Quick View ${product.name}`}
          >
            <FaEye />
          </button>
        </div>
      </div>
    </div>
  );
}
