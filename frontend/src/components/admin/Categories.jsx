import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getColors } from '../../services/color/ColorService';
import { getCategories } from '../../services/categories/categoriesService';
import api from '../../services/api';

const Categories = () => {
  // Categories state
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    imageFile: null
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(false);
  
  const BACKEND_URL = import.meta.env.VITE_FOLDERS_URL;
  // Colors state
  const [colors, setColors] = useState([]);
  const [newColor, setNewColor] = useState('');
  const [editingColor, setEditingColor] = useState(null);
  const [loadingColors, setLoadingColors] = useState(false);
  
  // Banner state
  const [banner, setBanner] = useState(null);
  const [bannerText, setBannerText] = useState('');
  const [bannerActive, setBannerActive] = useState(true);
  const [loadingBanner, setLoadingBanner] = useState(false);
  
  // Delivery state
  const [delivery, setDelivery] = useState(null);
  const [deliveryName, setDeliveryName] = useState('');
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [loadingDelivery, setLoadingDelivery] = useState(false);
  
  // Active tab state
  const [activeTab, setActiveTab] = useState('categories');

  // Load initial data
  useEffect(() => {
    loadCategories();
    loadColors();
    loadBanner();
    loadDelivery();
  }, []);

  // ========== CATEGORIES FUNCTIONS ==========
  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const handleAddCategory = async () => {
  if (!newCategory.name.trim()) {
    toast.error('Category name is required');
    return;
  }

  try {
    setLoadingCategories(true);

    const formData = new FormData();
    formData.append('category', newCategory.name.trim());

    if (newCategory.imageFile) {
      formData.append('mainImage', newCategory.imageFile);
    }

    await api.post('/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    toast.success('Category added successfully');
    setNewCategory({ name: '', imageFile: null });
    loadCategories();

  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to add category';

    toast.error(`Error: ${errorMessage}`);
  } finally {
    setLoadingCategories(false);
  }
};


  const handleUpdateCategory = async (id, updatedData) => {
  if (!updatedData.name.trim()) {
    toast.error('Category name is required');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('category', updatedData.name.trim());

    // Only append the image file if a new one is selected
    if (updatedData.imageFile) {
      formData.append('mainImage', updatedData.imageFile);
    }

    await api.patch(`/categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    toast.success('Category updated successfully');
    setEditingCategory(null);
    loadCategories();

  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Failed to update category';
    toast.error(`Error: ${errorMessage}`);
  }
};

  const handleDeleteCategory = async (id, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete "${categoryName}"?`)) return;

    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted successfully');
      loadCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  // ========== COLORS FUNCTIONS ==========
  const loadColors = async () => {
    try {
      const data = await getColors();
      setColors(data);
    } catch (error) {
      toast.error('Failed to load colors');
    }
  };

  const handleAddColor = async () => {
    if (!newColor.trim()) {
      toast.error('Color name is required');
      return;
    }

    try {
      setLoadingColors(true);
      await api.post('/colors', { color: newColor.trim() });
      toast.success('Color added successfully');
      setNewColor('');
      loadColors();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add color');
    } finally {
      setLoadingColors(false);
    }
  };

  const handleUpdateColor = async (id, newName) => {
    if (!newName.trim()) {
      toast.error('Color name is required');
      return;
    }

    try {
      await api.patch(`/colors/${id}`, { color: newName.trim() });
      toast.success('Color updated successfully');
      setEditingColor(null);
      loadColors();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update color');
    }
  };

  const handleDeleteColor = async (id, colorName) => {
    if (!window.confirm(`Are you sure you want to delete "${colorName}"?`)) return;

    try {
      await api.delete(`/colors/${id}`);
      toast.success('Color deleted successfully');
      loadColors();
    } catch (error) {
      toast.error('Failed to delete color');
    }
  };

  // ========== BANNER FUNCTIONS ==========
  const loadBanner = async () => {
    try {
      const response = await api.get('/banner/active');
      if (response.data) {
        setBanner(response.data);
        setBannerText(response.data.text);
        setBannerActive(response.data.isActive);
      }
    } catch (error) {
      console.log('No active banner found');
    }
  };

  const handleSaveBanner = async () => {
    if (!bannerText.trim()) {
      toast.error('Banner text is required');
      return;
    }

    try {
      setLoadingBanner(true);
      
      if (banner) {
        // Update existing banner
        await api.patch(`/banner/${banner.id}`, {
          text: bannerText.trim(),
          isActive: bannerActive
        });
        toast.success('Banner updated successfully');
      } else {
        // Create new banner
        await api.post('/banner', {
          text: bannerText.trim(),
          isActive: bannerActive
        });
        toast.success('Banner created successfully');
      }
      
      loadBanner();
    } catch (error) {
      toast.error('Failed to save banner');
    } finally {
      setLoadingBanner(false);
    }
  };

  const handleToggleBanner = async () => {
    if (!banner) return;
    
    try {
      setLoadingBanner(true);
      const newStatus = !bannerActive;
      await api.patch(`/banner/${banner.id}`, {
        text: bannerText.trim(),
        isActive: newStatus
      });
      setBannerActive(newStatus);
      toast.success(`Banner ${newStatus ? 'activated' : 'deactivated'}`);
      loadBanner();
    } catch (error) {
      toast.error('Failed to update banner status');
    } finally {
      setLoadingBanner(false);
    }
  };

  // ========== DELIVERY FUNCTIONS ==========
  const loadDelivery = async () => {
    try {
      const response = await api.get('/delivery');
      if (response.data && response.data.length > 0) {
        const firstDelivery = response.data[0];
        setDelivery(firstDelivery);
        setDeliveryName(firstDelivery.name);
        setDeliveryPrice(firstDelivery.price);
      }
    } catch (error) {
      console.log('No delivery found');
    }
  };

  const handleSaveDelivery = async () => {
    if (!deliveryName.trim()) {
      toast.error('Delivery name is required');
      return;
    }

    if (deliveryPrice < 0) {
      toast.error('Delivery price cannot be negative');
      return;
    }

    try {
      setLoadingDelivery(true);
      
      if (delivery) {
        // Update existing delivery
        await api.patch(`/delivery/${delivery.id}`, {
          name: deliveryName.trim(),
          price: parseFloat(deliveryPrice)
        });
        toast.success('Delivery updated successfully');
      } else {
        // Create new delivery
        await api.post('/delivery', {
          name: deliveryName.trim(),
          price: parseFloat(deliveryPrice)
        });
        toast.success('Delivery created successfully');
      }
      
      loadDelivery();
    } catch (error) {
      toast.error('Failed to save delivery');
    } finally {
      setLoadingDelivery(false);
    }
  };

  // SVG Icons
  const CategoryIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );

  const ColorIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  );

  const BannerIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  );

  const DeliveryIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );

  const PlusIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  );

  const EditIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );

  const DeleteIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  const ImageIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const LoadingSpinner = () => (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Settings</h1>
        <p className="text-gray-600 mt-2">Manage categories, colors, banner, and delivery</p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-3 font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'categories'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <CategoryIcon />
          Categories ({categories.length})
        </button>
        
        <button
          onClick={() => setActiveTab('colors')}
          className={`px-4 py-3 font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'colors'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ColorIcon />
          Colors ({colors.length})
        </button>
        
        <button
          onClick={() => setActiveTab('banner')}
          className={`px-4 py-3 font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'banner'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BannerIcon />
          Banner
        </button>
        
        <button
          onClick={() => setActiveTab('delivery')}
          className={`px-4 py-3 font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'delivery'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <DeliveryIcon />
          Delivery
        </button>
      </div>

      {/* Categories Tab - Keep existing categories code */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-lg shadow">
          {/* Add Category Form */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Category</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="Enter category name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1">
                    <ImageIcon />
                    Category Image
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      imageFile: e.target.files[0],
                    })
                  }
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty if you don't have an image
                </p>
              </div>
              
              <button
                onClick={handleAddCategory}
                disabled={loadingCategories || !newCategory.name.trim()}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {loadingCategories ? (
                  <>
                    <LoadingSpinner />
                    Adding Category...
                  </>
                ) : (
                  <>
                    <PlusIcon />
                    Add Category
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">All Categories</h3>
            
            {categories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No categories found. Add your first category above.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div 
                    key={category.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    {editingCategory?.id === category.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category Name *
                          </label>
                          <input
                            type="text"
                            value={editingCategory.name}
                            onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                            className="w-full px-3 py-2 border border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            autoFocus
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <span className="flex items-center gap-1">
                              <img src={editingCategory.mainImage} alt="" />
                            </span>
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              setEditingCategory({
                                ...editingCategory,
                                imageFile: e.target.files[0],
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateCategory(category.id, editingCategory)}
                            className="flex-1 px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded hover:bg-green-600 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCategory(null)}
                            className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900 text-lg">
                              {category.category || category.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-400">
                                Slug: {category.slug}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            <button
                              onClick={() => setEditingCategory({ 
                                id: category.id, 
                                name: category.category || category.name,
                                imageUrl: category.mainImage || ''
                              })}
                              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                              title="Edit category"
                            >
                              <EditIcon />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(
                                category.id, 
                                category.category || category.name
                              )}
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                              title="Delete category"
                            >
                              <DeleteIcon />
                            </button>
                          </div>
                        </div>
                        
                        {category.mainImage && (
                          <div className="mb-3">
                            <div className="h-32 w-full rounded-lg overflow-hidden bg-gray-100">
                              <img 
                                src={`${BACKEND_URL}${category.mainImage}`} 
                                alt={category.category || category.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon /></div>';
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Colors Tab - Keep existing colors code */}
      {activeTab === 'colors' && (
        <div className="bg-white rounded-lg shadow">
          {/* Add Color Form */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Color</h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="Enter color name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleAddColor()}
              />
              <button
                onClick={handleAddColor}
                disabled={loadingColors || !newColor.trim()}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {loadingColors ? (
                  <>
                    <LoadingSpinner />
                    Adding...
                  </>
                ) : (
                  <>
                    <PlusIcon />
                    Add Color
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Colors List */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">All Colors</h3>
            
            {colors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No colors found. Add your first color above.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {colors.map((color) => (
                  <div 
                    key={color.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    {editingColor?.id === color.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editingColor.name}
                          onChange={(e) => setEditingColor({...editingColor, name: e.target.value})}
                          className="w-full px-3 py-2 border border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateColor(color.id, editingColor.name);
                            if (e.key === 'Escape') setEditingColor(null);
                          }}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateColor(color.id, editingColor.name)}
                            className="flex-1 px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded hover:bg-green-600 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingColor(null)}
                            className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900 text-lg">
                              {color.color || color.name}
                            </h4>
                            <div className="mt-1">
                              <span className="text-xs text-gray-400">
                                Slug: {color.slug}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            <button
                              onClick={() => setEditingColor({ 
                                id: color.id, 
                                name: color.color || color.name 
                              })}
                              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                              title="Edit color"
                            >
                              <EditIcon />
                            </button>
                            <button
                              onClick={() => handleDeleteColor(
                                color.id, 
                                color.color || color.name
                              )}
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                              title="Delete color"
                            >
                              <DeleteIcon />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Banner Tab */}
      {activeTab === 'banner' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <BannerIcon />
            Site Banner Management
          </h2>
          
          <div className="max-w-2xl">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Text *
                <span className="text-gray-500 text-sm font-normal ml-2">
                  This text will be displayed at the top of the site
                </span>
              </label>
              <textarea
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                placeholder="Enter your banner message here..."
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                Maximum 255 characters
              </p>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Banner Status</p>
                  <p className="text-sm text-gray-600">
                    {bannerActive 
                      ? 'Banner is currently visible to users' 
                      : 'Banner is hidden from users'}
                  </p>
                </div>
                <button
                  onClick={handleToggleBanner}
                  disabled={loadingBanner || !banner}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    bannerActive
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  } disabled:opacity-50`}
                >
                  {bannerActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
            
            {/* Banner Preview */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Preview</h3>
              <div className={`border rounded-lg overflow-hidden ${
                bannerActive ? 'border-green-200' : 'border-gray-200'
              }`}>
                <div className={`px-4 py-3 ${
                  bannerActive 
                    ? 'bg-green-50 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      {bannerActive ? '🟢 Active Banner' : '⚫ Inactive Banner'}
                    </p>
                    <span className="text-sm">
                      {bannerActive ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  {bannerText ? (
                    <p className="text-gray-800">{bannerText}</p>
                  ) : (
                    <p className="text-gray-400 italic">No banner text set</p>
                  )}
                </div>
              </div>
            </div>
            
            <button
              onClick={handleSaveBanner}
              disabled={loadingBanner || !bannerText.trim()}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loadingBanner ? (
                <>
                  <LoadingSpinner />
                  Saving...
                </>
              ) : banner ? (
                'Update Banner'
              ) : (
                'Create Banner'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Delivery Tab */}
      {activeTab === 'delivery' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <DeliveryIcon />
            Delivery Cost Settings
          </h2>
          
          <div className="max-w-md">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Name *
                </label>
                <input
                  type="text"
                  value={deliveryName}
                  onChange={(e) => setDeliveryName(e.target.value)}
                  placeholder="e.g., Standard Delivery"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Price *
                  <span className="text-gray-500 text-sm font-normal ml-2">
                    (in your currency)
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    value={deliveryPrice}
                    onChange={(e) => setDeliveryPrice(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  This cost will be added to customer orders
                </p>
              </div>
              
              {/* Current Delivery Display */}
              {delivery && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800 mb-2">Current Delivery</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-900 font-medium">{delivery.name}</p>
                      <p className="text-sm text-blue-700">ID: {delivery.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-900">
                        ${parseFloat(delivery.price).toFixed(2)}
                      </p>
                      <p className="text-sm text-blue-600">per order</p>
                    </div>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleSaveDelivery}
                disabled={loadingDelivery || !deliveryName.trim()}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {loadingDelivery ? (
                  <>
                    <LoadingSpinner />
                    Saving...
                  </>
                ) : delivery ? (
                  'Update Delivery'
                ) : (
                  'Create Delivery'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;