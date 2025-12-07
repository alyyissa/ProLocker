import { useEffect, useState } from "react";
import ProductFilters from "../components/product/ProductFilters";
import ProductCard from "../components/product/ProductCard";
import { assets } from "../assets/assets";

const Products = () => {
  const [filters, setFilters] = useState({
    category: "",
    color: "",
    size: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  const dummyProducts = [
    { id: 1, name: "Product 1", price: 50 },
    { id: 2, name: "Product 2", price: 60 },
    { id: 3, name: "Product 3", price: 70 },
    { id: 5, name: "Product 5", price: 80 },
    { id: 6, name: "Product 6", price: 80 },
    { id: 7, name: "Product 7", price: 80 },
    { id: 8, name: "Product 8", price: 80 },
    { id: 9, name: "Product 9", price: 80 },
    { id: 10, name: "Product 10", price: 80 },

  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowFilters(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="pt-[69px] md:pt-[109px] h-auto">
      <div
        className="w-full h-[228px] bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${assets.bgProducts})` }}
      >
        <h1 className="ultra-regular text-4xl md:text-5xl text-background">
          Shop Here
        </h1>
      </div>

      <div className="px-3 sm:px-4 md:px-11 lg:px-13 xl:px-12 2xl:px-16 pt-10 flex gap-6">

        {/* Desktop Filter */}
        <div className="hidden lg:block w-72 xl:w-80">
          <ProductFilters filters={filters} setFilters={setFilters} />
        </div>
        <div className="flex-1">
          {/* Mobile Filters Button */}
          <div className="w-full flex items-center justify-between mb-4 lg:hidden">
            <button
              className=" bg-cocoprimary text-white py-2 px-4 rounded-md font-medium"
              onClick={() => setShowFilters(true)}
            >
              Filters
            </button>
            <p className="text-gray-700 text-sm">
              Showing {dummyProducts.length} products
            </p>

            {/* <div className="hidden md:flex gap-2">
            </div> */}
          </div>
          {/* Overlay */}
          <div
            className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300
            ${showFilters ? "opacity-100 visible" : "opacity-0 invisible"}`}
            onClick={() => setShowFilters(false)}
          ></div>
          {/* Slide Filters */}
          <div
            className={`fixed right-0 top-0 w-64 h-full bg-white shadow-lg p-5 z-50
        transition-transform duration-300 transform pt-20 md:pt-30
        ${showFilters ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <ProductFilters filters={filters} setFilters={setFilters} />

            <button
              className="bg-cocoprimary text-white w-full py-2 rounded-md mt-4"
              onClick={() => setShowFilters(false)}
            >
              Apply Filters
            </button>
          </div>
          {/* Products */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
              {dummyProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
