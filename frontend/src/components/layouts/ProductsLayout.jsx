import React from 'react'
import { assets } from '../../assets/assets'
import { Outlet } from 'react-router-dom'

const ProductsLayout = () => {
return (
    <div className='pt-[69px] md:pt-[109px] h-screen'>
        <div className='w-full h-[228px] bg-center flex items-center justify-center'style={{ backgroundImage: `url(${assets.bgProducts})`}}>
            <h1 className='ultra-regular text-4xl md:text-5xl text-background'>Shop Here</h1>
        </div>
        <Outlet />
    </div>
)
}

export default ProductsLayout
