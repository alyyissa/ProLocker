import React from "react";

const CartCard = ({ item, addToCart, decrementQty, removeFromCart }) => {
  // Determine final price per unit
  const finalPrice = item.priceAfterSale && item.priceAfterSale < item.price ? item.priceAfterSale : item.price;

  return (
    <div className="rounded-lg border border-gray-200 bg-cocoprimary p-4 shadow-sm md:p-6">
      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
        {/* Product Image */}
        <a href="#" className="shrink-0 md:order-1">
          <img
            className="h-25 w-25"
            src={item.image}
            alt={item.name}
          />
        </a>

        {/* Quantity & Price */}
        <div className="flex items-center justify-between md:order-3 md:justify-end gap-4">
          <div className="flex items-center">
            <button
              onClick={() => decrementQty(item.id)}
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 cursor-pointer"
            >
              -
            </button>
            <input
              type="text"
              className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-semibold text-white focus:outline-none"
              value={item.qty}
              readOnly
            />
            <button
              onClick={() => addToCart(item, 1)}
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 cursor-pointer"
            >
              +
            </button>
          </div>

          <div className="text-end md:order-4 md:w-32 space-y-1">
            {item.priceAfterSale && item.priceAfterSale < item.price ? (
              <div className="flex flex-col items-end">
                <span className="text-sm line-through opacity-70 text-white">
                  ${item.price * item.qty}
                </span>
                <span className="text-base font-bold text-white">
                  ${finalPrice * item.qty}
                </span>
              </div>
            ) : (
              <p className="text-base font-bold text-white">
                ${finalPrice * item.qty}
              </p>
            )}
          </div>
        </div>

        {/* Product Name & Actions */}
        <div className="w-full min-w-0 flex-1 space-y-2 md:order-2 md:max-w-md">
          <p className="text-base font-semibold text-white line-clamp-2 ">
            {item.name}
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => removeFromCart(item.id)}
              type="button"
              className="inline-flex items-center text-sm font-medium text-red-600 hover:underline cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
