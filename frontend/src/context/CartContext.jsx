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
        return prev.map((i) =>
          i.product.id === product.id && i.variant.id === variant.id
            ? { ...i, qty: i.qty + qty }
            : i
        );
      }

      return [...prev, { product, variant, qty }];
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
