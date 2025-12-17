import React, { useEffect, useState } from "react";
import { getCategories } from "../../services/categories/categoriesService";
import { getColors } from "../../services/color/ColorService";
import { getSize } from "../../services/size/sizeService";

const FilterPanel = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-300 pb-2 mb-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <h4 className="text-slate-900 text-base font-semibold">{title}</h4>
        <svg
          className={`w-3.5 h-3.5 fill-slate-800 transition-transform duration-300 ${
            open ? "rotate-90" : "-rotate-90"
          }`}
          viewBox="0 0 492.004 492.004"
        >
          <path d="M382.678 226.804 163.73 7.86C158.666 2.792 151.906 0 144.698 0s-13.968 2.792-19.032 7.86l-16.124 16.12c-10.492 10.504-10.492 27.576 0 38.064L293.398 245.9l-184.06 184.06c-5.064 5.068-7.86 11.824-7.86 19.028 0 7.212 2.796 13.968 7.86 19.04l16.124 16.116c5.068 5.068 11.824 7.86 19.032 7.86s13.968-2.792 19.032-7.86L382.678 265c5.076-5.084 7.864-11.872 7.848-19.088.016-7.244-2.772-14.028-7.848-19.108z"/>
        </svg>
      </div>
      <div
        className={`transition-all duration-300 overflow-hidden ${
          open ? "max-h-[1000px] opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const ProductFilters = ({ filters, setFilters }) => {
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    const fetchFilters = async () => {
      setCategories(await getCategories());
      setColors(await getColors());
      setSizes(await getSize());
    };
    fetchFilters();
  }, []);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  };

  const clearAll = () => {
    setFilters({ category: null, color: null, size: null, onSale: null, date: null });
  };

  return (
    <div className="bg-white w-full border-gray-300 p-4">
      {/* Header with Clear all */}
      <div className="flex items-center border-b border-gray-300 pb-2 mb-4">
        <h3 className="text-slate-900 text-lg font-semibold">Filter</h3>
        <button
          onClick={clearAll}
          className="text-sm text-red-500 font-semibold ml-auto cursor-pointer"
        >
          Clear all
        </button>
      </div>

      {/* Category */}
      <FilterPanel title="Category" defaultOpen={true}>
        <div className="flex flex-col gap-2 mt-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter("category", cat.slug)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-sm text-sm font-medium ${
                filters.category === cat.slug
                  ? "bg-cocoprimary text-white border-cocoprimary"
                  : "bg-gray-50 text-slate-600 border-gray-300 hover:bg-white"
              }`}
            >
              {cat.category} ({cat.quantity || 0})
            </button>
          ))}
        </div>
      </FilterPanel>

      {/* Sizes */}
      <FilterPanel title="Size">
        <div className="flex flex-wrap gap-2 mt-2">
          {sizes.map((size) => (
            <button
              key={size.id}
              onClick={() => updateFilter("size", size.id)}
              className={`px-2 py-1 border rounded text-sm font-medium ${
                filters.size === size.id
                  ? "bg-cocoprimary text-white border-cocoprimary"
                  : "border-gray-300 text-slate-600 hover:border-blue-600"
              }`}
            >
              {size.symbol}
            </button>
          ))}
        </div>
      </FilterPanel>

      {/* Colors */}
      <FilterPanel title="Color">
        <div className="flex flex-wrap gap-2 mt-2">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => updateFilter("color", color.color)}
              style={{ backgroundColor: color.color.toLowerCase() }}
              className={`w-8 h-8 rounded-full border-2 ${
                filters.color === color.id
                  ? "border-cocoprimary"
                  : "border-gray-300"
              } hover:scale-105 transition-transform`}
            />
          ))}
        </div>
      </FilterPanel>
      
      {/** OnSale */}
      <FilterPanel title="Sale">
        <div className="flex flex-col gap-2 mt-2">
          <button
            onClick={() => updateFilter("onSale", true)}
            className={`px-3 py-2 border rounded-sm text-sm font-medium ${
              filters.onSale
                ? "bg-cocoprimary text-white border-cocoprimary"
                : "bg-gray-50 text-slate-600 border-gray-300 hover:bg-white"
            }`}
          >
            On Sale Only
          </button>
        </div>
      </FilterPanel>
      
      {/** Date newest */}
      <FilterPanel title="Sort">
        <div className="flex flex-col gap-2 mt-2">
          <button
            onClick={() => updateFilter("date", "latest")}
            className={`px-3 py-2 border rounded-sm text-sm font-medium ${
              filters.date === "latest"
                ? "bg-cocoprimary text-white border-cocoprimary"
                : "bg-gray-50 text-slate-600 border-gray-300 hover:bg-white"
            }`}
          >
            Newest
          </button>

          <button
            onClick={() => updateFilter("date", "oldest")}
            className={`px-3 py-2 border rounded-sm text-sm font-medium ${
              filters.date === "oldest"
                ? "bg-cocoprimary text-white border-cocoprimary"
                : "bg-gray-50 text-slate-600 border-gray-300 hover:bg-white"
            }`}
          >
            Oldest
          </button>
        </div>
      </FilterPanel>
    </div>
  );
};

export default ProductFilters;
