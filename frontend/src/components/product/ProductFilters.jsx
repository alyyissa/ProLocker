import React, { useEffect, useState } from 'react'
import { getCategories } from '../../services/categories/categoriesService';
import { getColors } from '../../services/color/ColorService';
import { getSize } from '../../services/size/sizeService';

const FilterPanel = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded mb-4">
      <div
        className="bg-gray-100 px-4 py-2 cursor-pointer flex justify-between items-center"
        onClick={() => setOpen(!open)}
      >
        <h4 className="font-semibold text-sm">{title}</h4>
        <span className=' text-cocoprimary'>{open ? "−" : "+"}</span>
      </div>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
};

const ProductFilters = ({filters, setFilters}) => {
    const [categories , setCategories] = useState([]);
    const [colors, setColros] = useState([])
    const [sizes, setSizes] = useState([])

    useEffect(() =>{
        const fetchFilters = async () => {
            setCategories(await getCategories());
            setColros(await getColors());
            setSizes(await getSize());
        }
        fetchFilters()
    }, [])

    const updateFilter = (key, value) => {
        setFilters (prev => ({...prev, [key]: value}))
    }
   return (
    <aside className="w-full">
      {/* Categories */}
      <FilterPanel title="Categories" defaultOpen={true}>
        <ul>
          {categories.map(cat => (
            <li key={cat.id}>
              <button
                onClick={() => updateFilter("category", cat.slug)}
                className={`block w-full text-left px-2 py-1 rounded-md ${
                  filters.category === cat.slug ? "bg-cocoprimary text-white" : "hover:bg-gray-200"
                }`}
              >
                {cat.category} ({cat.quantity || 0})
              </button>
            </li>
          ))}
        </ul>
      </FilterPanel>

      {/* Colors */}
      <FilterPanel title="Colors">
        <ul className="flex flex-wrap gap-2">
          {colors.map(color => (
            <li key={color.id}>
              <button
                onClick={() => updateFilter("color", color.id)}
                style={{ backgroundColor: color.color.toLowerCase() }}
                className={`w-6 h-6 rounded-full border-2 ${
                  filters.color === color.id ? "border-cocoprimary" : "border-gray-300"
                }`}
              />
            </li>
          ))}
        </ul>
      </FilterPanel>

      {/* Sizes */}
      <FilterPanel title="Sizes">
        <ul className="flex flex-wrap gap-2">
          {sizes.map(size => (
            <li key={size.id}>
              <button
                onClick={() => updateFilter("size", size.id)}
                className={`px-2 py-1 border rounded ${
                  filters.size === size.id ? "bg-cocoprimary text-white" : "hover:bg-gray-200"
                }`}
              >
                {size.symbol}
              </button>
            </li>
          ))}
        </ul>
      </FilterPanel>
    </aside>
  );
}

export default ProductFilters
