import React from "react";
import { Link, useNavigate } from "react-router-dom";


const ProductCard = ({ product }) => {
  const isOnSale = product.priceAfterSale && product.priceAfterSale < product.price;
  const navigate = useNavigate();
  const isFewLeft = product.status === "Few Left";

  return (
    <div className="group relative cursor-pointer">
      <div className="relative">
        <Link to={`/products/${product.slug}`}>
          {isOnSale && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
              SALE
            </div>
          )}

          <img
            src={product.mainImage}
            alt={product.name}
            className="w-full aspect-square object-cover rounded-lg bg-gray-200 group-hover:opacity-75 transition"
          />
        </Link>

      </div>

      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-semibold text-gray-900">
          {product.name}
        </h3>

        {isOnSale ? (
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-400 line-through">${product.price}</p>
            <p className="text-sm font-bold text-cocosecondary">
              ${product.priceAfterSale}
            </p>
          </div>
        ) : (
          <p className="text-sm font-bold text-cocosecondary">
            ${product.price}
          </p>
        )}

        {isFewLeft && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
              Few Left
            </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
