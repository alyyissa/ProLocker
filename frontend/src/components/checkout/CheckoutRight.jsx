import React from "react";
import { useCart } from "../../context/CartContext";


const CheckoutRight = () => {
  const { cart } = useCart();

  const SHIPPING = 4;

  const subtotal = cart?.reduce(
    (sum, item) => sum + (item.priceAfterSale || item.price) * item.qty,
    0
  ) || 0;

  const total = subtotal + (cart.length ? SHIPPING : 0);

  return (
    <aside className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">Order Summary</h2>
      <ul className="space-y-4 max-h-[40vh] overflow-y-auto">
        {cart.map((item) => (
          <li key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">{item.color?.color || ""}</p>
                <p className="text-sm text-gray-500">{item.size?.symbol || ""}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">
                ${((item.priceAfterSale || item.price) * item.qty).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">{item.qty} pcs</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${cart.length ? SHIPPING.toFixed(2) : "0.00"}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button className="w-full bg-cocoprimary text-white py-2 rounded-lg hover:bg-cocoprimary/90 transition">
        Confirm Order
      </button>
    </aside>
  );
};

export default CheckoutRight;
