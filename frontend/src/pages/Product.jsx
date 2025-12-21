// In your Products.jsx component
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom"; // Import useSearchParams
import ProductFilters from "../components/product/ProductFilters";
import ProductCard from "../components/product/ProductCard";
import { assets } from "../assets/assets";
import { getProducts } from "../services/products/productsService";
import Preloader from "../components/Preloader/Preloader";
import { Helmet } from "react-helmet-async";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
    const seoTitleParts = ["ProLocker | Shop Products"];
  const APP_URL = import.meta.env.VITE_FOLDERS_URL;

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || null,
    color: searchParams.get('color') || null,
    size: searchParams.get('size') ? parseInt(searchParams.get('size')) : null,
    onSale: searchParams.get('onSale') === 'true' || null,
    date: searchParams.get('date') || null
  });

  
  const updateURLFromFilters = useCallback((newFilters) => {
    const params = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.set(key, value.toString());
      }
    });
    
    setSearchParams(params);
  }, [setSearchParams]);

  
  useEffect(() => {
    const category = searchParams.get('category');
    const color = searchParams.get('color');
    const size = searchParams.get('size');
    const onSale = searchParams.get('onSale');
    const date = searchParams.get('date');
    
    setFilters(prev => ({
      ...prev,
      category: category || null,
      color: color || null,
      size: size ? parseInt(size) : null,
      onSale: onSale === 'true' || null,
      date: date || null
    }));
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await getProducts(filters, page, limit);
      setProducts(data.data)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  const handleSetFilters = (newFilters) => {
    setFilters(newFilters);
    updateURLFromFilters(newFilters);
    setPage(1); 
  }
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowFilters(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  useEffect(() => {
    fetchProducts();
  }, [filters, page]);

  

  if (filters.category) seoTitleParts.push(filters.category);
  if (filters.color) seoTitleParts.push(filters.color);
  if (filters.onSale) seoTitleParts.push("On Sale");

  const seoTitle = seoTitleParts.join(" | ");

  const seoDescription = filters.category
    ? `Browse ${filters.category} products${filters.color ? ` in ${filters.color}` : ""}. High quality items with fast delivery.`
    : "Browse all our products. High quality items with the best prices and fast delivery.";

    useEffect(() => {
  if (showFilters) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }

  return () => {
    document.body.style.overflow = "";
  };
}, [showFilters]);

  return (
    <>
    <Helmet>
  <title>{seoTitle}</title>
  <meta name="description" content={seoDescription} />

  <link
    rel="canonical"
    href={`${APP_URL}/products${window.location.search}`}
  />
  <meta property="og:url" content={`${APP_URL}/products${window.location.search}`} />

  {/* Open Graph */}
  <meta property="og:title" content={seoTitle} />
  <meta property="og:description" content={seoDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={`${APP_URL}/products${window.location.search}`} />
</Helmet>

    <div className="pt-[69px] md:pt-[109px] h-auto">
      <div
        className="w-full h-[228px] bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${assets.bgProducts})` }}
      >
        <h1 className="ultra-regular text-4xl md:text-5xl text-background">
          Shop Here
        </h1>
      </div>

      <div className="px-3 sm:px-4 md:px-11 lg:px-13 xl:px-12 2xl:px-16 pt-10 flex gap-6 min-h-[70dvh]">
        {/* Desktop Filter */}
        <div className="hidden lg:block w-72 xl:w-80">
          <ProductFilters filters={filters} setFilters={handleSetFilters} />
        </div>
        
        <div className="flex-1">
          {/* Show active filter summary */}
          {filters.category && (
            <div className="mb-4 p-2 bg-gray-100 rounded-md">
              <p className="text-sm">
                Showing products in category: <span className="font-semibold">{filters.category}</span>
                <button 
                  onClick={() => handleSetFilters({...filters, category: null})}
                  className="ml-2 text-red-500 hover:text-red-700 cursor-pointer font-semibold"
                >
                  ✕
                </button>
              </p>
            </div>
          )}
          
          {/* Mobile Filters Button */}
          <div className="w-full flex items-center justify-between mb-4 lg:hidden">
            <button
              className="bg-cocoprimary text-white py-2 px-4 rounded-md font-medium"
              onClick={() => setShowFilters(true)}
            >
              Filters
            </button>
            <p className="text-gray-700 text-sm">
              Showing {products.length} products
            </p>
          </div>
          
          {/* Overlay */}
          <div
            className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300
              ${showFilters ? "opacity-100 visible" : "opacity-0 invisible"}`}
            onClick={() => setShowFilters(false)}
          ></div>
          
          {/* Slide Filters */}
          <div
            className={`fixed right-0 top-0 w-64 h-full bg-white shadow-lg p-5 z-[99]
            transition-transform duration-300 transform pt-10
            overflow-y-auto overscroll-contain
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

            <ProductFilters filters={filters} setFilters={handleSetFilters} />

            <button
              className="bg-cocoprimary text-white w-full py-2 rounded-md mt-4"
              onClick={() => setShowFilters(false)}
            >
              Apply Filters
            </button>
          </div>
          
          {/* Products */}
          {loading ? (
            <Preloader show={true} />
          ) : products.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <p className="text-lg">No products found</p>
              {filters.category && (
                <p className="mt-2">
                  Try clearing the category filter or browse other categories
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              <div className="flex justify-center gap-2 mb-10 items-center">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 border rounded cursor-pointer ${page === i + 1 ? 'bg-cocoprimary text-white' : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Products;