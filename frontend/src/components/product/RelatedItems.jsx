import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { getRelatedProducts } from "../../services/products/productsService";
import ProductCard from "./ProductCard";

export default function RelatedProducts({ productId }) {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!productId) return;

    getRelatedProducts(productId).then(setRelated);
  }, [productId]);

  if (!related.length) return null;

  return (
    <section className="mt-16">
      <h2 className="text-xl font-semibold mb-6">
        Related Items
      </h2>

      <Swiper
        spaceBetween={16}
        slidesPerView={2}
        loop={true}
        breakpoints={{
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
      >
        {related.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
