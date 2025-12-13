import React, { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { getDeliveryFee } from "../../services/delivery/deliveryService";


export default function CheckoutLeft() {
  const { cart, removeFromCart, addToCart, decrementQty } = useCart();

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.product.priceAfterSale || item.product.price) * item.qty,
    0
  );
  const [deliveryFee, setDeliveryFee] = useState(0)
  useEffect(() => {
  const fetchDelivery = async () => {
    const fee = await getDeliveryFee();
    setDeliveryFee(fee);
  };
  fetchDelivery();
  }, []);

  const total = subtotal + deliveryFee;

  return (
    <div className="w-full bg-white p-6 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Your Items</h2>
      {cart.length === 0 ? (
        <p className="text-center text-slate-500 font-medium py-6">Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={`${item.product.id}-${item.variant.id}`}
              className="flex gap-4 max-sm:flex-col border-b border-gray-300 pb-4"
            >
              <div className="w-24 h-24 shrink-0 bg-purple-50 p-2 rounded-md">
                <img
                  src={item.product.mainImage || item.product.galleryImages?.[0]}
                  className="w-full h-full object-contain"
                  alt={item.product.name}
                />
              </div>

              <div className="w-full flex justify-between gap-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-900">{item.product.name}</h3>
                  {item.variant && (
                    <p className="text-sm font-medium text-slate-500 mt-2">
                      Size: {item.variant.size.symbol}
                    </p>
                  )}
                  <h6 className="text-[15px] text-slate-900 font-medium mt-4">
                    ${item.product.priceAfterSale || item.product.price}
                  </h6>
                </div>

                <div className="flex flex-col justify-between items-end gap-4">
                  {/* Remove from cart */}
                  <button onClick={() => removeFromCart(item.product.id, item.variant.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 fill-red-500 inline cursor-pointer" viewBox="0 0 24 24">
                      <path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z" />
                      <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z" />
                    </svg>
                  </button>

                  {/* Qty Controls */}
                  <div className="flex items-center px-2.5 py-1.5 border border-gray-400 text-slate-900 text-xs font-medium bg-transparent rounded-md">
                    <button
                      type="button"
                      className="cursor-pointer"
                      onClick={() => decrementQty(item.product.id, item.variant.id)}
                    >
                      -
                    </button>
                    <span className="mx-3">{item.qty}</span>
                    <button
                      type="button"
                      className="cursor-pointer"
                      onClick={() => addToCart(item.product, item.variant, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Summary */}
          <div className="mt-6">
            <ul className="text-slate-500 font-medium space-y-2">
              <li className="flex justify-between text-sm">
                Subtotal <span className="text-slate-900 font-semibold">${subtotal.toFixed(2)}</span>
              </li>
              <li className="flex justify-between text-sm">
                Delivery <span className="text-slate-900 font-semibold">${deliveryFee.toFixed(2)}</span>
              </li>
              <hr className="border-slate-300" />
              <li className="flex justify-between font-semibold text-slate-900">
                Total <span>${total.toFixed(2)}</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
