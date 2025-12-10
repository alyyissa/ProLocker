import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const SideCart = ({ show, onClose }) => {
  const { cart, removeFromCart } = useCart();

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [show]);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 
          ${show ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-70 md:w-90 py-6 bg-cocoprimary shadow-2xl z-99
        transform transition-transform duration-300
        ${show ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 mt-16 h-[calc(100%-200px)] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-background">Your Cart</h2>

            <button onClick={onClose} className="cursor-pointer">
              <i className="fa-solid fa-xmark text-2xl text-background"></i>
            </button>
          </div>

          {cart.length === 0 ? (
            <p className="text-background">Your cart is empty.</p>
          ) : (
            <ul role="list" className="-my-6 divide-y divide-gray-200">
              {cart.map((product) => (
                <li key={product.id} className="flex py-6">
                  <div className="w-24 h-24 rounded-md overflow-hidden shrink-0 border">
                    <img src={product.imageSrc} alt="" className="object-cover w-full h-full" />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="flex justify-between font-medium text-background">
                      <h3>{product.name}</h3>
                      {product.priceAfterSale && product.priceAfterSale < product.price ? (
                        <div className="flex flex-col items-end">
                          <span className="text-sm line-through opacity-70">${product.price}</span>
                          <span className="text-base font-bold">
                            ${product.priceAfterSale}
                          </span>
                        </div>
                      ) : (
                        <span>${product.price}</span>
                      )}
                    </div>

                    <p className="text-sm text-background/80">Qty {product.qty}</p>

                    <button
                      className="text-primary text-sm hover:underline self-start mt-3 cursor-pointer"
                      onClick={() => removeFromCart(product.id)}
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
              Subtotal: ${subtotal}
            </p>

            <Link to="/checkout">
              <button className="w-full bg-indigo-600 text-white py-2 rounded-md  cursor-pointer">
                Checkout
              </button>
            </Link>

            <button
              onClick={onClose}
              className="w-full bg-gray-300 text-gray-800 py-2 rounded-md mt-2  cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SideCart;
