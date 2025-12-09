import React, { useState } from "react";
import CheckoutLeft from "../components/checkout/CheckoutLeft";
import CheckoutRight from "../components/checkout/CheckoutRight";
import { useCart } from "../context/CartContext";


const Checkout = () => {
  const { cart } = useCart();
  const [contactInfo, setContactInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
  });

  return (
    <div className="min-h-screen bg-gray-100 pt-30 md:pt-45 px-3 md:px-10 pb-10 md:pb-20">
      <h1 className="text-3xl font-bold mb-6 text-center ultra-regular">Checkout</h1>

      {cart.length === 0 ? (
        <p className="text-center text-xl ultra-regular">Your cart is empty.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-2">
          <CheckoutLeft contactInfo={contactInfo} setContactInfo={setContactInfo} />
          <CheckoutRight />
        </div>
      )}
    </div>
  );
};

export default Checkout;
