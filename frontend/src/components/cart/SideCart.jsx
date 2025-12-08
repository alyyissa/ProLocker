import React, { useEffect, useState } from "react";

const SideCart = ({ show, onClose }) => {
  const [cartProducts, setCartProducts] = useState([
    {
      id: 1,
      name: "Basic Tee",
      href: "#",
      imageSrc: "https://via.placeholder.com/150",
      imageAlt: "Front of Basic Tee",
      price: "$35",
      color: "Black",
      quantity: 2,
    },
    {
      id: 2,
      name: "Artwork Tee",
      href: "#",
      imageSrc: "https://via.placeholder.com/150",
      imageAlt: "Artwork Tee",
      price: "$45",
      color: "White",
      quantity: 1,
    },
    {
      id: 3,
      name: "Puma Sneakers",
      href: "#",
      imageSrc: "https://via.placeholder.com/150",
      imageAlt: "Puma Sneakers",
      price: "$80",
      color: "Gray",
      quantity: 1,
    },
  ]);

  // Lock page scroll when cart is open
  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [show]);

  const handleRemove = (id) => {
    setCartProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const subtotal = cartProducts.reduce(
    (total, item) => total + parseInt(item.price.slice(1)) * item.quantity,
    0
  );

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out
          ${show ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 md:w-100 py-2 md:py-8 bg-cocoprimary shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out
          ${show ? "translate-x-0" : "translate-x-full"}`}
      >

        {/* Cart Items */}
        <div className="p-6 mt-16 h-[calc(100%-200px)] overflow-y-auto">
            <div className=" flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-background">Your Cart</h2>
                {/* Close Button */}
                <button
                onClick={onClose}
                className="items-center cursor-pointer"
                >
                <i className="fa-solid fa-xmark text-2xl text-background"></i>
                </button>
            </div>
          

          {cartProducts.length === 0 ? (
            <p className="text-background">Your cart is empty.</p>
          ) : (
            <ul role="list" className="-my-6 divide-y divide-gray-200">
              {cartProducts.map((product) => (
                <li key={product.id} className="flex py-6">
                  <div className="w-24 h-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      alt={product.imageAlt}
                      src={product.imageSrc}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-background">
                        <h3>
                          <a href={product.href}>{product.name}</a>
                        </h3>
                        <p className="ml-4">{product.price}</p>
                      </div>
                      {product.color && (
                        <p className="mt-1 text-sm text-background/80">
                          {product.color}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-1 items-end justify-between text-sm">
                      {product.quantity !== undefined && (
                        <p className="text-background/80">Qty {product.quantity}</p>
                      )}

                      <div className="flex">
                        <button
                          type="button"
                          className="font-medium text-primary cursor-pointer hover:underline"
                          onClick={() => handleRemove(product.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Bottom Buttons */}
        {cartProducts.length > 0 && (
          <div className="p-6 border-t border-gray-200 flex flex-col gap-2">
            <p className="text-background font-medium mb-2">
              Subtotal: ${subtotal}
            </p>
            <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 cursor-pointer">
              Checkout
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 cursor-pointer"
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
