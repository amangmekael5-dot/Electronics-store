import { Link } from "react-router-dom";
import { FaShoppingCart, FaUser, FaSun, FaMoon, FaBars, FaSignOutAlt, FaBoxOpen } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";
import { useState } from "react";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="nv-bar">
      <div className="nv-container">
        {/* Logo */}
        <Link className="nv-logo" to="/">
          <span>⚡</span> ElecStore
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="nv-toggler"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <FaBars />
        </button>

        {/* Menu Items */}
        <div className={`nv-menu ${menuOpen ? "nv-menu--open" : ""}`}>
          <ul className="nv-nav-list">
            <li className="nv-nav-item">
              <Link className="nv-nav-link" to="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li className="nv-nav-item">
              <Link className="nv-nav-link" to="/products" onClick={() => setMenuOpen(false)}>
                Products
              </Link>
            </li>
            <li className="nv-nav-item">
              <Link className="nv-nav-link" to="/about" onClick={() => setMenuOpen(false)}>
                About
              </Link>
            </li>
            <li className="nv-nav-item">
              <Link className="nv-nav-link" to="/contact" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
            </li>
            <li className="nv-nav-item">
              <Link className="nv-nav-link nv-admin-link" to="/admin" onClick={() => setMenuOpen(false)}>
                <MdAdminPanelSettings style={{ verticalAlign: "middle", marginRight: "4px", fontSize: "16px" }} />
                Admin
              </Link>
            </li>
          </ul>

          {/* Actions & Theme Toggler */}
          <div className="nv-actions">
            {/* Theme Toggle Button */}
            <button
              className="nv-theme-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
              aria-label="Toggle light or dark theme"
            >
              {theme === "dark" ? <FaSun className="nv-sun" /> : <FaMoon className="nv-moon" />}
            </button>

            {user ? (
              <div className="nv-user-profile">
                <span className="nv-username">
                  <FaUser className="nv-user-icon" /> {user.name.split(" ")[0]}
                </span>
                {user.role === "admin" && (
                  <Link
                    className="nv-admin-btn"
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    title="Admin Panel"
                  >
                    <MdAdminPanelSettings />
                  </Link>
                )}
                <Link
                  className="nv-orders-btn"
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                  title="My Orders"
                >
                  <FaBoxOpen />
                </Link>
                <button
                  className="nv-logout-btn"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <Link className="nv-btn nv-btn--secondary" to="/login" onClick={() => setMenuOpen(false)}>
                <FaUser /> Login
              </Link>
            )}

            <Link className="nv-btn nv-btn--primary nv-cart-btn" to="/cart" onClick={() => setMenuOpen(false)}>
              <FaShoppingCart /> Cart
              {totalItems > 0 && <span className="nv-badge">{totalItems}</span>}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;