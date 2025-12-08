import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import CartCard from "../components/cart/CartCard";

const Cart = () => {
  const { cart, addToCart, decrementQty, removeFromCart, clearCart } = useCart();

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.qty, 0);
  };
   const dummyItems = [
  {
    id: 1,
    name: 'PC system All in One APPLE iMac (2023) mqrq3ro/a',
    price: 1499,
    qty: 2,
    image: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg',
    imageDark: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg',
  },
  {
    id: 2,
    name: 'Restored Apple Watch Series 8 (GPS) 41mm Midnight Aluminum Case',
    price: 598,
    qty: 1,
    image: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-light.svg',
    imageDark: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-dark.svg',
  },
  {
    id: 3,
    name: 'Apple - MacBook Pro 16" Laptop, M3 Pro chip, 36GB Memory',
    price: 1799,
    qty: 1,
    image: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/macbook-pro-light.svg',
    imageDark: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/macbook-pro-dark.svg',
  },
  {
    id: 4,
    name: 'Tablet APPLE iPad Pro 12.9" 6th Gen, 128GB, Wi-Fi, Gold',
    price: 699,
    qty: 1,
    image: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/ipad-light.svg',
    imageDark: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/ipad-dark.svg',
  },
  {
    id: 5,
    name: 'APPLE iPhone 15 5G phone, 256GB, Gold',
    price: 2997,
    qty: 3,
    image: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/iphone-light.svg',
    imageDark: 'https://flowbite.s3.amazonaws.com/blocks/e-commerce/iphone-dark.svg',
  },
];

useEffect(() => {
    if (cart.length === 0) {
      dummyItems.forEach(item => addToCart(item, item.qty));
    }
  }, []);
  
  if (cart.length === 0)
    return (
      <section className="bg-white flex justify-center items-center md:py-16 h-auto w-full px-3 sm:px-4 md:px-11 lg:px-13 xl:px-12 2xl:px-16">
        <div className="mx-auto max-w-7xl px-4 2xl:px-0 text-center">
          <h2 className="text-2xl font-semibold text-cocoprimary ">
            Your cart is empty
          </h2>
        </div>
      </section>
    );

  return (
    <section className="bg-white py-8 md:pt-30 min-h-screen w-full px-3 sm:px-4 md:px-11 lg:px-13 xl:px-12 2xl:px-16">
        <div className="mx-auto max-w-7xl px-4 2xl:px-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Shopping Cart
            </h2>

            <div className="mt-6 space-y-6 md:gap-6 lg:flex lg:items-start xl:gap-8">
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl space-y-6">
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

          {/* Order summary */}
            <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                <div className="space-y-4 rounded-lg border bg-cocoprimary p-4 shadow-md ">
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    Order summary
                </p>

                <div className="space-y-4">
                    <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                        Total
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                        ${getTotalPrice()}
                    </dd>
                    </dl>
                </div>

                <button
                    className="w-full rounded bg-background px-5 py-2.5 text-sm font-semibold text-primary hover:bg-gray-200 cursor-pointer"
                >
                    Procced to checkout
                </button>
                
                <p className="text-gray-400 text-center">
                    or <span className="underline cursor-pointer hover:no-underline">Continue Shopping</span>
                </p>
                </div>
            </div>
            </div>
        </div>
    </section>
  );
};

export default Cart;
