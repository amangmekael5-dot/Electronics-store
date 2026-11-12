import { Link } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowRight, FaShieldAlt } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import "./CartPage.css";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();

  const shipping = totalPrice > 500 ? 0 : 25;
  const tax = Math.round(totalPrice * 0.08); // 8% estimated tax
  const finalTotal = totalPrice + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="ct-page ct-page--empty">
        <div className="ct-empty-container">
          <div className="ct-empty-icon">
            <FaShoppingBag />
          </div>
          <h1 className="ct-empty-title">Your Cart is Empty</h1>
          <p className="ct-empty-desc">
            Looks like you haven't added any premium gadgets to your cart yet. Let's find something amazing!
          </p>
          <Link to="/products" className="ct-btn-primary">
            Explore Products <FaArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ct-page">
      <div className="ct-container">
        
        {/* Cart Items Header */}
        <div className="ct-header">
          <h1 className="ct-title">Shopping Cart</h1>
          <span className="ct-count">{cart.length} unique item{cart.length > 1 ? "s" : ""}</span>
        </div>

        <div className="ct-layout">
          
          {/* Items List */}
          <div className="ct-list-wrap">
            <div className="ct-list-header">
              <span>Product Details</span>
              <span>Quantity</span>
              <span>Price</span>
            </div>
            
            <div className="ct-items">
              {cart.map((item) => {
                const pid = item._id || item.id;
                return (
                  <div className="ct-item" key={pid}>
                    {/* Visual & Meta */}
                    <div className="ct-item-meta">
                      <div className="ct-item-visual" style={{ background: item.gradient || "var(--ct-surface2)" }}>
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="ct-item-img" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />
                        ) : (
                          <span className="ct-item-emoji">{item.emoji || "📦"}</span>
                        )}
                      </div>
                      <div className="ct-item-details">
                        <span className="ct-item-cat">{item.category}</span>
                        <h3 className="ct-item-name">{item.name}</h3>
                        <p className="ct-item-desc">{item.description}</p>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="ct-item-qty">
                      <button 
                        className="ct-qty-btn"
                        onClick={() => updateQuantity(pid, item.qty - 1)}
                        aria-label="Decrease quantity"
                      >
                        <FaMinus />
                      </button>
                      <span className="ct-qty-val">{item.qty}</span>
                      <button 
                        className="ct-qty-btn"
                        onClick={() => updateQuantity(pid, item.qty + 1)}
                        aria-label="Increase quantity"
                      >
                        <FaPlus />
                      </button>
                    </div>

                    {/* Pricing */}
                    <div className="ct-item-pricing">
                      <span className="ct-item-price">${(item.price * item.qty).toLocaleString()}</span>
                      <button 
                        className="ct-remove-btn"
                        onClick={() => removeFromCart(pid)}
                        title="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Clear Cart Actions */}
            <div className="ct-actions-row">
              <Link to="/products" className="ct-btn-text">
                &larr; Continue Shopping
              </Link>
              <button className="ct-btn-danger-outline" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="ct-summary-wrap">
            <h2 className="ct-summary-title">Order Summary</h2>
            
            <div className="ct-summary-rows">
              <div className="ct-summary-row">
                <span>Subtotal</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
              <div className="ct-summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `$${shipping.toLocaleString()}`}</span>
              </div>
              <div className="ct-summary-row">
                <span>Estimated Tax (8%)</span>
                <span>${tax.toLocaleString()}</span>
              </div>
              
              <div className="ct-summary-divider" />
              
              <div className="ct-summary-row ct-summary-row--total">
                <span>Total Amount</span>
                <span>${finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <Link to="/checkout" className="ct-btn-primary ct-btn-checkout">
              Proceed to Checkout <FaArrowRight />
            </Link>

            <div className="ct-trust-footer">
              <FaShieldAlt />
              <span>Secure 256-bit SSL encrypted connection.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
