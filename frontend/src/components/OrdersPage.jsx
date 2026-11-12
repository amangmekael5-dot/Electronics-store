import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBoxOpen, FaClock, FaCheckCircle, FaTruck, FaTimesCircle, FaArrowLeft, FaReceipt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "./OrdersPage.css";

export default function OrdersPage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        if (json.success) {
          setOrders(json.data);
        } else {
          setError(json.message || "Failed to load orders.");
        }
      } catch (err) {
        setError("Something went wrong while fetching your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token, navigate]);

  if (loading) {
    return (
      <div className="od-loading">
        <span className="od-spinner" />
      </div>
    );
  }

  return (
    <div className="od-page">
      <div className="od-container">
        
        {/* Back Link */}
        <Link to="/products" className="od-back-link">
          <FaArrowLeft /> Back to Shop
        </Link>

        <h1 className="od-title">My Orders</h1>
        <p className="od-subtitle">Track, view details, and manage your recent store purchases.</p>

        {error && <div className="od-error-banner">{error}</div>}

        {orders.length === 0 ? (
          <div className="od-empty-state">
            <FaBoxOpen size={48} className="od-empty-icon" />
            <h2>No orders placed yet</h2>
            <p>Looks like you haven't bought anything yet. Explore our gadgets catalog to place your first order!</p>
            <Link to="/products" className="od-btn-primary">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="od-list">
            {orders.map((order) => {
              const date = new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return (
                <div key={order._id} className="od-card">
                  {/* Card Header */}
                  <div className="od-card-header">
                    <div className="od-meta-left">
                      <span className="od-id-label">ORDER ID</span>
                      <strong className="od-id-value">#{order._id.slice(-8).toUpperCase()}</strong>
                      <span className="od-date">{date}</span>
                    </div>

                    <div className="od-meta-right">
                      <span className={`od-status-chip od-status-chip--${order.status}`}>
                        {order.status === "pending" && <FaClock />}
                        {order.status === "processing" && <FaClock />}
                        {order.status === "shipped" && <FaTruck />}
                        {order.status === "delivered" && <FaCheckCircle />}
                        {order.status === "cancelled" && <FaTimesCircle />}
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Card Body (Products Grid) */}
                  <div className="od-card-body">
                    <div className="od-items-list">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="od-item-row">
                          <div className="od-item-visual" style={{ background: item.gradient || "var(--od-surface2)" }}>
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="od-item-img" />
                            ) : (
                              <span className="od-item-emoji">{item.emoji || "📦"}</span>
                            )}
                          </div>
                          <div className="od-item-details">
                            <h4 className="od-item-name">{item.name}</h4>
                            <span className="od-item-qty-price">
                              Qty: {item.qty} · ${item.price.toLocaleString()} each
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Financial Summary & Shipping info */}
                    <div className="od-summary-section">
                      <div className="od-shipping-details">
                        <h5>Shipping Address</h5>
                        <p className="od-recipient">{order.shipping.fullName}</p>
                        <p>{order.shipping.address}</p>
                        <p>{order.shipping.city}, {order.shipping.country}</p>
                      </div>

                      <div className="od-financials">
                        <div className="od-fin-row">
                          <span>Subtotal</span>
                          <span>${order.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="od-fin-row">
                          <span>Shipping</span>
                          <span>{order.shippingCost === 0 ? "FREE" : `$${order.shippingCost}`}</span>
                        </div>
                        <div className="od-fin-row">
                          <span>Tax (8%)</span>
                          <span>${order.tax.toLocaleString()}</span>
                        </div>
                        <div className="od-divider" />
                        <div className="od-fin-row od-fin-row--total">
                          <span>Total Paid</span>
                          <span>${order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
