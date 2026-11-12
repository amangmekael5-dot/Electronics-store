import { FaBolt, FaShieldAlt, FaTruck, FaHeadset, FaAward, FaUsers, FaStar, FaCheckCircle } from "react-icons/fa";
import { MdVerified, MdElectricBolt } from "react-icons/md";
import "./AboutPage.css";

const STATS = [
  { value: "12K+", label: "Happy Customers", icon: <FaUsers /> },
  { value: "500+", label: "Products Listed", icon: <FaStar /> },
  { value: "99%", label: "Satisfaction Rate", icon: <FaCheckCircle /> },
  { value: "5★",  label: "Average Rating",  icon: <FaAward /> },
];

const VALUES = [
  {
    icon: <FaShieldAlt />,
    title: "Authenticity Guaranteed",
    desc: "Every product is 100% genuine, sourced directly from authorized distributors and brand partners.",
    color: "#7c3aed",
  },
  {
    icon: <FaTruck />,
    title: "Fast & Reliable Delivery",
    desc: "Same-day dispatch for in-stock items. We partner with trusted couriers to get your gear fast.",
    color: "#3b82f6",
  },
  {
    icon: <FaHeadset />,
    title: "Expert Support 24/7",
    desc: "Our tech-savvy support team is always ready to help you pick the right product or resolve any issue.",
    color: "#10b981",
  },
  {
    icon: <FaBolt />,
    title: "Best Price Promise",
    desc: "We continuously monitor the market to offer you the most competitive prices on all electronics.",
    color: "#f59e0b",
  },
];

export default function AboutPage() {
  return (
    <div className="ab-page">

      {/* ── Hero ── */}
      <section className="ab-hero">
        <div className="ab-glow ab-glow--1" />
        <div className="ab-glow ab-glow--2" />
        <div className="ab-hero-inner">
          <span className="ab-tag"><MdElectricBolt /> Our Story</span>
          <h1 className="ab-title">We're Passionate About <span className="ab-gradient">Great Tech</span></h1>
          <p className="ab-subtitle">
            ElecStore was founded with one mission: make premium electronics accessible, affordable, and enjoyable for everyone.
            From our humble beginnings as a local shop, we've grown into a trusted online marketplace loved by thousands.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="ab-stats">
        {STATS.map((s, i) => (
          <div className="ab-stat" key={i}>
            <span className="ab-stat-icon">{s.icon}</span>
            <span className="ab-stat-value">{s.value}</span>
            <span className="ab-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── Mission ── */}
      <section className="ab-mission">
        <div className="ab-mission-text">
          <span className="ab-tag"><MdVerified /> Our Mission</span>
          <h2 className="ab-section-title">Bringing the World's Best Electronics to Your Doorstep</h2>
          <p className="ab-body">
            At ElecStore, we believe technology should empower everyone. Whether you're a student, a creative professional,
            a gamer, or someone upgrading their daily driver — we have the right device for you at the right price.
          </p>
          <p className="ab-body">
            We carefully curate every product in our catalog, partnering only with brands that meet our strict quality
            standards. Our team of tech enthusiasts personally tests and reviews products so you can shop with confidence.
          </p>
          <ul className="ab-perks">
            {["Official warranty on all products", "30-day hassle-free returns", "Secure & encrypted payments", "Free tech advice from our experts"].map((p, i) => (
              <li key={i}><FaCheckCircle className="ab-check" /> {p}</li>
            ))}
          </ul>
        </div>
        <div className="ab-mission-visual">
          <div className="ab-visual-card">
            <span className="ab-visual-emoji">🏪</span>
            <strong>ElecStore HQ</strong>
            <p>Addis Ababa, Ethiopia</p>
          </div>
          <div className="ab-visual-card ab-visual-card--sm">
            <span className="ab-visual-emoji">🌍</span>
            <strong>Serving Ethiopia</strong>
            <p>Nationwide delivery</p>
          </div>
          <div className="ab-visual-card ab-visual-card--sm">
            <span className="ab-visual-emoji">📦</span>
            <strong>Same-Day Dispatch</strong>
            <p>For in-stock items</p>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="ab-values">
        <div className="ab-values-header">
          <span className="ab-tag">Why Choose Us</span>
          <h2 className="ab-section-title">Built on Trust, Driven by Technology</h2>
        </div>
        <div className="ab-values-grid">
          {VALUES.map((v, i) => (
            <div className="ab-value-card" key={i} style={{ "--vc": v.color }}>
              <span className="ab-value-icon" style={{ color: v.color, background: `${v.color}1a` }}>
                {v.icon}
              </span>
              <h3 className="ab-value-title">{v.title}</h3>
              <p className="ab-value-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ab-cta">
        <div className="ab-cta-glow" />
        <h2 className="ab-cta-title">Ready to Upgrade Your Tech?</h2>
        <p className="ab-cta-sub">Browse our latest collection of premium electronics — more added every week.</p>
        <a href="/products" className="ab-cta-btn">
          <FaBolt /> Shop Now
        </a>
      </section>

    </div>
  );
}
