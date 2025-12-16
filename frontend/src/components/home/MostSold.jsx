import React,{useEffect, useState} from 'react'
import Title from '../Title'
import ProductCard from '../product/ProductCard';
import { getMostSoldProducts } from '../../services/products/productsService';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { useNavigate } from 'react-router-dom';
import AOS from 'aos'
import 'aos/dist/aos.css';

const MostSold = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate()
    useEffect(() => {
        const fetchProducts = async () => {
        try {
            const data = await getMostSoldProducts();
            setProducts(data);
        } catch (err) {
            console.error(err);
        }
        };
        fetchProducts();
    }, []);

    const handleExploreMore = () => {
        navigate('/products')
    }
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
        });
        }, []);
    if (!products.length) return null;
  return (
    <>
        <Title 
        title="Best Sold"
        subtitle="Here are the top sold items sold in our store"
        />
        <div className="mt-10 w-full px-3 sm:px-4 md:px-11 lg:px-13 xl:px-12 2xl:px-16 mb-10"  data-aos="fade-up" data-aos-delay="200">
            <Swiper
                slidesPerView={1}
                spaceBetween={10}
                loop={true}
                navigation
                pagination={{ clickable: true,  el: ".swiper-pagination-custom", }}
                breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 15 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 25 },
                }}
                modules={[Navigation, Pagination]}
            >
                {products.map((product) => (
                <SwiperSlide key={product.id}>
                    <ProductCard product={product} />
                </SwiperSlide>
                ))}
            </Swiper>
            <div className='flex items-center justify-center mt-5'>
                <button
                        onClick={handleExploreMore}
                        className="px-6 py-3 rounded-md font-medium transition-all duration-300 cursor-pointer"
                        style={{
                            backgroundColor: 'var(--color-tertiary)',
                            color: 'white',
                            border: 'none',
                            outline: 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'var(--color-tertiary-hover)'; // #1d4ed8
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'var(--color-tertiary)'; // #2563eb
                        }}
                    >
                        Explore More
                    </button>
                </div>
        </div>
    </>
  )
}

export default MostSold
