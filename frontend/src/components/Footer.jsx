import { Link } from "react-router-dom";
import {
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaTiktok,
  FaInstagram, FaFacebook, FaWhatsapp, FaArrowUp,
  FaCcVisa, FaCcMastercard, FaCcPaypal,
} from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="ft-footer">
      <div className="ft-container">
        
        {/* Brand Column */}
        <div className="ft-col ft-col--brand">
          <Link className="ft-logo" to="/">
            <span>⚡</span> ElecStore
          </Link>
          <p className="ft-desc">
            Your premium gateway to world-class electronics. We source directly from top brand partners with full global warranties.
          </p>
          <div className="ft-socials">
            <a href="https://tiktok.com/@elecstore" target="_blank" rel="noreferrer" aria-label="TikTok">
              <FaTiktok />
            </a>
            <a href="https://instagram.com/elecstore" target="_blank" rel="noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://facebook.com/elecstore" target="_blank" rel="noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://wa.me/251918518515" target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="ft-col">
          <h4 className="ft-title">Quick Links</h4>
          <ul className="ft-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products Catalogue</Link></li>
            <li><Link to="/about">About ElecStore</Link></li>
            <li><Link to="/contact">Contact Support</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="ft-col">
          <h4 className="ft-title">Top Categories</h4>
          <ul className="ft-links">
            <li><Link to="/products">Smartphones</Link></li>
            <li><Link to="/products">Laptops & Workstations</Link></li>
            <li><Link to="/products">Audio & Headwear</Link></li>
            <li><Link to="/products">Smart Wearables</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="ft-col ft-col--contact">
          <h4 className="ft-title">Store Hotline</h4>
          <ul className="ft-contact-list">
            <li>
              <a href="tel:+251918518515">
                <FaPhone className="ft-c-icon" /> 0918 518 515
              </a>
            </li>
            <li>
              <a href="mailto:littlemezanu@mail.com">
                <FaEnvelope className="ft-c-icon" /> littlemezanu@mail.com
              </a>
            </li>
            <li>
              <span>
                <FaMapMarkerAlt className="ft-c-icon" /> Addis Ababa, Ethiopia
              </span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="ft-bottom">
        <div className="ft-bottom-container">
          <p className="ft-copy">
            &copy; {new Date().getFullYear()} ElecStore. All rights reserved. Made internationally.
          </p>

          <div className="ft-payments">
            <span title="Visa"><FaCcVisa /></span>
            <span title="Mastercard"><FaCcMastercard /></span>
            <span title="PayPal"><FaCcPaypal /></span>
            <span className="ft-badge">Secure 256-bit SSL</span>
          </div>

          <button className="ft-scroll-btn" onClick={scrollToTop} aria-label="Scroll back to top">
            <FaArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
}
