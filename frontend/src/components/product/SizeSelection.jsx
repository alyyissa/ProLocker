import { useEffect, useState } from "react";
import { getSize } from "../../services/size/sizeService";

export default function SizeSelector({ product, selectedSize, setSelectedSize }) {
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const res = await getSize();
        setSizes(res);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSizes();
  }, []);

  const getVariant = (sizeId) => {
    return product.varients.find((v) => v.size.id === sizeId);
  };

  return (
    <div className="flex flex-wrap gap-4 mt-4">
      {sizes.map((size) => {
        const variant = getVariant(size.id);
        const isAvailable = variant && variant.quantity > 0;

        return (
          <button
            key={size.id}
            disabled={!isAvailable}
            onClick={() => isAvailable && setSelectedSize(size)}
            className={`w-10 h-10 border font-semibold text-sm rounded-full flex items-center justify-center
              ${isAvailable ? "cursor-pointer border-gray-300 hover:border-slate-800" : "opacity-40 cursor-not-allowed"}
              ${selectedSize?.id === size.id ? "bg-black text-white border-black" : ""}`}
          >
            {size.symbol}
          </button>
        );
      })}
    </div>
  );
}
