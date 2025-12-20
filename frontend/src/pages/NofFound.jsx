import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[94dvh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl sm:text-8xl mb-4 ultra-regular text-primary">404</h1>
      <p className="text-xl sm:text-2xl mb-6 ultra-regular text-primary">
        Oops! Page not found.
      </p>
      <button
        onClick={() => navigate("/products")}
        className="px-6 py-3 bg-tertiary text-white rounded-md hover:bg-tertiary-hover transition duration-300 ultra-regular cursor-pointer"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default NotFound;
