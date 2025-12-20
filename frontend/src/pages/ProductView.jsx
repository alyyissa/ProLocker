import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProductBySlug } from "../services/products/productsService";
import SizeSelector from "../components/product/SizeSelection";
import RelatedProducts from "../components/product/RelatedProducts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProductView = () => {
  const BACKEND_URL = import.meta.env.VITE_API_URL;
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(null);
  const [isImageMaximized, setIsImageMaximized] = useState(false);
  const navigate = useNavigate();
  
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') {
      setIsImageMaximized(false);
    }
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductBySlug(slug);

        const mainImg = data.mainImage ? `${BACKEND_URL}${data.mainImage}` : null;
        const galleryImgs = data.galleryImages && data.galleryImages.length > 0
          ? data.galleryImages.map(img => `${BACKEND_URL}${img}`)
          : dummyGallery;

        setProduct({
          ...data,
          mainImage: mainImg,
          galleryImages: mainImg ? [mainImg, ...galleryImgs] : galleryImgs
        });

        setSelectedImage(mainImg || galleryImgs[0]);
      } catch (err) {
        console.error(err);
        navigate('/404');
      }
    };

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (isImageMaximized) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isImageMaximized, handleEscape]);

  if (!product) return <div>Loading...</div>;

  const increment = () => {
    if (quantity >= 2) {
      toast.warning("You cannot select more than 2 items.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    setQuantity(q => q + 1);
  };
  const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size before adding to cart.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const variant = product.varients.find(
      (v) => v.size.id === selectedSize.id
    );

    toast.success("Product added to cart!", {
      position: "top-right",
      autoClose: 3000,
    });
    
    addToCart(product, variant, quantity);
  };

  return (
    <div className="pt-[69px] md:pt-[109px] px-3 sm:px-4 md:px-11 lg:px-13 xl:px-12 2xl:px-16 min-h-[94dvh]">
      {/* Maximized Image Modal with Close Button */}
      {isImageMaximized && (
        <div className="fixed inset-0 z-99 flex items-center justify-center bg-black/90 p-4">
          {/* Top Close Button */}
          <button
            onClick={() => setIsImageMaximized(false)}
            className="absolute top-4 right-4 z-20 flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-black rounded-lg font-medium text-sm shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer"
            aria-label="Close zoom"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
            Close (ESC)
          </button>
          
          {/* Bottom Instruction */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden lg:block">
            <p className="text-black/70 text-sm text-center">
              Click anywhere or press <kbd className="px-2 py-1 bg-black/20 rounded text-xs">ESC</kbd> to close
            </p>
          </div>
          
          {/* Clickable Overlay */}
          <button
            onClick={() => setIsImageMaximized(false)}
            className="absolute inset-0 z-10"
            aria-label="Close zoom"
          />
          
          {/* Image Container */}
          <div className="relative z-10 max-h-[90vh] max-w-[90vw]">
            <img
              src={selectedImage}
              alt={product.name}
              className="h-auto w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <div className="lg:max-w-6xl max-w-xl mx-auto pt-10">
        <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-12 max-sm:gap-8">
          {/* Images */}
          <div className="w-full lg:sticky top-0">
            <div className="flex flex-row gap-2">
              <div className="flex-1 bg-gray-100 relative group">
                {/* Maximize Button */}
                <button
                  onClick={() => setIsImageMaximized(true)}
                  className="cursor-pointer absolute top-2 left-2 z-10 rounded-md bg-black/50 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70 focus:opacity-100 focus:outline-none"
                  aria-label="Maximize image"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                  </svg>
                </button>
                
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full aspect-548/712 object-cover cursor-zoom-in"
                  onClick={() => setIsImageMaximized(true)}
                />
              </div>
              <div className="flex flex-col gap-3 w-16 max-sm:w-14 shrink-0">
                {product.galleryImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name}-${index}`}
                    className={`aspect-64/85 object-cover object-top w-full cursor-pointer border-b-2 ${
                      selectedImage === img ? "border-black" : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
              {product.name}
            </h3>
            <p className="text-md sm:text-lg font-semibold text-slate-900">{product.category?.category || "No category"}</p>
            <p className="text-slate-500 mt-1 text-sm ">Delivery fees added at checkout</p>

            <div className="flex items-center flex-wrap gap-4 mt-4">
              <h4 className="text-slate-900 text-2xl sm:text-3xl font-semibold">
                ${product.priceAfterSale || product.price}
              </h4>
              {product.sale > 0 && (
                <p className="text-slate-500 text-lg">
                  <strike>${product.price}</strike>
                </p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={decrement}
                className="px-3 py-1 border border-gray-300 text-slate-900 cursor-pointer"
              >
                -
              </button>
              <span className="px-3 py-1 border-t border-b border-gray-300">{quantity}</span>
              <button
                onClick={increment}
                className="px-3 py-1 border border-gray-300 text-slate-900 cursor-pointer"
              >
                +
              </button>
            </div>
            

            <SizeSelector product={product} selectedSize={selectedSize} setSelectedSize={setSelectedSize}/>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-4">
              <p className="text-sm text-primary font-semibold">You cant select more than two pieces from each size!</p>
              <button
                onClick={handleAddToCart}
                className="px-4 py-3 w-[45%] border bg-tertiary hover:bg-tertiary-hover text-white text-sm font-semibold cursor-pointer transition duration-300"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-10 lg:max-w-6xl max-w-xl mx-auto">
        <RelatedProducts productId={product.id}/>
      </div>
    </div>
  );
};

export default ProductView;