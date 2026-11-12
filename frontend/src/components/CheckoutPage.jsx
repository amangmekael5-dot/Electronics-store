import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaCreditCard, FaPaypal, FaLock, FaCheckCircle,
  FaChevronRight, FaArrowLeft, FaShieldAlt, FaTruck, FaBoxOpen,
  FaQrcode, FaUniversity, FaMobileAlt, FaCopy, FaCheck, FaInfoCircle
} from "react-icons/fa";
import { SiVisa, SiMastercard } from "react-icons/si";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./CheckoutPage.css";

// ── Formatter Helpers ──────────────────────────────────────────────────────────
const formatCard   = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
const formatExpiry = (v) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? `${d.slice(0,2)}/${d.slice(2)}` : d; };
const formatCVV    = (v) => v.replace(/\D/g, "").slice(0, 4);
const cardBrand    = (n) => { const d = n.replace(/\s/g, ""); if (/^4/.test(d)) return "visa"; if (/^5[1-5]/.test(d)) return "mastercard"; return "card"; };

const STEPS = ["Shipping", "Payment", "Confirm"];

// ── Interactive QR Code Component ──────────────────────────────────────────────
function QRCodeDisplay({ value, bankName, accountNumber }) {
  const [copied, setCopied] = useState(false);

  const copyAccount = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ck-qr-box">
      <div className="ck-qr-frame">
        <div className="ck-qr-laser-line" />
        <svg viewBox="0 0 200 200" className="ck-qr-svg">
          <rect width="200" height="200" fill="#ffffff" rx="16" />
          {/* Position detection patterns (corners) */}
          <rect x="20" y="20" width="45" height="45" fill="#09090f" rx="6" />
          <rect x="28" y="28" width="29" height="29" fill="#ffffff" rx="3" />
          <rect x="34" y="34" width="17" height="17" fill="#7c3aed" rx="2" />

          <rect x="135" y="20" width="45" height="45" fill="#09090f" rx="6" />
          <rect x="143" y="28" width="29" height="29" fill="#ffffff" rx="3" />
          <rect x="149" y="34" width="17" height="17" fill="#7c3aed" rx="2" />

          <rect x="20" y="135" width="45" height="45" fill="#09090f" rx="6" />
          <rect x="28" y="143" width="29" height="29" fill="#ffffff" rx="3" />
          <rect x="34" y="149" width="17" height="17" fill="#7c3aed" rx="2" />

          {/* Simulated QR Code Matrix Data Dots */}
          <g fill="#1a1a2e">
            <rect x="80" y="25" width="10" height="10" />
            <rect x="95" y="25" width="10" height="10" />
            <rect x="110" y="25" width="10" height="10" />
            
            <rect x="80" y="40" width="10" height="10" fill="#a855f7" />
            <rect x="110" y="40" width="10" height="10" />

            <rect x="25" y="80" width="10" height="10" />
            <rect x="40" y="80" width="10" height="10" />
            <rect x="55" y="80" width="10" height="10" fill="#7c3aed" />
            <rect x="80" y="80" width="10" height="10" />
            <rect x="95" y="80" width="10" height="10" />
            <rect x="110" y="80" width="10" height="10" fill="#a855f7" />
            <rect x="135" y="80" width="10" height="10" />
            <rect x="150" y="80" width="10" height="10" />
            <rect x="165" y="80" width="10" height="10" />

            <rect x="25" y="95" width="10" height="10" fill="#7c3aed" />
            <rect x="55" y="95" width="10" height="10" />
            <rect x="80" y="95" width="25" height="25" fill="#7c3aed" rx="4" />
            <rect x="120" y="95" width="10" height="10" />
            <rect x="150" y="95" width="10" height="10" fill="#a855f7" />

            <rect x="25" y="110" width="10" height="10" />
            <rect x="40" y="110" width="10" height="10" fill="#a855f7" />
            <rect x="120" y="110" width="10" height="10" />
            <rect x="165" y="110" width="10" height="10" />

            <rect x="80" y="135" width="10" height="10" />
            <rect x="95" y="135" width="10" height="10" fill="#7c3aed" />
            <rect x="110" y="135" width="10" height="10" />
            <rect x="135" y="135" width="10" height="10" />
            <rect x="165" y="135" width="10" height="10" />

            <rect x="80" y="150" width="10" height="10" fill="#a855f7" />
            <rect x="110" y="150" width="10" height="10" />
            <rect x="150" y="150" width="10" height="10" />

            <rect x="80" y="165" width="10" height="10" />
            <rect x="95" y="165" width="10" height="10" />
            <rect x="135" y="165" width="10" height="10" fill="#7c3aed" />
            <rect x="150" y="165" width="10" height="10" />
            <rect x="165" y="165" width="10" height="10" />
          </g>
        </svg>
      </div>

      <div className="ck-qr-details">
        <span className="ck-qr-bank-tag">{bankName}</span>
        <div className="ck-qr-acc-row">
          <span className="ck-qr-acc-num">{accountNumber}</span>
          <button className="ck-copy-btn" onClick={copyAccount} title="Copy Account Number">
            {copied ? <FaCheck color="#10b981" /> : <FaCopy />}
          </button>
        </div>
        <p className="ck-qr-hint">Scan with your mobile banking or mobile money app</p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, token }                 = useAuth();
  const navigate                        = useNavigate();

  const [step, setStep]       = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [orderId, setOrderId] = useState(null);

  // ── Shipping Form ──
  const [shipping, setShipping] = useState({
    fullName: user?.name || "", email: user?.email || "",
    phone: "", address: "", city: "Addis Ababa", country: "Ethiopia", zip: "1000",
  });

  // ── Payment Selection & Details ──
  const [payMethod, setPayMethod] = useState("telebirr"); // Default to Telebirr
  const [txnRef, setTxnRef]       = useState("");
  const [payerPhone, setPayerPhone] = useState("");
  const [card, setCard]           = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [paypalEmail, setPaypalEmail] = useState("");

  // ── Financials ──
  const shipping_cost = totalPrice > 500 ? 0 : 25;
  const tax           = Math.round(totalPrice * 0.08);
  const total         = totalPrice + shipping_cost + tax;

  if (!user) {
    return (
      <div className="ck-page ck-gate-page">
        <div className="ck-gate">
          <div className="ck-gate-icon-circle">
            <FaLock size={36} />
          </div>
          <h2>Login Required</h2>
          <p>Please sign in to proceed to checkout.</p>
          <Link to="/login" className="ck-btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !orderId) {
    return (
      <div className="ck-page ck-gate-page">
        <div className="ck-gate">
          <div className="ck-gate-icon-circle">
            <FaBoxOpen size={36} />
          </div>
          <h2>Your cart is empty</h2>
          <p>Explore our catalog and add items to your cart before checking out.</p>
          <Link to="/products" className="ck-btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ── Validation ──────────────────────────────────────────────────────────────
  const validateShipping = () => {
    if (!shipping.fullName.trim()) return "Full name is required.";
    if (!shipping.email.trim()) return "Email is required.";
    if (!shipping.address.trim()) return "Address is required.";
    if (!shipping.city.trim()) return "City is required.";
    if (!shipping.country.trim()) return "Country is required.";
    return null;
  };

  const validatePayment = () => {
    if (["cbe", "telebirr", "boa", "awash", "qrcode"].includes(payMethod)) {
      if (!txnRef.trim()) return "Please enter the Payment Receipt / Transaction Reference ID.";
    } else if (payMethod === "card") {
      const num = card.number.replace(/\s/g, "");
      if (num.length < 16) return "Enter a valid 16-digit card number.";
      if (!card.name.trim()) return "Cardholder name is required.";
      if (card.expiry.length < 5) return "Enter a valid expiry (MM/YY).";
      if (card.cvv.length < 3) return "Enter a valid CVV.";
    } else if (payMethod === "paypal" && !paypalEmail.trim()) {
      return "PayPal email is required.";
    }
    return null;
  };

  const next = () => {
    setError("");
    if (step === 0) { const e = validateShipping(); if (e) { setError(e); return; } }
    if (step === 1) { const e = validatePayment();  if (e) { setError(e); return; } }
    setStep((s) => s + 1);
  };

  // ── Place Order ─────────────────────────────────────────────────────────────
  const placeOrder = async () => {
    setLoading(true); setError("");
    try {
      const payload = {
        items: cart.map((i) => {
          const rawId = i._id || i.product || i.id;
          const isValidOid = typeof rawId === "string" && /^[0-9a-fA-F]{24}$/.test(rawId);
          return {
            product: isValidOid ? rawId : null,
            name: i.name,
            emoji: i.emoji,
            category: i.category,
            price: i.price,
            qty: i.qty,
            gradient: i.gradient,
            image: i.image,
          };
        }),
        shipping,
        payment: {
          method: payMethod,
          txnRef: txnRef || null,
          payerPhone: payerPhone || null,
          cardLast4: payMethod === "card" ? card.number.replace(/\s/g,"").slice(-4) : null,
          cardBrand: payMethod === "card" ? cardBrand(card.number) : null,
        },
        subtotal: totalPrice, shippingCost: shipping_cost, tax, total,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setOrderId(json.data._id);
      clearCart();
      setStep(3); // Success screen
    } catch (err) {
      setError(err.message || "Payment verification failed. Please check details and try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (step === 3) {
    return (
      <div className="ck-page ck-gate-page">
        <div className="ck-success">
          <div className="ck-success-icon"><FaCheckCircle /></div>
          <h1>Order Confirmed! 🎉</h1>
          <p>Thank you <strong>{shipping.fullName}</strong>! Your order has been placed successfully.</p>
          <div className="ck-success-id">Order ID: <span>#{orderId?.slice(-8).toUpperCase()}</span></div>
          <p className="ck-success-sub">A confirmation has been sent to <strong>{shipping.email}</strong>. Our logistics team will verify your transfer and ship your items.</p>
          <div className="ck-success-actions">
            <Link to="/orders" className="ck-btn-primary">View My Orders</Link>
            <Link to="/products" className="ck-btn-ghost">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  const PAYMENT_METHODS = [
    { id: "telebirr", label: "Telebirr", icon: <FaMobileAlt color="#0080ff" />, badge: "Popular" },
    { id: "cbe",      label: "CBE / CBE Birr", icon: <FaUniversity color="#8b5cf6" />, badge: "Commercial Bank" },
    { id: "boa",      label: "Bank of Abyssinia", icon: <FaUniversity color="#f59e0b" />, badge: "BoA Mobile" },
    { id: "awash",    label: "Awash Bank", icon: <FaUniversity color="#10b981" />, badge: "AwashBirr" },
    { id: "qrcode",   label: "Scan QR Code", icon: <FaQrcode color="#a855f7" />, badge: "Instant Scan" },
    { id: "card",     label: "Credit / Debit Card", icon: <FaCreditCard color="#ec4899" />, badge: "Global" },
    { id: "paypal",   label: "PayPal", icon: <FaPaypal color="#3b82f6" />, badge: "International" },
  ];

  return (
    <div className="ck-page">
      <div className="ck-container">

        {/* ── Header ── */}
        <div className="ck-header">
          <Link to="/cart" className="ck-back-link"><FaArrowLeft /> Back to Cart</Link>
          <h1 className="ck-title">Checkout</h1>
          <div className="ck-steps">
            {STEPS.map((s, i) => (
              <div key={s} className={`ck-step ${i === step ? "ck-step--active" : i < step ? "ck-step--done" : ""}`}>
                <div className="ck-step-dot">{i < step ? <FaCheckCircle /> : i + 1}</div>
                <span>{s}</span>
                {i < STEPS.length - 1 && <div className="ck-step-line" />}
              </div>
            ))}
          </div>
        </div>

        <div className="ck-layout">

          {/* ── Left: Form Area ── */}
          <div className="ck-form-area">
            {error && <div className="ck-error">{error}</div>}

            {/* STEP 0: Shipping */}
            {step === 0 && (
              <div className="ck-card">
                <div className="ck-card-header"><FaTruck /> Shipping Information</div>
                <div className="ck-grid">
                  <label className="ck-field ck-field--full">
                    <span>Full Name *</span>
                    <input className="ck-input" placeholder="Abebe Bikila" value={shipping.fullName} onChange={(e) => setShipping({...shipping, fullName: e.target.value})} />
                  </label>
                  <label className="ck-field ck-field--full">
                    <span>Email Address *</span>
                    <input className="ck-input" type="email" placeholder="abebe@example.com" value={shipping.email} onChange={(e) => setShipping({...shipping, email: e.target.value})} />
                  </label>
                  <label className="ck-field">
                    <span>Phone Number *</span>
                    <input className="ck-input" placeholder="+251 911 00 00 00" value={shipping.phone} onChange={(e) => setShipping({...shipping, phone: e.target.value})} />
                  </label>
                  <label className="ck-field">
                    <span>Postal / Zip Code</span>
                    <input className="ck-input" placeholder="1000" value={shipping.zip} onChange={(e) => setShipping({...shipping, zip: e.target.value})} />
                  </label>
                  <label className="ck-field ck-field--full">
                    <span>Delivery Address *</span>
                    <input className="ck-input" placeholder="Bole Sub-city, Woreda 03, House #123" value={shipping.address} onChange={(e) => setShipping({...shipping, address: e.target.value})} />
                  </label>
                  <label className="ck-field">
                    <span>City *</span>
                    <input className="ck-input" placeholder="Addis Ababa" value={shipping.city} onChange={(e) => setShipping({...shipping, city: e.target.value})} />
                  </label>
                  <label className="ck-field">
                    <span>Country *</span>
                    <input className="ck-input" placeholder="Ethiopia" value={shipping.country} onChange={(e) => setShipping({...shipping, country: e.target.value})} />
                  </label>
                </div>
              </div>
            )}

            {/* STEP 1: Payment */}
            {step === 1 && (
              <div className="ck-card">
                <div className="ck-card-header"><FaLock /> Select Payment Method</div>

                {/* Method selector grid */}
                <div className="ck-pay-methods-grid">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      className={`ck-pay-method-card ${payMethod === m.id ? "ck-pay-method-card--active" : ""}`}
                      onClick={() => setPayMethod(m.id)}
                    >
                      <div className="ck-pay-method-icon">{m.icon}</div>
                      <div className="ck-pay-method-text">
                        <span className="ck-pay-method-label">{m.label}</span>
                        <span className="ck-pay-method-badge">{m.badge}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* ── CBE Form ── */}
                {payMethod === "cbe" && (
                  <div className="ck-bank-box">
                    <div className="ck-bank-header cbe">
                      <FaUniversity size={24} />
                      <div>
                        <h4>Commercial Bank of Ethiopia (CBE)</h4>
                        <p>Transfer directly or via CBE Birr App</p>
                      </div>
                    </div>

                    <QRCodeDisplay 
                      bankName="COMMERCIAL BANK OF ETHIOPIA"
                      accountNumber="1000123456789"
                      value={`cbe:1000123456789?amount=${total}`}
                    />

                    <div className="ck-bank-info-grid">
                      <div className="ck-info-item"><span>Account Name:</span> <strong>ElecStore PLC</strong></div>
                      <div className="ck-info-item"><span>Account Number:</span> <strong>1000123456789</strong></div>
                      <div className="ck-info-item"><span>CBE Birr Short Code:</span> <strong>123456</strong></div>
                    </div>

                    <div className="ck-grid">
                      <label className="ck-field ck-field--full">
                        <span>Transaction / Receipt Ref ID *</span>
                        <input className="ck-input ck-input--mono" placeholder="e.g. FT26198XXXXX or CBE Receipt No." value={txnRef} onChange={(e) => setTxnRef(e.target.value)} />
                      </label>
                      <label className="ck-field ck-field--full">
                        <span>Payer Phone / Account Name</span>
                        <input className="ck-input" placeholder="+251 9XX XXX XXX" value={payerPhone} onChange={(e) => setPayerPhone(e.target.value)} />
                      </label>
                    </div>
                  </div>
                )}

                {/* ── Telebirr Form ── */}
                {payMethod === "telebirr" && (
                  <div className="ck-bank-box">
                    <div className="ck-bank-header telebirr">
                      <FaMobileAlt size={24} />
                      <div>
                        <h4>Telebirr Mobile Payment</h4>
                        <p>Pay via Telebirr Super App or USSD code *127#</p>
                      </div>
                    </div>

                    <QRCodeDisplay 
                      bankName="TELEBIRR MOBILE MONEY"
                      accountNumber="778899 (Shortcode)"
                      value={`telebirr:778899?amount=${total}`}
                    />

                    <div className="ck-bank-info-grid">
                      <div className="ck-info-item"><span>Merchant Name:</span> <strong>ElecStore Ethiopia</strong></div>
                      <div className="ck-info-item"><span>Telebirr Shortcode:</span> <strong>778899</strong></div>
                      <div className="ck-info-item"><span>Merchant Phone:</span> <strong>+251 911 223 344</strong></div>
                    </div>

                    <div className="ck-grid">
                      <label className="ck-field ck-field--full">
                        <span>Telebirr Transaction Reference ID *</span>
                        <input className="ck-input ck-input--mono" placeholder="e.g. 1029384756" value={txnRef} onChange={(e) => setTxnRef(e.target.value)} />
                      </label>
                      <label className="ck-field ck-field--full">
                        <span>Your Telebirr Phone Number</span>
                        <input className="ck-input" placeholder="+251 9XX XXX XXX" value={payerPhone} onChange={(e) => setPayerPhone(e.target.value)} />
                      </label>
                    </div>
                  </div>
                )}

                {/* ── Bank of Abyssinia Form ── */}
                {payMethod === "boa" && (
                  <div className="ck-bank-box">
                    <div className="ck-bank-header boa">
                      <FaUniversity size={24} />
                      <div>
                        <h4>Bank of Abyssinia (BoA)</h4>
                        <p>Pay using BoA Mobile App / Apollo or Branch Transfer</p>
                      </div>
                    </div>

                    <QRCodeDisplay 
                      bankName="BANK OF ABYSSINIA"
                      accountNumber="88992211"
                      value={`boa:88992211?amount=${total}`}
                    />

                    <div className="ck-bank-info-grid">
                      <div className="ck-info-item"><span>Account Name:</span> <strong>ElecStore Abyssinia</strong></div>
                      <div className="ck-info-item"><span>Account Number:</span> <strong>88992211</strong></div>
                    </div>

                    <div className="ck-grid">
                      <label className="ck-field ck-field--full">
                        <span>BoA Transaction Reference / Ref No. *</span>
                        <input className="ck-input ck-input--mono" placeholder="e.g. BOA-TXN-98765" value={txnRef} onChange={(e) => setTxnRef(e.target.value)} />
                      </label>
                    </div>
                  </div>
                )}

                {/* ── Awash Bank Form ── */}
                {payMethod === "awash" && (
                  <div className="ck-bank-box">
                    <div className="ck-bank-header awash">
                      <FaUniversity size={24} />
                      <div>
                        <h4>Awash Bank (AwashBirr)</h4>
                        <p>Transfer via Awash Mobile Banking or AwashBirr</p>
                      </div>
                    </div>

                    <QRCodeDisplay 
                      bankName="AWASH BANK"
                      accountNumber="01320987654321"
                      value={`awash:01320987654321?amount=${total}`}
                    />

                    <div className="ck-bank-info-grid">
                      <div className="ck-info-item"><span>Account Name:</span> <strong>ElecStore PLC</strong></div>
                      <div className="ck-info-item"><span>Account Number:</span> <strong>01320987654321</strong></div>
                    </div>

                    <div className="ck-grid">
                      <label className="ck-field ck-field--full">
                        <span>Awash Reference Number *</span>
                        <input className="ck-input ck-input--mono" placeholder="e.g. AWB-88776655" value={txnRef} onChange={(e) => setTxnRef(e.target.value)} />
                      </label>
                    </div>
                  </div>
                )}

                {/* ── Universal QR Code Scanner Form ── */}
                {payMethod === "qrcode" && (
                  <div className="ck-bank-box">
                    <div className="ck-bank-header qrcode">
                      <FaQrcode size={24} />
                      <div>
                        <h4>Universal Ethiopian QR Code Payment</h4>
                        <p>Scan with CBE Birr, Telebirr, BoA, Awash, or any EthSwitch Banking App</p>
                      </div>
                    </div>

                    <QRCodeDisplay 
                      bankName="UNIVERSAL ETHIOPIAN QR SCANNER"
                      accountNumber="ElecStore Merchant QR"
                      value={`ethioqr:elecstore?total=${total}`}
                    />

                    <div className="ck-grid">
                      <label className="ck-field ck-field--full">
                        <span>Payment Reference / Receipt Number *</span>
                        <input className="ck-input ck-input--mono" placeholder="Enter receipt number from your banking app" value={txnRef} onChange={(e) => setTxnRef(e.target.value)} />
                      </label>
                    </div>
                  </div>
                )}

                {/* ── Card Form ── */}
                {payMethod === "card" && (
                  <div className="ck-card-form">
                    <div className="ck-card-preview">
                      <div className="ck-card-chip" />
                      <div className="ck-card-num">{card.number || "•••• •••• •••• ••••"}</div>
                      <div className="ck-card-bottom">
                        <div>
                          <div className="ck-card-label">Cardholder</div>
                          <div className="ck-card-val">{card.name || "YOUR NAME"}</div>
                        </div>
                        <div>
                          <div className="ck-card-label">Expires</div>
                          <div className="ck-card-val">{card.expiry || "MM/YY"}</div>
                        </div>
                        <div className="ck-card-brand-icon">
                          {cardBrand(card.number) === "visa"       && <SiVisa size={36} />}
                          {cardBrand(card.number) === "mastercard" && <SiMastercard size={36} />}
                          {cardBrand(card.number) === "card"       && <FaCreditCard size={24} />}
                        </div>
                      </div>
                    </div>

                    <div className="ck-grid">
                      <label className="ck-field ck-field--full">
                        <span>Card Number</span>
                        <input className="ck-input ck-input--mono" placeholder="1234 5678 9012 3456" value={card.number}
                          onChange={(e) => setCard({...card, number: formatCard(e.target.value)})} maxLength={19} />
                      </label>
                      <label className="ck-field ck-field--full">
                        <span>Cardholder Name</span>
                        <input className="ck-input" placeholder="Name as on card" value={card.name}
                          onChange={(e) => setCard({...card, name: e.target.value.toUpperCase()})} />
                      </label>
                      <label className="ck-field">
                        <span>Expiry Date</span>
                        <input className="ck-input ck-input--mono" placeholder="MM/YY" value={card.expiry}
                          onChange={(e) => setCard({...card, expiry: formatExpiry(e.target.value)})} maxLength={5} />
                      </label>
                      <label className="ck-field">
                        <span>CVV <FaLock style={{fontSize:"10px", opacity: 0.5}} /></span>
                        <input className="ck-input ck-input--mono" placeholder="•••" type="password" value={card.cvv}
                          onChange={(e) => setCard({...card, cvv: formatCVV(e.target.value)})} maxLength={4} />
                      </label>
                    </div>
                  </div>
                )}

                {/* ── PayPal Form ── */}
                {payMethod === "paypal" && (
                  <div className="ck-alt-pay">
                    <div className="ck-alt-pay-icon paypal"><FaPaypal /> PayPal</div>
                    <label className="ck-field ck-field--full">
                      <span>PayPal Email</span>
                      <input className="ck-input" type="email" placeholder="your@paypal.com" value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)} />
                    </label>
                  </div>
                )}

                <div className="ck-secure-note">
                  <FaShieldAlt /> 256-bit Encrypted. All transactions are securely logged and verified.
                </div>
              </div>
            )}

            {/* STEP 2: Confirm */}
            {step === 2 && (
              <div className="ck-card">
                <div className="ck-card-header"><FaCheckCircle /> Review & Confirm Order</div>

                <div className="ck-review-section">
                  <h4>Shipping Address</h4>
                  <p><strong>{shipping.fullName}</strong></p>
                  <p>{shipping.address}, {shipping.city}, {shipping.country}</p>
                  <p>{shipping.email} {shipping.phone && `· ${shipping.phone}`}</p>
                </div>

                <div className="ck-review-section">
                  <h4>Payment Method Selected</h4>
                  <p style={{ textTransform: "uppercase", fontWeight: 700, color: "var(--ck-accent2)" }}>
                    {payMethod === "telebirr" && `Telebirr (Ref: ${txnRef})`}
                    {payMethod === "cbe"      && `Commercial Bank of Ethiopia (Ref: ${txnRef})`}
                    {payMethod === "boa"      && `Bank of Abyssinia (Ref: ${txnRef})`}
                    {payMethod === "awash"    && `Awash Bank (Ref: ${txnRef})`}
                    {payMethod === "qrcode"   && `QR Code Scanner (Ref: ${txnRef})`}
                    {payMethod === "card"     && `Credit Card ending in ···· ${card.number.replace(/\s/g,"").slice(-4)}`}
                    {payMethod === "paypal"   && `PayPal (${paypalEmail})`}
                  </p>
                </div>

                <div className="ck-review-section">
                  <h4>Items ({cart.length})</h4>
                  {cart.map((item) => (
                    <div key={item._id || item.id} className="ck-review-item">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="ck-review-img" style={{ width: "28px", height: "28px", objectFit: "cover", borderRadius: "6px", marginRight: "10px" }} />
                      ) : (
                        <span className="ck-review-emoji">{item.emoji || "📦"}</span>
                      )}
                      <span className="ck-review-name">{item.name} × {item.qty}</span>
                      <span className="ck-review-price">${(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Navigation Buttons ── */}
            <div className="ck-nav-btns">
              {step > 0 && (
                <button className="ck-btn-ghost" onClick={() => { setError(""); setStep((s) => s - 1); }}>
                  <FaArrowLeft /> Back
                </button>
              )}
              {step < 2 && (
                <button className="ck-btn-primary" onClick={next}>
                  Continue <FaChevronRight />
                </button>
              )}
              {step === 2 && (
                <button
                  className={`ck-btn-primary ck-btn-pay ${loading ? "ck-btn-pay--loading" : ""}`}
                  onClick={placeOrder}
                  disabled={loading}
                >
                  {loading ? <span className="ck-spinner" /> : <><FaLock /> Place Order (${total.toLocaleString()})</>}
                </button>
              )}
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="ck-summary">
            <h2 className="ck-summary-title">Order Summary</h2>
            <div className="ck-summary-items">
              {cart.map((item) => (
                <div key={item._id || item.id} className="ck-summary-item">
                  <div className="ck-summary-visual" style={{ background: item.gradient || "#1a1a2e" }}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="ck-summary-img" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />
                    ) : (
                      <span>{item.emoji || "📦"}</span>
                    )}
                  </div>
                  <div className="ck-summary-meta">
                    <span className="ck-summary-name">{item.name}</span>
                    <span className="ck-summary-qty">Qty: {item.qty}</span>
                  </div>
                  <span className="ck-summary-price">${(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="ck-summary-rows">
              <div className="ck-summary-row"><span>Subtotal</span><span>${totalPrice.toLocaleString()}</span></div>
              <div className="ck-summary-row"><span>Shipping</span><span>{shipping_cost === 0 ? "FREE" : `$${shipping_cost}`}</span></div>
              <div className="ck-summary-row"><span>Tax (8%)</span><span>${tax.toLocaleString()}</span></div>
              <div className="ck-summary-divider" />
              <div className="ck-summary-row ck-summary-row--total"><span>Total</span><span>${total.toLocaleString()}</span></div>
            </div>
            <div className="ck-summary-trust">
              <div><FaShieldAlt /> Secure Ethiopian & Global Payments</div>
              <div><FaTruck /> Express Delivery</div>
              <div><FaBoxOpen /> Genuine Warranty</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
