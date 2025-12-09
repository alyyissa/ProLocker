import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function CheckoutLeft() {
  const { cart } = useCart();
  const { user } = useAuth();

  // Form state
  const [shippingMethod, setShippingMethod] = useState("");
  const [addressInfo, setAddressInfo] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    city: "",
    zip: "",
    email: "",
  });

  // Form validation
  const isFormValid =
    shippingMethod &&
    addressInfo.firstName &&
    addressInfo.lastName &&
    addressInfo.phoneNumber &&
    addressInfo.address &&
    addressInfo.city &&
    addressInfo.zip &&
    addressInfo.email;

  const handleChange = (e) => {
    setAddressInfo({ ...addressInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (!isFormValid) {
      alert("Please fill all required fields!");
      return;
    }

    console.log("Order submitted!", { cart, shippingMethod, addressInfo });
    alert("Order submitted successfully!");
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md space-y-6">
        <h3 className="text-lg font-semibold mb-5">Shipping & Contact Information</h3>
        <div className="space-y-3">
            <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={addressInfo.firstName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            />
            <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={addressInfo.lastName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            />
            <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={addressInfo.phoneNumber}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            />
            <input
            type="text"
            name="address"
            placeholder="Address"
            value={addressInfo.address}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            />
            <input
            type="text"
            name="city"
            placeholder="City"
            value={addressInfo.city}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            />
            <input
            type="email"
            name="email"
            placeholder="Email"
            value={addressInfo.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            />
        </div>

        {/* SHIPPING METHOD */}
        <h3 className="text-lg font-semibold mt-4 mb-2">Shipping Method</h3>
        <div className="space-y-2">
            <label className="flex items-center space-x-2 p-2 border border-gray-300 rounded-md cursor-pointer hover:border-cocoprimary">
            <input
            type="radio"
            name="payment"
            value="COD"
            checked
            readOnly
            className="form-radio text-cocoprimary"
            />
            <span>Delivery 4$ (2-8 working days)</span>
            </label>
        </div>

        {/* PAYMENT METHOD (COD) */}
        <h3 className="text-lg font-semibold mt-4 mb-2">Payment Method</h3>
        <label className="flex items-center space-x-2 p-2 border border-gray-300 rounded-md cursor-pointer hover:border-cocoprimary">
            <input
            type="radio"
            name="payment"
            value="COD"
            checked
            readOnly
            className="form-radio text-cocoprimary"
            />
            <span>Cash on Delivery</span>
        </label>
        <p className="text-sm text-gray-500 mt-1">
        </p>

        {/* SUBMIT BUTTON */}
        <button
            disabled={!isFormValid}
            onClick={handleSubmit}
            className={`w-full py-3 rounded font-semibold text-white transition ${
            isFormValid
                ? "bg-cocoprimary hover:bg-cocoprimary/90"
                : "bg-gray-300 cursor-not-allowed"
            }`}
        >
            Submit Order
        </button>
    </div>
);
}
