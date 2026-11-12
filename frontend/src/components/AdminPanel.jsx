import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdDashboard, MdInventory, MdReceipt, MdBarChart, MdStar,
  MdPeople, MdCreditCard, MdSettings, MdSearch, MdNotifications,
  MdChat, MdCalendarToday, MdRefresh, MdArrowDropDown, MdArrowRight,
  MdChevronLeft, MdChevronRight, MdInfoOutline, MdMoreVert,
  MdAttachMoney, MdTrendingUp, MdTrendingDown, MdAdd, MdEdit,
  MdDelete, MdCheckCircle, MdCancel, MdVisibility, MdPrint,
  MdStorefront, MdClose
} from "react-icons/md";
import { FaSun, FaMoon } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "./AdminPanel.css";

// ── API Helper ───────────────────────────────────────────────────────────────
const API = async (path, token, options = {}) => {
  try {
    const res = await fetch(`/api/admin${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message || "Network request failed" };
  }
};

// ── Exact SVG Curved Spline Wave Chart for "Sales Volume" ────────────────────
function SalesVolumeChart() {
  return (
    <div className="sp-volume-chart-container">
      {/* Floating Gross Sales Tooltip */}
      <div className="sp-floating-tooltip">
        <div className="sp-tooltip-title">Gross sales</div>
        <div className="sp-tooltip-meta">
          <span>18 Sept. 2023</span>
          <span className="sp-tooltip-badge">▲ +14.56%</span>
        </div>
        <div className="sp-tooltip-val">$9,2k</div>
      </div>

      <svg className="sp-chart-svg" viewBox="0 0 520 180" preserveAspectRatio="none">
        <defs>
          <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="cyanArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#00f2fe" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y Axis Grid lines */}
        <line x1="45" y1="20" x2="510" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
        <line x1="45" y1="55" x2="510" y2="55" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
        <line x1="45" y1="95" x2="510" y2="95" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
        <line x1="45" y1="135" x2="510" y2="135" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

        {/* Y-axis Text Labels */}
        <text x="5" y="24" fill="#64748b" fontSize="10" fontWeight="600">$300k</text>
        <text x="5" y="59" fill="#64748b" fontSize="10" fontWeight="600">$100k</text>
        <text x="10" y="99" fill="#64748b" fontSize="10" fontWeight="600">$50k</text>
        <text x="10" y="139" fill="#64748b" fontSize="10" fontWeight="600">$10k</text>
        <text x="15" y="172" fill="#64748b" fontSize="10" fontWeight="600">$1k</text>

        {/* Wave 1: 2022 (White/Light Slate curved spline) */}
        <path
          d="M 50 160 C 100 155, 140 70, 200 90 C 260 110, 340 145, 420 120 C 460 108, 485 118, 510 125"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Wave 2: 2023 (Glowing Electric Cyan curved spline) */}
        <path
          d="M 50 172 C 105 168, 140 135, 190 120 C 250 102, 330 150, 420 85 C 460 55, 485 62, 510 58"
          fill="none"
          stroke="#00f2fe"
          strokeWidth="3.8"
          strokeLinecap="round"
          filter="url(#cyanGlow)"
        />

        {/* Area fill beneath 2023 line */}
        <path
          d="M 50 172 C 105 168, 140 135, 190 120 C 250 102, 330 150, 420 85 C 460 55, 485 62, 510 58 L 510 178 L 50 178 Z"
          fill="url(#cyanArea)"
        />

        {/* Marker Dot on the wave */}
        <circle cx="190" cy="120" r="5" fill="#00f2fe" stroke="#080f22" strokeWidth="2.5" />
      </svg>

      {/* X Axis Labels */}
      <div className="sp-chart-x-axis">
        <span>Q1 (Jan-Mar)</span>
        <span>Q2 (Apr-Jun)</span>
        <span>Q3 (Jul-Sep)</span>
        <span>Q4 (Oct-Dec)</span>
      </div>
    </div>
  );
}

// ── Concentric Donut Gauge for "Profit Performance" ──────────────────────────
function ProfitPerformanceGauge() {
  return (
    <div className="sp-donut-container">
      <svg className="sp-donut-svg" viewBox="0 0 160 160">
        {/* Outer Ring Background */}
        <circle cx="80" cy="80" r="62" fill="none" stroke="#132247" strokeWidth="11" />
        {/* Outer Ring Foreground (Cyan - ~78%) */}
        <circle
          cx="80"
          cy="80"
          r="62"
          fill="none"
          stroke="#00f2fe"
          strokeWidth="11"
          strokeDasharray="389.5"
          strokeDashoffset="85"
          strokeLinecap="round"
          transform="rotate(-90 80 80)"
        />

        {/* Inner Ring Background */}
        <circle cx="80" cy="80" r="46" fill="none" stroke="#132247" strokeWidth="11" />
        {/* Inner Ring Foreground (Light Slate - ~65%) */}
        <circle
          cx="80"
          cy="80"
          r="46"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="11"
          strokeDasharray="289"
          strokeDashoffset="101"
          strokeLinecap="round"
          transform="rotate(-90 80 80)"
        />
      </svg>

      {/* Floating Callout Badges */}
      <div className="sp-donut-callout sp-donut-callout-1">78%</div>
      <div className="sp-donut-callout sp-donut-callout-2">65%</div>

      {/* Legend */}
      <div className="sp-donut-legend">
        <span><span className="sp-dot-2022" /> Profit 2022</span>
        <span><span className="sp-dot-2023" /> Profit 2023</span>
      </div>
    </div>
  );
}

// ── Semi-Circle Speedometer Gauge for "Conversion Rate" ──────────────────────
function ConversionSpeedometer() {
  return (
    <div className="sp-gauge-container">
      <svg className="sp-gauge-svg" viewBox="0 0 160 90">
        {/* Background Arc */}
        <path
          d="M 15 80 A 65 65 0 0 1 145 80"
          fill="none"
          stroke="#132247"
          strokeWidth="13"
          strokeLinecap="round"
        />
        {/* Foreground Arc (68% -> ~122.4 degrees) */}
        <path
          d="M 15 80 A 65 65 0 0 1 125 32"
          fill="none"
          stroke="#00f2fe"
          strokeWidth="13"
          strokeLinecap="round"
        />
      </svg>
      <div className="sp-gauge-center-val">68%</div>
      <div className="sp-gauge-labels">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

// ── View 1: Revenue by Period (Pixel-perfect matching user's image) ──────────
function RevenueByPeriodView({ onSeedDemo }) {
  const [activeTag, setActiveTag] = useState("Top Rated");

  const tags = ["Top Rated", "New In", "Best Sellers", "A-Z", "Reviews"];

  return (
    <div className="sp-content-body">
      {/* Title & Timestamp Row */}
      <div className="sp-title-row">
        <h1 className="sp-page-title">Revenue by Period</h1>
        <div className="sp-refresh-meta">
          <button className="sp-refresh-btn" onClick={onSeedDemo} title="Click to refresh or re-sync data">
            Data Refreshed <MdRefresh size={18} />
          </button>
          <div className="sp-time-pill">September 28, 2023 12:35 PM</div>
        </div>
      </div>

      {/* Sales Period Filter Row */}
      <div className="sp-period-row">
        <div className="sp-period-left">
          <span className="sp-period-label">Sales Period:</span>
          <div className="sp-date-picker-pill">
            <span>08/12/2023 - 08/24/2023</span>
            <MdCalendarToday />
          </div>
        </div>

        <div className="sp-pill-tags">
          {tags.map((t) => (
            <button
              key={t}
              className={`sp-tag-pill ${activeTag === t ? "active" : ""}`}
              onClick={() => setActiveTag(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* TOP GRID (3 Cards) */}
      <div className="sp-dash-grid-top">
        {/* Card 1: Sales Volume */}
        <div className="sp-card">
          <div className="sp-card-head">
            <h3 className="sp-card-title">Sales Volume</h3>
            <div className="sp-chart-legend">
              <span><span className="sp-legend-line sp-legend-2022" /> 2022</span>
              <span><span className="sp-legend-line sp-legend-2023" /> 2023</span>
            </div>
          </div>
          <SalesVolumeChart />
        </div>

        {/* Card 2: 2x2 Metric Cards Grid */}
        <div className="sp-metric-quad">
          {/* Card 2.1: Incom 2022 */}
          <div className="sp-quad-card">
            <div className="sp-quad-top">
              <div className="sp-quad-icon sp-icon--yellow">📄</div>
              <MdMoreVert className="sp-quad-menu" />
            </div>
            <div>
              <div className="sp-quad-meta">
                <span>Incom 2022</span>
                <span className="sp-trend-up">▲ +10%</span>
              </div>
              <div className="sp-quad-val">$96,1k</div>
            </div>
          </div>

          {/* Card 2.2: Profit 2022 */}
          <div className="sp-quad-card">
            <div className="sp-quad-top">
              <div className="sp-quad-icon sp-icon--coral">💎</div>
              <MdMoreVert className="sp-quad-menu" />
            </div>
            <div>
              <div className="sp-quad-meta">
                <span>Profit 2022</span>
                <span className="sp-trend-up">▲ 78%</span>
              </div>
              <div className="sp-quad-val">$2,1k</div>
            </div>
          </div>

          {/* Card 2.3: Incom 2023 */}
          <div className="sp-quad-card">
            <div className="sp-quad-top">
              <div className="sp-quad-icon sp-icon--blue">💵</div>
              <MdMoreVert className="sp-quad-menu" />
            </div>
            <div>
              <div className="sp-quad-meta">
                <span>Incom 2023</span>
                <span className="sp-trend-down">▼ -12%</span>
              </div>
              <div className="sp-quad-val">$396,1k</div>
            </div>
          </div>

          {/* Card 2.4: Profit 2023 */}
          <div className="sp-quad-card">
            <div className="sp-quad-top">
              <div className="sp-quad-icon sp-icon--teal">💎</div>
              <MdMoreVert className="sp-quad-menu" />
            </div>
            <div>
              <div className="sp-quad-meta">
                <span>Profit 2023</span>
                <span className="sp-trend-up">▲ 65%</span>
              </div>
              <div className="sp-quad-val">$80,1k</div>
            </div>
          </div>
        </div>

        {/* Card 3: Profit Performance */}
        <div className="sp-card">
          <div className="sp-card-head">
            <h3 className="sp-card-title">Profit Performance</h3>
            <MdInfoOutline className="sp-card-info-icon" />
          </div>
          <ProfitPerformanceGauge />
        </div>
      </div>

      {/* BOTTOM GRID (3 Cards) */}
      <div className="sp-dash-grid-bottom">
        {/* Card 4: Conversion Rate */}
        <div className="sp-card">
          <div className="sp-card-head">
            <h3 className="sp-card-title">Conversion Rate</h3>
            <MdInfoOutline className="sp-card-info-icon" />
          </div>

          <div className="sp-conversion-body">
            <div>
              <table className="sp-mini-table">
                <thead>
                  <tr>
                    <th>YEAR</th>
                    <th>CUSTOMERS</th>
                    <th>TREND</th>
                    <th>REVENUE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2022</td>
                    <td>3,234</td>
                    <td style={{ color: "#38bdf8" }}>10%</td>
                    <td>$124k</td>
                  </tr>
                  <tr>
                    <td>2023</td>
                    <td>12,345</td>
                    <td style={{ color: "#38bdf8" }}>35%</td>
                    <td>$32k</td>
                  </tr>
                </tbody>
              </table>

              <div className="sp-cust-stats-row">
                <div className="sp-cust-stat-col">
                  <h4>32,456</h4>
                  <span>Regular Customers</span>
                  <span className="sp-trend-up">▲ +14.56%</span>
                </div>
                <div className="sp-cust-stat-col">
                  <h4>+12,345</h4>
                  <span>New Customers</span>
                  <span className="sp-trend-up">▲ +23%</span>
                </div>
              </div>
            </div>

            <ConversionSpeedometer />
          </div>
        </div>

        {/* Card 5: Average Referral Rate (%) */}
        <div className="sp-card">
          <div className="sp-card-head">
            <h3 className="sp-card-title">Average Referral Rate (%)</h3>
          </div>

          <div className="sp-referral-list">
            <div className="sp-referral-item">
              <div className="sp-referral-head">
                <span>Referral Program Budget</span>
                <span className="sp-referral-val">27%</span>
              </div>
              <div className="sp-referral-track">
                <div className="sp-referral-bar" style={{ width: "27%" }} />
              </div>
            </div>

            <div className="sp-referral-item">
              <div className="sp-referral-head">
                <span>Refferal Rate by 100 Purchased</span>
                <span className="sp-referral-val">67%</span>
              </div>
              <div className="sp-referral-track">
                <div className="sp-referral-bar" style={{ width: "67%" }} />
              </div>
            </div>

            <div className="sp-referral-item">
              <div className="sp-referral-head">
                <span>Refferal Rate by Campaign</span>
                <span className="sp-referral-val">52%</span>
              </div>
              <div className="sp-referral-track">
                <div className="sp-referral-bar" style={{ width: "52%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 6: Financial Balances */}
        <div className="sp-balance-list">
          <div className="sp-balance-card">
            <div className="sp-balance-left">
              <span className="sp-balance-emoji">🪙</span>
              <span className="sp-balance-name">Total Balance</span>
            </div>
            <span className="sp-balance-amount">$176,2k</span>
          </div>

          <div className="sp-balance-card">
            <div className="sp-balance-left">
              <span className="sp-balance-emoji">💳</span>
              <span className="sp-balance-name">Total Expense</span>
            </div>
            <span className="sp-balance-amount">$32,1k</span>
          </div>

          <div className="sp-balance-card">
            <div className="sp-balance-left">
              <span className="sp-balance-emoji">💵</span>
              <span className="sp-balance-name">Total Profit</span>
            </div>
            <span className="sp-balance-amount">$144,1k</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="sp-footer">
        <div>Copyright © 2026 By <span className="sp-footer-brand">ShopPoint</span>. All Rights Reserved</div>
        <div>Powered by Ⓜ <strong style={{ color: "#38bdf8" }}>MerkatoLab</strong></div>
      </footer>
    </div>
  );
}

// ── View 2: Products Manager (Same sleek dark theme) ─────────────────────────
function ProductsView({ token }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = () => {
    API("/products", token).then((r) => {
      if (r.success) setProducts(r.data);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, [token]);

  const toggleStock = async (p) => {
    const updated = !p.inStock;
    const res = await API(`/products/${p._id}`, token, { method: "PUT", body: { inStock: updated } });
    if (res.success) {
      setProducts(products.map((item) => item._id === p._id ? { ...item, inStock: updated } : item));
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sp-content-body">
      <div className="sp-title-row">
        <h1 className="sp-page-title">Products Catalog ({products.length})</h1>
        <div className="sp-search-bar" style={{ width: "280px" }}>
          <MdSearch />
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="sp-table-card">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#8a99ad" }}>Loading inventory...</div>
        ) : (
          <div className="sp-table-wrap">
            <table className="sp-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Availability</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {p.image ? (
                          <img src={p.image} alt={p.name} style={{ width: "38px", height: "38px", borderRadius: "8px", objectFit: "cover" }} />
                        ) : (
                          <span style={{ fontSize: "24px" }}>{p.emoji || "📦"}</span>
                        )}
                        <div>
                          <strong>{p.name}</strong>
                          <div style={{ fontSize: "11px", color: "#8a99ad" }}>{p.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="sp-chip sp-chip-blue">{p.category}</span></td>
                    <td><strong>${p.price?.toLocaleString()}</strong></td>
                    <td>
                      <button
                        onClick={() => toggleStock(p)}
                        className={`sp-chip ${p.inStock ? "sp-chip-green" : "sp-chip-red"}`}
                        style={{ border: "none", cursor: "pointer" }}
                        title="Click to toggle availability"
                      >
                        {p.inStock ? "✓ In Stock" : "✕ Out of Stock"}
                      </button>
                    </td>
                    <td>⭐ {p.rating} ({p.reviews || 0})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── View 3: Orders Manager (Same sleek dark theme) ───────────────────────────
function OrdersView({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    API("/orders", token).then((r) => {
      if (r.success) setOrders(r.data);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, [token]);

  const updateStatus = async (id, status) => {
    const res = await API(`/orders/${id}/status`, token, { method: "PUT", body: { status } });
    if (res.success) {
      setOrders(orders.map((o) => (o._id === id ? { ...o, status } : o)));
    }
  };

  return (
    <div className="sp-content-body">
      <div className="sp-title-row">
        <h1 className="sp-page-title">Customer Orders ({orders.length})</h1>
      </div>

      <div className="sp-table-card">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#8a99ad" }}>Loading orders...</div>
        ) : (
          <div className="sp-table-wrap">
            <table className="sp-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td><strong style={{ fontFamily: "monospace", color: "#00f2fe" }}>#{o._id.slice(-6).toUpperCase()}</strong></td>
                    <td>
                      <div>
                        <strong>{o.shipping?.fullName || o.user?.name}</strong>
                        <div style={{ fontSize: "11px", color: "#8a99ad" }}>{o.shipping?.email || o.user?.email}</div>
                      </div>
                    </td>
                    <td>
                      {o.items?.map((item, idx) => (
                        <div key={idx} style={{ fontSize: "12px", color: "#cbd5e1" }}>
                          {item.name} ×{item.qty}
                        </div>
                      ))}
                    </td>
                    <td><strong>${o.total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></td>
                    <td>
                      <span className="sp-chip sp-chip-purple">
                        {o.payment?.cardBrand || o.payment?.method || "Card"}
                      </span>
                    </td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                        style={{
                          background: "#0c162e",
                          color: o.status === "delivered" ? "#05d554" : o.status === "cancelled" ? "#ef4444" : "#38bdf8",
                          border: "1px solid var(--sp-border)",
                          borderRadius: "8px",
                          padding: "6px 10px",
                          fontWeight: 700,
                          fontSize: "12px",
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ color: "#8a99ad", fontSize: "12px" }}>
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── View 4: Customers / Users View ───────────────────────────────────────────
function CustomersView({ token }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API("/users", token).then((r) => {
      if (r.success) setUsers(r.data);
      setLoading(false);
    });
  }, [token]);

  return (
    <div className="sp-content-body">
      <div className="sp-title-row">
        <h1 className="sp-page-title">Customers & Staff ({users.length})</h1>
      </div>

      <div className="sp-table-card">
        <div className="sp-table-wrap">
          <table className="sp-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td><strong>{u.name}</strong></td>
                  <td style={{ color: "#8a99ad" }}>{u.email}</td>
                  <td>
                    <span className={`sp-chip ${u.role === "admin" ? "sp-chip-purple" : "sp-chip-blue"}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ color: "#8a99ad" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── View 5: Settings / Demo Data Seeder ───────────────────────────────────────
function SettingsView({ token, onSeedDemo }) {
  return (
    <div className="sp-content-body">
      <div className="sp-title-row">
        <h1 className="sp-page-title">Settings & System Tools</h1>
      </div>

      <div className="sp-table-card">
        <h3 style={{ marginTop: 0, color: "#fff" }}>Demo Database Seeder</h3>
        <p style={{ color: "#8a99ad", fontSize: "13.5px", marginBottom: "20px" }}>
          Regenerate realistic orders across the past 30 days to populate all revenue, profit, and customer graphs.
        </p>
        <button className="sp-btn-primary" onClick={onSeedDemo}>
          ⚡ Generate 6 Realistic Demo Orders
        </button>
      </div>
    </div>
  );
}

// ── Main ShopPoint Admin Dashboard Component ─────────────────────────────────
export default function AdminPanel() {
  const { user, token, logout, login } = useAuth();
  const navigate = useNavigate();

  // Navigation State
  const [activeMenu, setActiveMenu] = useState("revenue"); // "revenue" | "sales" | "seller" | "products" | "orders" | "statistics" | "reviews" | "customers" | "transactions" | "settings"
  const [dashboardOpen, setDashboardOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const handleSeedDemo = async () => {
    if (!token) return;
    const res = await API("/seed-demo", token, { method: "POST" });
    if (res.success) {
      alert("✅ Demo sample orders regenerated successfully!");
    }
  };

  // If user is not logged in as Admin, show 1-click admin authentication
  if (!user || user.role !== "admin") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#070d1e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        <div style={{
          background: "#0f1a36",
          border: "1px solid rgba(45, 78, 130, 0.4)",
          borderRadius: "20px",
          padding: "36px",
          maxWidth: "440px",
          width: "100%",
          textAlign: "center",
          color: "#fff",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)"
        }}>
          <div style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #00f2fe 0%, #1e40af 100%)",
            margin: "0 auto 16px",
            boxShadow: "0 0 20px rgba(0,242,254,0.4)"
          }} />
          <h2 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 8px 0" }}>ShopPoint Admin Portal</h2>
          <p style={{ color: "#8a99ad", fontSize: "13px", margin: "0 0 24px 0", lineHeight: 1.5 }}>
            Restricted staff dashboard. Sign in to view sales analytics, revenue graphs, and orders.
          </p>
          <div style={{
            background: "#091228",
            padding: "12px",
            borderRadius: "10px",
            fontSize: "12px",
            color: "#cbd5e1",
            marginBottom: "20px",
            border: "1px dashed rgba(0, 242, 254, 0.3)"
          }}>
            Email: <code>admin@elecstore.com</code><br/>Password: <code>admin123</code>
          </div>
          <button
            onClick={() => login("admin@elecstore.com", "admin123")}
            className="sp-btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "13px" }}
          >
            ⚡ 1-Click Instant Sign In
          </button>
          <div style={{ marginTop: "16px" }}>
            <Link to="/" style={{ color: "#8a99ad", fontSize: "12px", textDecoration: "none" }}>
              ← Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sp-admin-root">
      {/* ── Left Sidebar ──────────────────────────────────────────────────── */}
      <aside className={`sp-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        {/* Header with Logo */}
        <div className="sp-sidebar-header">
          {!sidebarCollapsed ? (
            <Link to="/" className="sp-logo-box">
              <div className="sp-logo-orb" />
              <span className="sp-logo-text">ShopPoint</span>
            </Link>
          ) : (
            <div className="sp-logo-orb" style={{ margin: "0 auto" }} />
          )}

          <button
            className="sp-collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title="Toggle Sidebar"
          >
            {sidebarCollapsed ? <MdChevronRight size={18} /> : <MdChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="sp-nav">
          {/* Dashboard Accordion */}
          <div>
            <button
              className={`sp-nav-item ${["revenue", "sales", "seller"].includes(activeMenu) ? "active" : ""}`}
              onClick={() => {
                setDashboardOpen(!dashboardOpen);
                setActiveMenu("revenue");
              }}
            >
              <div className="sp-nav-left">
                <MdDashboard />
                {!sidebarCollapsed && <span>Dashboard</span>}
              </div>
              {!sidebarCollapsed && (dashboardOpen ? <MdArrowDropDown size={20} /> : <MdArrowRight size={20} />)}
            </button>

            {/* Submenu */}
            {!sidebarCollapsed && dashboardOpen && (
              <div className="sp-submenu">
                <button
                  className={`sp-sub-item ${activeMenu === "sales" ? "active" : ""}`}
                  onClick={() => setActiveMenu("sales")}
                >
                  • Sales Analytics
                </button>
                <button
                  className={`sp-sub-item ${activeMenu === "seller" ? "active" : ""}`}
                  onClick={() => setActiveMenu("seller")}
                >
                  • Seller Profiles
                </button>
                <button
                  className={`sp-sub-item ${activeMenu === "revenue" ? "active" : ""}`}
                  onClick={() => setActiveMenu("revenue")}
                >
                  • Revenue by Period
                </button>
              </div>
            )}
          </div>

          {/* Products */}
          <button
            className={`sp-nav-item ${activeMenu === "products" ? "active" : ""}`}
            onClick={() => setActiveMenu("products")}
          >
            <div className="sp-nav-left">
              <MdInventory />
              {!sidebarCollapsed && <span>Products</span>}
            </div>
            {!sidebarCollapsed && <MdArrowRight size={18} />}
          </button>

          {/* Orders */}
          <button
            className={`sp-nav-item ${activeMenu === "orders" ? "active" : ""}`}
            onClick={() => setActiveMenu("orders")}
          >
            <div className="sp-nav-left">
              <MdReceipt />
              {!sidebarCollapsed && <span>Orders</span>}
            </div>
          </button>

          {/* Statistics */}
          <button
            className={`sp-nav-item ${activeMenu === "statistics" ? "active" : ""}`}
            onClick={() => setActiveMenu("statistics")}
          >
            <div className="sp-nav-left">
              <MdBarChart />
              {!sidebarCollapsed && <span>Statistics</span>}
            </div>
          </button>

          {/* Reviews */}
          <button
            className={`sp-nav-item ${activeMenu === "reviews" ? "active" : ""}`}
            onClick={() => setActiveMenu("reviews")}
          >
            <div className="sp-nav-left">
              <MdStar />
              {!sidebarCollapsed && <span>Reviews</span>}
            </div>
          </button>

          {/* Customers */}
          <button
            className={`sp-nav-item ${activeMenu === "customers" ? "active" : ""}`}
            onClick={() => setActiveMenu("customers")}
          >
            <div className="sp-nav-left">
              <MdPeople />
              {!sidebarCollapsed && <span>Customers</span>}
            </div>
          </button>

          {/* Transactions */}
          <button
            className={`sp-nav-item ${activeMenu === "transactions" ? "active" : ""}`}
            onClick={() => setActiveMenu("transactions")}
          >
            <div className="sp-nav-left">
              <MdCreditCard />
              {!sidebarCollapsed && <span>Transactions</span>}
            </div>
            {!sidebarCollapsed && <span className="sp-nav-badge">279</span>}
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="sp-sidebar-footer">
          <button
            className={`sp-nav-item ${activeMenu === "settings" ? "active" : ""}`}
            onClick={() => setActiveMenu("settings")}
          >
            <div className="sp-nav-left">
              <MdSettings />
              {!sidebarCollapsed && <span>Settings</span>}
            </div>
          </button>
        </div>
      </aside>

      {/* ── Main Area ─────────────────────────────────────────────────────── */}
      <main className="sp-main">
        {/* Top Navigation Bar */}
        <header className="sp-topbar">
          {/* Search */}
          <div className="sp-search-bar">
            <input
              type="text"
              placeholder="Search for..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
            <MdSearch />
          </div>

          {/* Actions */}
          <div className="sp-topbar-actions">
            {/* Theme Toggle */}
            <button className="sp-icon-pill-btn" title="Toggle Mode">
              <FaSun size={14} />
            </button>

            {/* US Flag Icon */}
            <div className="sp-country-badge" title="Region: United States">
              🇺🇸
            </div>

            {/* Notifications Bell */}
            <button className="sp-icon-pill-btn" title="Notifications">
              <MdNotifications size={16} />
              <span className="sp-bubble sp-bubble-red">2</span>
            </button>

            {/* Messages Chat */}
            <button className="sp-icon-pill-btn" title="Messages">
              <MdChat size={16} />
              <span className="sp-bubble sp-bubble-green">7</span>
            </button>

            {/* User Profile */}
            <div className="sp-user-pill" onClick={logout} title="Click to Sign Out">
              <div className="sp-user-avatar">
                {user.name ? user.name[0].toUpperCase() : "A"}
                <span className="sp-user-online-dot" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic View Body */}
        {(activeMenu === "revenue" || activeMenu === "sales" || activeMenu === "seller" || activeMenu === "statistics") && (
          <RevenueByPeriodView onSeedDemo={handleSeedDemo} />
        )}
        {activeMenu === "products" && <ProductsView token={token} />}
        {activeMenu === "orders" && <OrdersView token={token} />}
        {activeMenu === "customers" && <CustomersView token={token} />}
        {activeMenu === "transactions" && <OrdersView token={token} />}
        {activeMenu === "reviews" && <ProductsView token={token} />}
        {activeMenu === "settings" && <SettingsView token={token} onSeedDemo={handleSeedDemo} />}
      </main>
    </div>
  );
}
