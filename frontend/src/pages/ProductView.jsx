import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProductBySlug } from "../services/products/productsService";
import SizeSelector from "../components/product/SizeSelection";

const ProductView = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(null);

  const dummyGallery = [
    "https://readymadeui.com/images/dark-green-tshirt-1.webp",
    "https://readymadeui.com/images/dark-green-tshirt-2.webp",
    "https://readymadeui.com/images/dark-green-tshirt-3.webp",
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductBySlug(slug);

        if (!data.galleryImages || data.galleryImages.length === 0) {
          data.galleryImages = dummyGallery;
        }

        setProduct(data);
        setSelectedImage(data.mainImage || data.galleryImages[0]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [slug]);

  if (!product) return <div>Loading...</div>;

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size!");
      return;
    }

    const variant = product.varients.find(
      (v) => v.size.id === selectedSize.id
    );

    addToCart(product, variant, quantity);
  };

  return (
    <div className="pt-[69px] md:pt-[109px] px-3 sm:px-4 md:px-11 lg:px-13 xl:px-12 2xl:px-16 min-h-[94dvh]">
      <div className="lg:max-w-6xl max-w-xl mx-auto py-10">
        <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-12 max-sm:gap-8">
          {/* Images */}
          <div className="w-full lg:sticky top-0">
            <div className="flex flex-row gap-2">
              <div className="flex-1 bg-gray-100">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full aspect-548/712 object-cover"
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
              {product.name} | {product.category?.category || "No category"}
            </h3>
            <p className="text-slate-500 mt-1 text-sm ">Delivery Price Added at checkout</p>

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
              <button
                onClick={handleAddToCart}
                className="px-4 py-3 w-[45%] border border-blue-600 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium cursor-pointer"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
