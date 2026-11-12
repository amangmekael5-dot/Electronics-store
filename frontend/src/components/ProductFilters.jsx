import { useState } from "react";
import { FaFilter, FaRedo, FaStar, FaStarHalfAlt, FaRegStar, FaTimes, FaTag, FaCheck, FaDollarSign } from "react-icons/fa";
import "./ProductFilters.css";

const ALL_BRANDS = ["Apple", "Samsung", "Sony", "Dell", "DJI", "ASUS", "Google"];

export default function ProductFilters({
  priceFilter,
  setPriceFilter,
  selectedBrands,
  setSelectedBrands,
  minRating,
  setMinRating,
  availability,
  setAvailability,
  conditionFilter,
  setConditionFilter,
  discountFilter,
  setDiscountFilter,
  onResetAll,
  activeFilterCount,
  brandCounts = {},
  isOpenMobile,
  onCloseMobile,
}) {
  const [sliderMax, setSliderMax] = useState(priceFilter.max || 3000);

  // Toggle brand selection
  const handleBrandToggle = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  // Price slider change
  const handleSliderChange = (e) => {
    const val = Number(e.target.value);
    setSliderMax(val);
    setPriceFilter({ ...priceFilter, max: val === 3000 ? "" : val });
  };

  // Quick price presets
  const applyPricePreset = (min, max) => {
    setPriceFilter({ min, max });
    setSliderMax(max === "" ? 3000 : max);
  };

  return (
    <aside className={`pf-sidebar ${isOpenMobile ? "pf-sidebar--open" : ""}`}>
      {/* ── Sidebar Header ── */}
      <div className="pf-header">
        <div className="pf-title-wrap">
          <FaFilter className="pf-title-icon" />
          <h3 className="pf-title">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="pf-active-badge">{activeFilterCount} active</span>
          )}
        </div>

        <div className="pf-header-actions">
          {activeFilterCount > 0 && (
            <button
              type="button"
              className="pf-reset-btn"
              onClick={onResetAll}
              title="Reset all filters"
            >
              <FaRedo size={11} /> Reset
            </button>
          )}

          {/* Mobile close button */}
          <button
            type="button"
            className="pf-close-mobile-btn"
            onClick={onCloseMobile}
            aria-label="Close filters"
          >
            <FaTimes />
          </button>
        </div>
      </div>

      <div className="pf-content">
        {/* ── 1. Price Range ── */}
        <div className="pf-group">
          <div className="pf-group-header">
            <span className="pf-group-title">Price Range</span>
            <span className="pf-range-display">
              ${priceFilter.min || 0} – ${priceFilter.max ? priceFilter.max.toLocaleString() : "3,000+"}
            </span>
          </div>

          <div className="pf-slider-wrap">
            <input
              type="range"
              min="0"
              max="3000"
              step="50"
              value={sliderMax}
              onChange={handleSliderChange}
              className="pf-slider"
            />
            <div className="pf-slider-labels">
              <span>$0</span>
              <span>$1,500</span>
              <span>$3,000+</span>
            </div>
          </div>

          {/* Min/Max Manual Inputs */}
          <div className="pf-price-inputs">
            <div className="pf-input-box">
              <span className="pf-currency">$</span>
              <input
                type="number"
                placeholder="Min"
                value={priceFilter.min}
                onChange={(e) =>
                  setPriceFilter({ ...priceFilter, min: e.target.value })
                }
                min="0"
              />
            </div>
            <span className="pf-price-sep">to</span>
            <div className="pf-input-box">
              <span className="pf-currency">$</span>
              <input
                type="number"
                placeholder="Max"
                value={priceFilter.max}
                onChange={(e) => {
                  const val = e.target.value;
                  setPriceFilter({ ...priceFilter, max: val });
                  if (val) setSliderMax(Number(val));
                }}
                min="0"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div className="pf-presets-wrap">
            <button
              type="button"
              className={`pf-preset-btn ${!priceFilter.min && !priceFilter.max ? "pf-preset-btn--active" : ""}`}
              onClick={() => applyPricePreset("", "")}
            >
              All
            </button>
            <button
              type="button"
              className={`pf-preset-btn ${priceFilter.max === 500 && !priceFilter.min ? "pf-preset-btn--active" : ""}`}
              onClick={() => applyPricePreset("", 500)}
            >
              &lt; $500
            </button>
            <button
              type="button"
              className={`pf-preset-btn ${priceFilter.min === 500 && priceFilter.max === 1000 ? "pf-preset-btn--active" : ""}`}
              onClick={() => applyPricePreset(500, 1000)}
            >
              $500–$1k
            </button>
            <button
              type="button"
              className={`pf-preset-btn ${priceFilter.min === 1000 && priceFilter.max === 2000 ? "pf-preset-btn--active" : ""}`}
              onClick={() => applyPricePreset(1000, 2000)}
            >
              $1k–$2k
            </button>
            <button
              type="button"
              className={`pf-preset-btn ${priceFilter.min === 2000 && !priceFilter.max ? "pf-preset-btn--active" : ""}`}
              onClick={() => applyPricePreset(2000, "")}
            >
              $2k+
            </button>
          </div>
        </div>

        {/* ── 2. Brand Filter ── */}
        <div className="pf-group">
          <div className="pf-group-header">
            <span className="pf-group-title">Brand</span>
            {selectedBrands.length > 0 && (
              <button
                type="button"
                className="pf-clear-text"
                onClick={() => setSelectedBrands([])}
              >
                Clear
              </button>
            )}
          </div>

          <div className="pf-brands-list">
            {ALL_BRANDS.map((brand) => {
              const isChecked = selectedBrands.includes(brand);
              const count = brandCounts[brand] || 0;
              return (
                <label key={brand} className="pf-checkbox-label">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleBrandToggle(brand)}
                    className="pf-checkbox"
                  />
                  <span className="pf-custom-check">
                    {isChecked && <FaCheck size={9} />}
                  </span>
                  <span className="pf-brand-name">{brand}</span>
                  <span className="pf-count-pill">{count}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* ── 3. Customer Rating ── */}
        <div className="pf-group">
          <div className="pf-group-header">
            <span className="pf-group-title">Customer Rating</span>
            {minRating > 0 && (
              <button
                type="button"
                className="pf-clear-text"
                onClick={() => setMinRating(0)}
              >
                Clear
              </button>
            )}
          </div>

          <div className="pf-ratings-list">
            {[
              { val: 0, label: "All Ratings" },
              { val: 4.8, label: "4.8 & above" },
              { val: 4.5, label: "4.5 & above" },
              { val: 4.0, label: "4.0 & above" },
            ].map(({ val, label }) => (
              <button
                key={val}
                type="button"
                className={`pf-rating-btn ${minRating === val ? "pf-rating-btn--active" : ""}`}
                onClick={() => setMinRating(val)}
              >
                {val > 0 ? (
                  <>
                    <span className="pf-stars-inline">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      {val >= 4.5 ? <FaStar /> : <FaStarHalfAlt />}
                    </span>
                    <span>{label}</span>
                  </>
                ) : (
                  <span>{label}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── 4. Stock Availability ── */}
        <div className="pf-group">
          <div className="pf-group-header">
            <span className="pf-group-title">Availability</span>
          </div>

          <div className="pf-pills-row">
            {[
              { val: "all", label: "All Items" },
              { val: "in-stock", label: "In Stock" },
              { val: "out-of-stock", label: "Out of Stock" },
            ].map(({ val, label }) => (
              <button
                key={val}
                type="button"
                className={`pf-pill-btn ${availability === val ? "pf-pill-btn--active" : ""}`}
                onClick={() => setAvailability(val)}
              >
                {val === "in-stock" && <span className="pf-status-dot pf-status-dot--in" />}
                {val === "out-of-stock" && <span className="pf-status-dot pf-status-dot--out" />}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── 5. Product Condition ── */}
        <div className="pf-group">
          <div className="pf-group-header">
            <span className="pf-group-title">Product Condition</span>
          </div>

          <div className="pf-pills-row">
            {[
              { val: "all", label: "All Conditions" },
              { val: "Brand New", label: "Brand New" },
              { val: "Certified Refurbished", label: "Refurbished" },
            ].map(({ val, label }) => (
              <button
                key={val}
                type="button"
                className={`pf-pill-btn ${conditionFilter === val ? "pf-pill-btn--active" : ""}`}
                onClick={() => setConditionFilter(val)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── 6. Discount Percentage ── */}
        <div className="pf-group">
          <div className="pf-group-header">
            <span className="pf-group-title">Special Discounts</span>
          </div>

          <div className="pf-pills-row">
            {[
              { val: "all", label: "All Products" },
              { val: "any", label: "On Sale" },
              { val: "10", label: "10%+ Off" },
              { val: "15", label: "15%+ Off" },
            ].map(({ val, label }) => (
              <button
                key={val}
                type="button"
                className={`pf-pill-btn ${discountFilter === val ? "pf-pill-btn--active" : ""}`}
                onClick={() => setDiscountFilter(val)}
              >
                <FaTag size={10} /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
