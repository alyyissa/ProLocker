import React from "react";
import CheckoutLeft from "../components/checkout/CheckoutLeft";
import CheckoutRight from "../components/checkout/CheckoutRight";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Checkout = () => {
  const { cart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[90dvh] pt-[69px] md:pt-[109px]">
        <div>
          <h1 className="ultra-regular text-4xl md:text-5xl text-background">
            YOUR CART
          </h1>
        </div>
        <section className="min-h-[calc(100vh-228px-69px)] md:min-h-[calc(100vh-228px-109px)] flex justify-center items-center w-full bg-white px-4">
          <div className="mx-auto text-center flex flex-col items-center">
            <h2 className="text-2xl font-semibold text-cocoprimary">
              Your cart is empty
            </h2>
            <Link to="/products">
              <button className="mt-5 py-2 px-10 bg-cocoprimary rounded-2xl cursor-pointer text-background hover:bg-gray-800 flex items-center gap-4 group transition-all duration-200">
                Start Shopping
              </button>
            </Link>
            <div className="mt-10">
              <p className="font-semibold">Have an account?</p>
              <p>
                <Link to="/login">
                  <span className="underline">Login</span>
                </Link>{" "}
                to place an order
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-20 md:py-40 w-full px-3 sm:px-4 md:px-11 lg:px-13 xl:px-12 2xl:px-16">
      <div className="flex flex-col md:flex-row gap-10 justify-center w-full">
        <CheckoutLeft />
        <CheckoutRight />
      </div>
    </div>
  );
};

export default Checkout;
