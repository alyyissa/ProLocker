import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { createOrder } from "../../services/orders/orderServies";
import { Link } from "react-router-dom";


export default function CheckoutRight() {
  const { cart, clearCart } = useCart();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    city: "",
    address: "",
    apartment: "",
  });
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = 3;
  const total = subtotal + deliveryFee;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error("Your cart is empty!");
    setLoading(true);

    try {
      const orderPayload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        address: form.address,
        city: form.city,
        state: form.state,
        zip: form.zip,
        country: "Lebanon",
        items: cart.map((item) => ({
          productVarientId: item.productVarientId || item.id,
          quantity: item.qty,
        })),
      };

      const res = await createOrder(orderPayload);
      toast.success("Order placed successfully! Tracking: " + res.trackingNumber);
      clearCart();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-900">Delivery Details</h2>
        <div className="grid lg:grid-cols-2 gap-4">
          {["firstName","lastName","email","phoneNumber","city","address","apartment"].map((field) => (
            <div key={field}>
              <label className="text-sm font-medium text-slate-900 block mb-2">{field.charAt(0).toUpperCase()+field.slice(1)}</label>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={`Enter ${field.charAt(0).toUpperCase()+field.slice(1)}`}
                className="px-4 py-2.5 w-full text-sm text-slate-900 bg-white border border-gray-400 rounded-md focus:outline-blue-600"
                required={field !== "apartment" && field !== "email"}
              />
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Payment</h2>
        <div className="flex items-center gap-4 mb-4">
          <input type="radio" name="paymentMethod" value="cod" checked readOnly className="w-5 h-5 cursor-pointer" />
          <label className="text-slate-900 font-medium cursor-pointer">Cash on Delivery (COD)</label>
        </div>

        <ul className="text-slate-500 font-medium space-y-2 mb-4">
          <li className="flex justify-between text-sm">Subtotal <span className="text-slate-900 font-semibold">${subtotal.toFixed(2)}</span></li>
          <li className="flex justify-between text-sm">Delivery <span className="text-slate-900 font-semibold">${deliveryFee.toFixed(2)}</span></li>
          <hr className="border-slate-300" />
          <li className="flex justify-between font-semibold text-slate-900">Total <span>${total.toFixed(2)}</span></li>
        </ul>
        <div className="flex flex-row gap-4">
          <Link to={'/products'} className="w-full">
            <button className="w-full px-4 py-2.5 text-sm font-semibold text-cocoprimary bg-gray-300 hover:bg-gray-400 rounded-md cursor-pointer transform transition-all duration-300">
              Continue Shopping
            </button>
          </Link>
          <button type="submit" disabled={loading} className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-cocoprimary rounded-md cursor-pointer">
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
