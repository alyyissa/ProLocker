import React, { useEffect, useState } from 'react'
import Title from '../Title'
import { getCategories } from '../../services/categories/categoriesService'
import { useNavigate } from 'react-router-dom'

const Categories = () => {
    const BACKEND_URL = import.meta.env.VITE_FOLDERS_URL;
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    useEffect(() => {
        const fetchCategories = async () => {
            try{
                const data = await getCategories();
                setCategories(data)
            }catch(err){
                console.log(err)
            }finally{
                setLoading(false)
            }
        };
        fetchCategories();
    }, [])

    const handleCategoryClick = (categorySlug) => {
        navigate(`/products?category=${categorySlug}`)
    }

    if(loading) return <p>Loading Categories</p>
  return (
    <div className='w-full px-3 sm:px-4 md:px-11 lg:px-13 xl:px-12 2xl:px-16 mt-20'>
        <Title
        title="Categories"
        subtitle="Shop products by category"
        />
        <div className="cig__grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-4 mt-5">
  {categories.map((cat) => (
    <div
      key={cat.id}
      className="cig__item group relative border border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all duration-300"
      data-aos="fade-up"
      data-aos-delay="300"
      onClick={() => handleCategoryClick(cat.slug)}
    >
      <div className="cig__media mb-3 aspect-square overflow-hidden rounded-lg bg-gray-50">
        <img
          src={`${BACKEND_URL}${cat.mainImage}`}
          alt={cat.category}
          width="300"
          height="300"
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      
      <p className="cig__title text-gray-800 group-hover:text-primary transition-colors duration-300">
        {cat.category}
      </p>
    </div>
  ))}
</div>
    </div>
  )
}

export default Categories
