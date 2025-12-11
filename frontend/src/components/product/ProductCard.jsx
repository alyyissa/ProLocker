import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const isOnSale = product.priceAfterSale && product.priceAfterSale < product.price;

  return (
    <div className="group relative cursor-pointer">
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          {isOnSale && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
              SALE
            </div>
          )}

          <img
            src={product.image}
            alt={product.name}
            className="w-full aspect-square object-cover rounded-lg bg-gray-200 group-hover:opacity-75 transition"
          />
        </Link>

      </div>

      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-semibold text-gray-900">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>

        {isOnSale ? (
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-400 line-through">${product.price}</p>
            <p className="text-sm font-bold text-cocosecondary">
              ${product.priceAfterSale}
            </p>
          </div>
        ) : (
          <p className="text-sm font-medium text-cocosecondary">
            ${product.price}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
