import React from 'react'
import AddProduct from './adminProduct/AddProduct'
import ProductVariant from './adminProduct/ProductVariant'
import ProductList from './adminProduct/ProductList'

const Products = () => {
  return (
    <div>
        <AddProduct />
        <ProductVariant />
        <ProductList />
    </div>
  )
}

export default Products
