import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="group relative">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full aspect-square object-cover rounded-lg bg-gray-200 group-hover:opacity-75"
        />
      </Link>

      <div className="mt-3">
        <h3 className="text-sm font-semibold text-gray-900">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="text-sm font-medium text-cocosecondary">
          ${product.price}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
