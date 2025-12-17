import React, { useState, useEffect } from 'react';
import { getCategories } from '../../../services/categories/categoriesService';
import { getColors } from '../../../services/color/ColorService';
import { getSize } from '../../../services/size/sizeService';
import { createProduct } from '../../../services/products/productsService';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    sale: '',
    mainImage: '',
    galleryImages: ['', '', '', ''],
    status: 'ACTIVE',
    colorId: '',
    genderId: '',
    categoryId: ''
  });

  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [categoriesData, colorsData, sizesData] = await Promise.all([
          getCategories(),
          getColors(),
          getSize()
        ]);
        
        setCategories(categoriesData);
        setColors(colorsData);
        setSizes(sizesData);
      } catch (err) {
        setError('Failed to load dropdown data');
        console.error('Error fetching dropdown data:', err);
      }
    };

    fetchDropdownData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGalleryImageChange = (index, value) => {
    const newGalleryImages = [...formData.galleryImages];
    newGalleryImages[index] = value;
    setFormData(prev => ({
      ...prev,
      galleryImages: newGalleryImages
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload the file to a server
      // and get back a URL. For now, we'll create a local URL.
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        mainImage: imageUrl
      }));
    }
  };

  // Handle gallery file upload
  const handleGalleryFileUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      handleGalleryImageChange(index, imageUrl);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccess('');

  try {
    // Validate all required fields
    const requiredFields = [
      { field: 'name', value: formData.name, message: 'Product name is required' },
      { field: 'price', value: formData.price, message: 'Price is required' },
      { field: 'colorId', value: formData.colorId, message: 'Please select a color' },
      { field: 'categoryId', value: formData.categoryId, message: 'Please select a category' }
    ];

    for (const { field, value, message } of requiredFields) {
      if (!value && value !== 0) { // Allow 0 as valid
        throw new Error(message);
      }
    }

    // Prepare data for API with proper parsing
    const productData = {
      name: formData.name,
      price: parseInt(formData.price),
      sale: formData.sale ? parseInt(formData.sale) : 0,
      status: 'Out of Stock', // Hardcode to match your backend enum
      colorId: parseInt(formData.colorId),
      genderId: parseInt(formData.genderId) || 1,
      categoryId: parseInt(formData.categoryId),
      // Comment out images for now
      // mainImage: formData.mainImage,
      // galleryImages: formData.galleryImages.filter(img => img.trim() !== '')
    };


    // Call API
    const response = await createProduct(productData);
    
    setSuccess('Product added successfully!');
    
    // Reset form
    setFormData({
      name: '',
      price: '',
      sale: '',
      mainImage: '',
      galleryImages: ['', '', '', ''],
      status: 'Available',
      colorId: '',
      genderId: 1, // Reset to default value
      categoryId: ''
    });

  } catch (err) {
    if (err.message && err.message.startsWith('Please select') || err.message.includes('is required')) {
      setError(err.message);
    } else {
      setError(err.response?.data?.message || 'Failed to add product');
    }
    console.error('Error creating product:', err);
    console.error('Error details:', err.response?.data);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="py-10 flex flex-col justify-between bg-white">
      <div className="max-w-4xl mx-auto w-full px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Product Images Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Product Images</h2>
            
            {/* Main Image */}
            <div className="mb-6">
              <label className="text-base font-medium block mb-2">Main Product Image *</label>
              <div className="flex items-center gap-4">
                {formData.mainImage ? (
                  <div className="relative">
                    <img 
                      src={formData.mainImage} 
                      alt="Main product" 
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, mainImage: '' }))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label htmlFor="mainImage" className="cursor-pointer">
                    <input 
                      type="file" 
                      id="mainImage" 
                      accept="image/*" 
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition">
                      <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-gray-500">Upload</span>
                    </div>
                  </label>
                )}
                <div>
                  <p className="text-sm text-gray-600">Main product image (required)</p>
                  <p className="text-xs text-gray-500 mt-1">Recommended size: 800x800px</p>
                </div>
              </div>
            </div>

            {/* Gallery Images */}
            <div>
              <p className="text-base font-medium mb-2">Gallery Images</p>
              <p className="text-sm text-gray-600 mb-4">Add up to 4 additional images</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {formData.galleryImages.map((image, index) => (
                  <div key={index} className="relative">
                    {image ? (
                      <>
                        <img 
                          src={image} 
                          alt={`Gallery ${index + 1}`} 
                          className="w-full h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleGalleryImageChange(index, '')}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <label htmlFor={`galleryImage${index}`} className="cursor-pointer block">
                        <input 
                          type="file" 
                          id={`galleryImage${index}`} 
                          accept="image/*" 
                          onChange={(e) => handleGalleryFileUpload(index, e)}
                          className="hidden"
                        />
                        <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition">
                          <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-xs text-gray-500">Image {index + 1}</span>
                        </div>
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Information Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Product Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="flex flex-col gap-1">
                <label className="text-base font-medium" htmlFor="name">
                  Product Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className="outline-none py-2.5 px-3 rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                  minLength="3"
                />
                <span className="text-xs text-gray-500">Minimum 3 characters</span>
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1">
                <label className="text-base font-medium" htmlFor="categoryId">
                  Category *
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="outline-none py-2.5 px-3 rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color */}
              <div className="flex flex-col gap-1">
                <label className="text-base font-medium" htmlFor="colorId">
                    Color *
                </label>
                <select
                    id="colorId"
                    name="colorId"
                    value={formData.colorId}
                    onChange={handleInputChange}
                    className="outline-none py-2.5 px-3 rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                >
                    <option value="">Select Color</option>
                    {colors.map((color) => (
                    <option key={color.id} value={color.id}>
                        {color.color}
                    </option>
                    ))}
                </select>
                </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Product Price */}
              <div className="flex flex-col gap-1">
                <label className="text-base font-medium" htmlFor="price">
                  Product Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className="outline-none py-2.5 px-3 pl-8 rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
                    required
                  />
                </div>
              </div>

              {/* Sale/Discount */}
              <div className="flex flex-col gap-1">
                <label className="text-base font-medium" htmlFor="sale">
                  Discount (%)
                </label>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  <input
                    id="sale"
                    name="sale"
                    type="number"
                    value={formData.sale}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    max="100"
                    className="outline-none py-2.5 px-3 pr-8 rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
                  />
                </div>
                <span className="text-xs text-gray-500">0-100%</span>
              </div>

              {/* Calculated Sale Price */}
              <div className="flex flex-col gap-1">
                <label className="text-base font-medium">Sale Price</label>
                <div className="py-2.5 px-3 rounded border border-gray-300 bg-white">
                  <p className="text-gray-700">
                    ${formData.price && formData.sale 
                      ? ((parseFloat(formData.price) * (100 - parseFloat(formData.sale))) / 100).toFixed(2)
                      : formData.price || '0.00'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding Product...
                </span>
              ) : (
                'ADD PRODUCT'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;