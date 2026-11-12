import { useState } from "react";
import {
  FaPhone, FaEnvelope, FaWhatsapp, FaInstagram,
  FaFacebook, FaTiktok, FaMapMarkerAlt, FaPaperPlane,
  FaCheckCircle, FaClock,
} from "react-icons/fa";
import { MdElectricBolt } from "react-icons/md";
import "./ContactPage.css";

// ─── Contact Info ──────────────────────────────────────────────────────────────
const CONTACT_INFO = [
  {
    icon: <FaPhone />,
    label: "Phone / Call Us",
    value: "0918 518 515",
    href: "tel:+251918518515",
    color: "#10b981",
    desc: "Available Mon–Sat, 8AM – 8PM",
  },
  {
    icon: <FaWhatsapp />,
    label: "WhatsApp",
    value: "0918 518 515",
    href: "https://wa.me/251918518515",
    color: "#25d366",
    desc: "Message us anytime",
  },
  {
    icon: <FaEnvelope />,
    label: "Email",
    value: "littlemezanu@mail.com",
    href: "mailto:littlemezanu@mail.com",
    color: "#a855f7",
    desc: "We reply within 24 hours",
  },
  {
    icon: <FaMapMarkerAlt />,
    label: "Location",
    value: "Addis Ababa, Ethiopia",
    href: "https://maps.google.com/?q=Addis+Ababa,Ethiopia",
    color: "#f59e0b",
    desc: "Visit our showroom",
  },
];

const SOCIALS = [
  {
    icon: <FaTiktok />,
    name: "TikTok",
    handle: "@elecstore",
    href: "https://tiktok.com/@elecstore",
    color: "#010101",
    bg: "linear-gradient(135deg, #010101 0%, #ff0050 50%, #00f2ea 100%)",
  },
  {
    icon: <FaInstagram />,
    name: "Instagram",
    handle: "@elecstore",
    href: "https://instagram.com/elecstore",
    color: "#e1306c",
    bg: "linear-gradient(135deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)",
  },
  {
    icon: <FaFacebook />,
    name: "Facebook",
    handle: "ElecStore",
    href: "https://facebook.com/elecstore",
    color: "#1877f2",
    bg: "linear-gradient(135deg, #0d47a1, #1877f2)",
  },
  {
    icon: <FaWhatsapp />,
    name: "WhatsApp",
    handle: "0918 518 515",
    href: "https://wa.me/251918518515",
    color: "#25d366",
    bg: "linear-gradient(135deg, #075e54, #25d366)",
  },
];

// ─── Contact Form ──────────────────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  if (sent) {
    return (
      <div className="cp-sent">
        <FaCheckCircle className="cp-sent-icon" />
        <h3>Message Sent! 🎉</h3>
        <p>Thanks for reaching out. We'll get back to you within 24 hours.</p>
        <button className="cp-reset-btn" onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form className="cp-form" onSubmit={handleSubmit} id="contact-form">
      <div className="cp-form-row">
        <div className="cp-field">
          <label className="cp-label" htmlFor="contact-name">Your Name</label>
          <input
            id="contact-name"
            className="cp-input"
            name="name"
            type="text"
            placeholder="e.g. Dawit Tesfaye"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="cp-field">
          <label className="cp-label" htmlFor="contact-email">Email Address</label>
          <input
            id="contact-email"
            className="cp-input"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="cp-field">
        <label className="cp-label" htmlFor="contact-subject">Subject</label>
        <input
          id="contact-subject"
          className="cp-input"
          name="subject"
          type="text"
          placeholder="e.g. Product inquiry, order issue..."
          value={form.subject}
          onChange={handleChange}
          required
        />
      </div>
      <div className="cp-field">
        <label className="cp-label" htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          className="cp-textarea"
          name="message"
          rows={5}
          placeholder="Tell us how we can help you..."
          value={form.message}
          onChange={handleChange}
          required
        />
      </div>
      <button id="submit-contact" className={`cp-submit ${loading ? "cp-submit--loading" : ""}`} type="submit" disabled={loading}>
        {loading ? (
          <span className="cp-spinner" />
        ) : (
          <><FaPaperPlane /> Send Message</>
        )}
      </button>
    </form>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <div className="cp-page">

      {/* ── Hero ── */}
      <section className="cp-hero">
        <div className="cp-glow cp-glow--1" />
        <div className="cp-glow cp-glow--2" />
        <div className="cp-hero-inner">
          <span className="cp-tag"><MdElectricBolt /> Get In Touch</span>
          <h1 className="cp-title">We'd Love to <span className="cp-gradient">Hear From You</span></h1>
          <p className="cp-subtitle">
            Have a question about a product? Need help with your order? Or just want to say hi?
            Our team is here and happy to help — reach us through any channel below.
          </p>
        </div>
      </section>

      {/* ── Contact Cards ── */}
      <section className="cp-cards">
        {CONTACT_INFO.map((c, i) => (
          <a key={i} href={c.href} className="cp-card" target="_blank" rel="noreferrer" id={`contact-${c.label.toLowerCase().replace(/\s/g,"-")}`}>
            <span className="cp-card-icon" style={{ color: c.color, background: `${c.color}18` }}>
              {c.icon}
            </span>
            <div>
              <p className="cp-card-label">{c.label}</p>
              <strong className="cp-card-value">{c.value}</strong>
              <p className="cp-card-desc">
                <FaClock style={{ fontSize: 10 }} /> {c.desc}
              </p>
            </div>
            <span className="cp-card-arrow">→</span>
          </a>
        ))}
      </section>

      {/* ── Main Content ── */}
      <section className="cp-main">

        {/* Form */}
        <div className="cp-form-wrap">
          <h2 className="cp-section-title">Send Us a Message</h2>
          <p className="cp-section-sub">Fill out the form and we'll respond within 24 hours.</p>
          <ContactForm />
        </div>

        {/* Socials sidebar */}
        <div className="cp-sidebar">
          <h2 className="cp-section-title">Follow Us</h2>
          <p className="cp-section-sub">Stay updated with our latest deals and launches.</p>
          <div className="cp-socials">
            {SOCIALS.map((s, i) => (
              <a
                key={i}
                href={s.href}
                className="cp-social"
                target="_blank"
                rel="noreferrer"
                id={`social-${s.name.toLowerCase()}`}
              >
                <span className="cp-social-icon" style={{ background: s.bg }}>
                  {s.icon}
                </span>
                <div className="cp-social-info">
                  <strong>{s.name}</strong>
                  <span>{s.handle}</span>
                </div>
                <span className="cp-social-arrow">→</span>
              </a>
            ))}
          </div>

          {/* Quick contact */}
          <div className="cp-quick">
            <h3 className="cp-quick-title">Quick Contact</h3>
            <a href="tel:+251918518515" className="cp-quick-btn cp-quick-btn--phone">
              <FaPhone /> Call Now
            </a>
            <a href="https://wa.me/251918518515" className="cp-quick-btn cp-quick-btn--wa" target="_blank" rel="noreferrer">
              <FaWhatsapp /> WhatsApp
            </a>
            <a href="mailto:littlemezanu@mail.com" className="cp-quick-btn cp-quick-btn--email">
              <FaEnvelope /> Send Email
            </a>
          </div>
        </div>

      </section>
    </div>
  );
}
