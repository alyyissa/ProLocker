import React from "react";
import { useCart } from "../context/CartContext";
import CartCard from "../components/cart/CartCard";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, addToCart, decrementQty, removeFromCart } = useCart();

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.qty, 0);
  };

  if (cart.length === 0)
    return (
    <div className="min-h-screen pt-[69px] md:pt-[109px]">
      <div
        className="w-full h-[228px] bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${assets.bgProducts})` }}
      >
        <h1 className="ultra-regular text-4xl md:text-5xl text-background ultra-regular">
          YOUR CART
        </h1>
      </div>
      <section className="min-h-[calc(100vh-228px-69px)] md:min-h-[calc(100vh-228px-109px)] flex justify-center items-center w-full bg-white px-4">
        <div className="mx-auto text-center flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-cocoprimary ultra-regular">
            Your cart is empty
          </h2>
          <Link to={'/products'}>
            <button className="mt-5 py-2 px-10 bg-cocoprimary rounded-2xl cursor-pointer text-background text-center
                  hover:bg-gray-800 flex items-center gap-4 group transition-all duration-200">
                  Start Shopping
                  <svg
                    width="24"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-background transform transition-transform duration-200 group-hover:scale-125"
                  >
                    <path d="M19.1788 13.5L5 13.5V15.5L19.1788 15.5L16.0615 18.6L17.4693 20L23 14.5L17.5698 9L16.162 10.4L19.1788 13.5Z" fill="currentColor"/>
                  </svg>
                </button>
          </Link>
          <div  className="mt-10">
            <p className=" font-semibold">
              Have an account ?
            </p>
            <p>
                <Link to={'/login'}>
                <span className="underline">Login</span> 
                </Link> to place an order
            </p>
          </div>
        </div>
      </section>
    </div>
    );

  return (
    <>
      <div
        className="w-full h-[228px] bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${assets.bgProducts})` }}
      >
        <h1 className="ultra-regular text-4xl md:text-5xl text-background">
          Shop Here
        </h1>
      </div>
      <section className="bg-white py-8 min-h-screen w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-semibold text-gray-900">
            Shopping Cart
          </h2>

          <div className="mt-6 flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 space-y-6">
              {cart.map((item) => (
                <CartCard 
                  key={item.id}
                  item={item}
                  addToCart={addToCart}
                  decrementQty={decrementQty}
                  removeFromCart={removeFromCart}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:max-w-sm bg-cocoprimary p-6 rounded-lg shadow-md space-y-4">
              <h3 className="text-lg font-semibold text-background">
                Order summary
              </h3>

              <div className="flex justify-between text-background">
                <span>Total</span>
                <span className="font-medium">${getTotalPrice()}</span>
              </div>

              <button className="w-full bg-background text-primary py-2 mt-2 rounded-md font-semibold shadow hover:bg-gray-200 cursor-pointer">
                Proceed to checkout
              </button>

              <p className="text-background/80 text-center text-sm cursor-pointer hover:underline">
                Continue shopping
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
