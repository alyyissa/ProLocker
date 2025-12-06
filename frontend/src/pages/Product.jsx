import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { getProducts } from '../services/products/productsService';
import ProductFilters from '../components/product/ProductFilters';

const Product = () => {
    const [filters, setFilters] = useState({
        category: null,
        size: null,
        color: null,
    })
    const [products, setProducts] = useState([]);
    const [loading, setLodaing] = useState(false);

    const fetchProducts = async () =>{
        setLodaing(true);
        try {
            const response = await getProducts(filters,1,12)
            setProducts(response.data.data)
        } catch (error) {
            console.log(error)
        }finally{
            setLodaing(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [filters])
return (
    <div className='pt-[69px] md:pt-[109px] h-screen'>
        <div className='w-full h-[228px] bg-center flex items-center justify-center'style={{ backgroundImage: `url(${assets.bgProducts})`}}>
            <h1 className='ultra-regular text-4xl md:text-5xl text-background'>Shop Here</h1>
        </div>
        <div className='px-3 sm:px-4 md:px-11 lg:px-13 xl:px-12 2xl:px-16 pt-10'>
            <ProductFilters filters={filters} setFilters={setFilters}/>
        </div>
    </div>
)
}

export default Product
