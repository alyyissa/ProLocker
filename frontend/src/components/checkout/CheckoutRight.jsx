import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { createOrder } from "../../services/orders/orderServies";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { getDeliveryFee } from "../../services/delivery/deliveryService";

export default function CheckoutRight() {
  const { user } = useAuth();
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
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.product.priceAfterSale || item.product.price) * item.qty,
    0
  );
  const total = subtotal + deliveryFee;

  useEffect(() => {
  const fetchDelivery = async () => {
    const fee = await getDeliveryFee();
    setDeliveryFee(fee);
  };
  fetchDelivery();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error("Your cart is empty!");
    setLoading(true);

    try {
      const orderPayload = {
        userId: Number(user.id),
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        address: form.address,
        city: form.city,
        country: "Lebanon",
        items: cart.map((item) => ({
          productVarientId: item.variant.id,
          quantity: item.qty,
        })),
      };

      const res = await createOrder(orderPayload);
      toast.success("Order placed successfully! Tracking: " + res.trackingNumber);
      clearCart();
      navigate("/profile");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-md shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-900">Delivery Details</h2>
        <div className="grid lg:grid-cols-2 gap-4">
          {["firstName","lastName","email","phoneNumber","city","address","apartment"].map((field) => (
            <div key={field}>
              <label className="text-sm font-medium text-slate-900 block mb-2">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                className="px-4 py-2.5 w-full text-sm text-slate-900 bg-white border placeholder-slate-400
              focus:placeholder-slate-300 border-gray-400 rounded-md focus:outline-none
                focus:ring-1 focus:ring-cocoprimary focus:border-cocoprimary"
                required={field !== "apartment" && field !== "email"}
              />
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Payment</h2>
        <div className="flex items-center gap-4 mb-4">
          <input type="radio" name="paymentMethod" value="cod" checked readOnly className="w-5 h-5 cursor-pointer" />
          <label className="text-slate-900 font-semibold cursor-pointer">
            Cash on Delivery (COD) <span className="font-normal text-slate-500"> Delivery in 2-7 working days</span>
          </label>
        </div>

        <ul className="text-slate-500 font-medium space-y-2 mb-4">
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

        <div className="flex flex-row gap-4">
          <button type="submit" disabled={loading} className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-cocoprimary rounded-md cursor-pointer">
            {loading ? "Processing..." : "Place Order"}
          </button>
          <Link to="/products" className="w-full">
            <button className="w-full px-4 py-2.5 text-sm font-semibold text-cocoprimary bg-gray-300 hover:bg-gray-400 rounded-md cursor-pointer">
              Continue Shopping
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}
