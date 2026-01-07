import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProductBySlug } from "../services/products/productsService";
import SizeSelector from "../components/product/SizeSelection";
import RelatedProducts from "../components/product/RelatedProducts";
import { toast } from "react-toastify";

const ProductView = () => {
  const BACKEND_URL = import.meta.env.VITE_FOLDERS_URL_PRODUCTS;
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isImageMaximized, setIsImageMaximized] = useState(false);

  /* ================= IMAGE VIEWER STATE ================= */
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  const resetViewer = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    setScale((prev) => clamp(prev + e.deltaY * -0.001, 1, 2.5));
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => setDragging(false);

  const handleEscape = useCallback((e) => {
    if (e.key === "Escape") {
      setIsImageMaximized(false);
      resetViewer();
    }
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductBySlug(slug);

        const mainImg = data.mainImage ? `${BACKEND_URL}${data.mainImage}` : null;
        const galleryImgs = data.galleryImages && data.galleryImages.length > 0
          ? data.galleryImages.map(img => `${BACKEND_URL}${img}`)
          : [];

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
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isImageMaximized, handleEscape]);

  if (!product) return <div>Loading...</div>;

  /* ================= CART ================= */
  const increment = () => {
    if (quantity >= 2) {
      toast.warning("You cannot select more than 2 items.");
      return;
    }
    setQuantity((q) => q + 1);
  };

  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size before adding to cart.");
      return;
    }

    const variant = product.varients.find(
      (v) => v.size.id === selectedSize.id
    );

    addToCart(product, variant, quantity);
    toast.success("Product added to cart!");
  };

  return (
    <div className="pt-12 min-h-screen">
      {/* ================= IMAGE MODAL ================= */}
      {isImageMaximized && (
        <div className="fixed inset-0 z-99 bg-black/90 flex items-center justify-center">
          <button
            onClick={() => {
              setIsImageMaximized(false);
              resetViewer();
            }}
            className="absolute top-4 right-4 z-20 bg-white px-4 py-2 rounded-lg shadow"
          >
            Close
          </button>

          <div
            className="absolute inset-0"
            onClick={() => {
              setIsImageMaximized(false);
              resetViewer();
            }}
          />

          <div
            className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden"
            onWheel={handleWheel}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={selectedImage}
              alt={product.name}
              draggable={false}
              onMouseDown={handleMouseDown}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[85vw] select-none cursor-grab active:cursor-grabbing"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transition: dragging ? "none" : "transform 0.2s ease-out",
              }}
            />
          </div>
        </div>
      )}

      {/* ================= PAGE CONTENT ================= */}
      <div className="p-4">
        <div className="lg:max-w-6xl max-w-xl mx-auto">
          <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-12 max-sm:gap-8">
            <div className="w-full lg:sticky top-0">
              <div className="flex flex-row gap-2">
                <div className="flex-1 bg-gray-100">
                  <img
                    src={selectedImage}
                    alt={product.name}
                    onClick={() => setIsImageMaximized(true)}
                    className="w-full aspect-[548/712] object-cover cursor-zoom-in"
                  />
                </div>
                <div className="flex flex-col gap-3 w-16 max-sm:w-14 shrink-0">
                  {product.galleryImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      onClick={() => setSelectedImage(img)}
                      className={`aspect-[64/85] object-cover object-top w-full cursor-pointer border-b-2 ${
                        selectedImage === img
                          ? "border-black"
                          : "border-transparent"
                      }`}
                      alt={`${product.name} thumbnail ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="w-full">
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-lg font-semibold">
                {product.category?.category}
              </p>

              <div className="flex gap-4 mt-4">
                <h4 className="text-3xl font-semibold">
                  ${product.priceAfterSale || product.price}
                </h4>
                {product.sale > 0 && (
                  <strike className="text-gray-400">${product.price}</strike>
                )}
              </div>

              <div className="mt-6 flex gap-4">
                <button onClick={decrement} className="px-3 py-1 border">
                  -
                </button>
                <span className="px-3 py-1 border-y">{quantity}</span>
                <button onClick={increment} className="px-3 py-1 border">
                  +
                </button>
              </div>

              <SizeSelector
                product={product}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
              />

              <button
                onClick={handleAddToCart}
                className="mt-6 px-10 py-3 bg-tertiary text-white font-semibold"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 max-w-6xl mx-auto">
        <RelatedProducts productId={product.id} />
      </div>
    </div>
  );
};

export default ProductView;