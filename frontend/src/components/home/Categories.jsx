import React, { useEffect, useState } from 'react'
import Title from '../Title'
import { getCategories } from '../../services/categories/categoriesService'
import { useNavigate } from 'react-router-dom'

const Categories = () => {
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
            {categories.map((cat) => (
                <div
                key={cat.id}
                className="border border-primary rounded-xl p-4 text-center shadow-md hover:scale-102 transition duration-300 cursor-pointer"
                data-aos ="fade-up"
                data-aos-delay='300'
                onClick={() => handleCategoryClick(cat.slug)}
                >
                    {/* <img
                    src={cat.imageUrl}
                    alt={cat.category}
                    className="w-full h-32 object-cover rounded-md mb-3"
                    /> */}
                    <h3 className="font-semibold text-lg">{cat.category}</h3>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Categories
