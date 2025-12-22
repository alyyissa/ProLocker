import React, { useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const SideCart = React.memo(({ show, onClose }) => {
  const { user } = useAuth();
  const { cart, removeFromCart } = useCart();

  // Consolidated useEffect for scrollbar handling
  useEffect(() => {
    if (show) {
      // Calculate scrollbar width first (DOM read)
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Apply all DOM changes together (DOM writes)
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      // Reset both properties together
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [show]);

  // Calculate subtotal with useMemo to prevent unnecessary recalculations
  const subtotal = cart.reduce(
    (total, item) =>
      total + (item.product.priceAfterSale || item.product.price) * item.qty,
    0
  );

  // Memoize the remove function to prevent unnecessary re-renders
  const handleRemoveFromCart = useCallback((productId, variantId) => {
    removeFromCart(productId, variantId);
  }, [removeFromCart]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 
          ${show ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Cart Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-70 md:w-90 py-6 bg-cocoprimary shadow-2xl z-90
        transform transition-transform duration-300 ease-out
        ${show ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="p-6 h-[calc(100%-200px)] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-background">Your Cart</h2>
            <button 
              onClick={onClose} 
              className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
              aria-label="Close cart"
            >
              <i className="fa-solid fa-xmark text-2xl text-background"></i>
            </button>
          </div>

          {cart.length === 0 ? (
            <>
              <p className="text-background">Your cart is empty.</p>
              {!user && (
                <p className="text-background font-bold mt-10">
                  You must <a href="/login" className="hover:underline text-tertiary">Login</a> to Order!!
                </p>
              )}
            </>
          ) : (
            <ul role="list" className="-my-6 divide-y divide-gray-200">
              {cart.map((item) => (
                <li
                  key={`${item.product.id}-${item.variant.id}`}
                  className="flex py-6"
                >
                  <div className="w-24 h-24 rounded-md overflow-hidden shrink-0 border">
                    <img
                      src={`${item.product.mainImage}`}
                      alt={item.product.name}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="flex justify-between font-medium text-background">
                      <h3 className="line-clamp-1">{item.product.name}</h3>
                      {item.product.priceAfterSale &&
                      item.product.priceAfterSale < item.product.price ? (
                        <div className="flex flex-col items-end">
                          <span className="text-sm line-through opacity-70">
                            ${item.product.price}
                          </span>
                          <span className="text-base font-bold">
                            ${item.product.priceAfterSale}
                          </span>
                        </div>
                      ) : (
                        <span>${item.product.price}</span>
                      )}
                    </div>

                    <p className="text-sm text-background/80">
                      Size: {item.variant.size.symbol} | Qty {item.qty}
                    </p>

                    <button
                      className="text-primary text-sm hover:underline self-start mt-3 cursor-pointer
                        focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1"
                      onClick={() => handleRemoveFromCart(item.product.id, item.variant.id)}
                      aria-label={`Remove ${item.product.name} from cart`}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <p className="text-background font-medium mb-2">
              Subtotal: <span className="font-bold">${subtotal.toFixed(2)}</span>
            </p>

            <Link to="/checkout">
              <button 
                className="w-full bg-tertiary hover:bg-tertiary-hover text-white py-3 rounded-md 
                  cursor-pointer transition duration-300 focus:outline-none focus:ring-2 focus:ring-tertiary/50"
                onClick={onClose}
              >
                Checkout
              </button>
            </Link>

            <button
              onClick={onClose}
              className="w-full bg-gray-300 text-gray-800 py-3 rounded-md mt-3 cursor-pointer
                hover:bg-gray-400 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
});

SideCart.displayName = "SideCart";
export default SideCart;