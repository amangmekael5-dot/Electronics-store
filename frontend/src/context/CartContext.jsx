import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    const pid = product._id || product.id;
    const addQty = typeof quantity === "number" && quantity > 0 ? quantity : 1;
    setCart((prev) => {
      const existing = prev.find((i) => (i._id || i.id) === pid);
      if (existing) {
        return prev.map((i) =>
          (i._id || i.id) === pid ? { ...i, qty: i.qty + addQty } : i
        );
      }
      return [...prev, { ...product, qty: addQty }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((i) => (i._id || i.id) !== productId));
  };

  const updateQuantity = (productId, qty) => {
    if (qty < 1) return removeFromCart(productId);
    setCart((prev) =>
      prev.map((i) => ((i._id || i.id) === productId ? { ...i, qty } : i))
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
