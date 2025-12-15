import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

    useEffect(() => {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) setCart(JSON.parse(storedCart));
    }, []);

    useEffect(() => {
      localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, variant, qty = 1) => {
      if (!variant) return;

      setCart((prev) => {
        const existing = prev.find(
          (i) => i.product.id === product.id && i.variant.id === variant.id
        );

      if (existing) {
        const newQty = existing.qty + qty;
        if (newQty > 2) {
          alert("You can only add up to 2 of this variant.");
          return prev;
        }

        return prev.map((i) =>
          i.product.id === product.id && i.variant.id === variant.id
            ? { ...i, qty: newQty }
            : i
        );
    }

    return [...prev, { product, variant, qty: Math.min(qty, 2) }];
  });
  };

  const removeFromCart = (productId, variantId) => {
    setCart((prev) =>
      prev.filter(
        (i) => !(i.product.id === productId && i.variant.id === variantId)
      )
    );
  };

  const decrementQty = (productId, variantId) => {
    setCart((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.variant.id === variantId
          ? { ...i, qty: i.qty > 1 ? i.qty - 1 : 1 }
          : i
      )
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, decrementQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
