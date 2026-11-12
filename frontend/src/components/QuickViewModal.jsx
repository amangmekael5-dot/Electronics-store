import { useState, useEffect } from "react";
import { FaShoppingCart, FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaRegHeart, FaTimes, FaShieldAlt, FaTruck, FaUndo } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import "./QuickViewModal.css";

export function getProductBrand(product) {
  if (product?.brand && product.brand.trim()) return product.brand.trim();
  const name = product?.name || "";
  if (/^iPhone|^MacBook|^iPad|^AirPods|^Apple/i.test(name)) return "Apple";
  if (/^Samsung|Galaxy/i.test(name)) return "Samsung";
  if (/^Sony/i.test(name)) return "Sony";
  if (/^Dell|^XPS/i.test(name)) return "Dell";
  if (/^DJI/i.test(name)) return "DJI";
  if (/^ASUS|^ROG/i.test(name)) return "ASUS";
  if (/^Google|^Pixel/i.test(name)) return "Google";
  return product?.category || "Tech";
}

function StarRating({ rating = 5 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} />);
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} />);
    else stars.push(<FaRegStar key={i} />);
  }
  return <span className="qvm-stars">{stars}</span>;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Reset quantity and image error on product change or open
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setAdded(false);
      setImgError(false);
    }
  }, [isOpen, product]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const brand = getProductBrand(product);
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const inStock = product.inStock !== false;

  const handleAdd = () => {
    if (!inStock) return;
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="qvm-overlay" onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className="qvm-modal">
        {/* Close Button */}
        <button className="qvm-close-btn" onClick={onClose} aria-label="Close modal">
          <FaTimes />
        </button>

        <div className="qvm-layout">
          {/* Visual Column */}
          <div className="qvm-visual-col" style={{ background: product.gradient || "var(--ep-surface2)" }}>
            {discount > 0 && (
              <span className="qvm-discount-badge">-{discount}% OFF</span>
            )}

            {product.image && !imgError ? (
              <img
                src={product.image}
                alt={product.name}
                className="qvm-main-img"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="qvm-fallback-emoji">
                <span>{product.emoji || "📦"}</span>
              </div>
            )}

            {product.badge && (
              <div className="qvm-badge-tag" style={{ backgroundColor: product.badgeColor || "var(--ep-accent)" }}>
                ⚡ {product.badge}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="qvm-details-col">
            {/* Top row: Brand & Category */}
            <div className="qvm-meta-row">
              <span className="qvm-brand-pill">{brand}</span>
              <span className="qvm-category-pill">{product.category}</span>
            </div>

            {/* Product Name */}
            <h2 className="qvm-title">{product.name}</h2>

            {/* Ratings & Reviews */}
            <div className="qvm-rating-row">
              <StarRating rating={product.rating || 5} />
              <span className="qvm-rating-score">{product.rating || 5.0}</span>
              <span className="qvm-review-count">
                ({(product.reviews || 0).toLocaleString()} customer reviews)
              </span>
            </div>

            {/* Price Row */}
            <div className="qvm-price-row">
              <span className="qvm-current-price">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="qvm-original-price">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
              {discount > 0 && (
                <span className="qvm-save-tag">
                  Save ${(product.originalPrice - product.price).toLocaleString()} ({discount}%)
                </span>
              )}
            </div>

            {/* Stock Availability */}
            <div className="qvm-stock-row">
              {inStock ? (
                <span className="qvm-stock-badge qvm-stock--in">
                  <span className="qvm-stock-dot qvm-stock-dot--in" />
                  In Stock — Ready for Express Delivery
                </span>
              ) : (
                <span className="qvm-stock-badge qvm-stock--out">
                  <span className="qvm-stock-dot qvm-stock-dot--out" />
                  Currently Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <p className="qvm-description">{product.description}</p>

            {/* Value Highlights */}
            <div className="qvm-perks">
              <div className="qvm-perk-item">
                <FaTruck /> <span>Free Global Express Shipping</span>
              </div>
              <div className="qvm-perk-item">
                <FaShieldAlt /> <span>2-Year Official Brand Warranty</span>
              </div>
              <div className="qvm-perk-item">
                <FaUndo /> <span>30-Day Money-Back Guarantee</span>
              </div>
            </div>

            {/* Actions: Quantity + Add to Cart + Wishlist */}
            <div className="qvm-actions-wrap">
              {inStock && (
                <div className="qvm-qty-picker">
                  <button
                    type="button"
                    className="qvm-qty-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    –
                  </button>
                  <span className="qvm-qty-num">{quantity}</span>
                  <button
                    type="button"
                    className="qvm-qty-btn"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    +
                  </button>
                </div>
              )}

              <button
                className={`qvm-add-btn ${added ? "qvm-add-btn--added" : ""} ${!inStock ? "qvm-add-btn--oos" : ""}`}
                onClick={handleAdd}
                disabled={!inStock}
              >
                {added ? (
                  <>
                    <MdVerified /> Added {quantity > 1 ? `${quantity} items` : ""} to Cart!
                  </>
                ) : inStock ? (
                  <>
                    <FaShoppingCart /> Add to Cart {quantity > 1 ? `(${quantity})` : ""}
                  </>
                ) : (
                  "Out of Stock"
                )}
              </button>

              <button
                className={`qvm-wish-btn ${isWishlisted ? "qvm-wish-btn--active" : ""}`}
                onClick={() => onToggleWishlist(product)}
                title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                aria-label="Toggle Wishlist"
              >
                {isWishlisted ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
