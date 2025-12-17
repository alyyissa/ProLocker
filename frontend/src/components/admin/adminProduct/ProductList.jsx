import React, { useState, useEffect } from 'react';
import { ProductService } from '../../../services/products/productsService';
import { getColors } from '../../../services/color/ColorService';
import { getCategories } from '../../../services/categories/categoriesService';
import api from '../../../services/api';
import { toast } from 'react-toastify';

const ProductList = () => {
  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [colorsLoading, setColorsLoading] = useState(true);
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [editingSale, setEditingSale] = useState(null); // { productId: number, value: string }
const [updating, setUpdating] = useState(false);

const handleUpdateSale = async (productId, newSale) => {
  const saleValue = parseInt(newSale);
  
  // Validate
  if (isNaN(saleValue) || saleValue < 0 || saleValue > 100) {
    toast.error(`Sale must be between 0 and 100`, {
        position: "top-right",
        autoClose: 3000,
      });
    setEditingSale(null);
    return;
  }

  try {
    setUpdating(true);
    console.log(`Updating product ${productId} sale to ${saleValue}%`);
    
    // Call update API
    const response = await api.patch(`/products/${productId}`, { sale: saleValue });
    console.log('Update response:', response.data);
    
    // Update local state
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, sale: saleValue } 
        : product
    ));
    
    setEditingSale(null);
    
    toast.success(`Sale updated to ${saleValue}%!`, {
        position: "top-right",
        autoClose: 3000,
      });
  } catch (error) {
    console.error('Error updating sale:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      productId,
      saleValue
    });
    
    // Show more specific error message
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error ||
                        error.message ||
                        'Failed to update sale';
    alert(`Error: ${errorMessage}`);
  } finally {
    setUpdating(false);
  }
};

  const [filters, setFilters] = useState({
    category: '',
    color: '',
    sale: '',
    date: 'latest'
  });

  // Fetch categories and colors on mount
  useEffect(() => {
    fetchCategories();
    fetchColors();
  }, []);

  // Fetch products when filters or page changes
  useEffect(() => {
    if (!categoriesLoading && !colorsLoading) {
      fetchProducts();
    }
  }, [pagination.page, filters, categoriesLoading, colorsLoading]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchColors = async () => {
    try {
      const data = await getColors();
      setColors(data);
    } catch (error) {
      console.error('Error fetching colors:', error);
    } finally {
      setColorsLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await ProductService.getProductsForAdmin(
        filters,
        pagination.page,
        pagination.limit
      );
      
      setProducts(response.data);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: '',
      color: '',
      sale: '',
      date: 'latest'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'FewLeft': return 'bg-yellow-100 text-yellow-800';
      case 'OutOfStock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading skeleton
  if (categoriesLoading || colorsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Products Management</h1>
        <p className="text-gray-600 mt-2">Manage all products in the system</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
          >
            Reset Filters
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.category || category.name}>
                  {category.category || category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Color Filter Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <select
              value={filters.color}
              onChange={(e) => handleFilterChange('color', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">All Colors</option>
              {colors.map((color) => (
                <option key={color.id} value={color.color || color.name}>
                  {color.color || color.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sale Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sale Status</label>
            <select
              value={filters.sale}
              onChange={(e) => handleFilterChange('sale', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">All</option>
              <option value="1">On Sale</option>
              <option value="0">No Sale</option>
            </select>
          </div>

          {/* Date Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By Date</label>
            <select
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="latest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total Products</div>
          <div className="text-2xl font-bold text-gray-800">{pagination.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">In Stock</div>
          <div className="text-2xl font-bold text-green-600">
            {products.filter(p => p.status === 'Available').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Low Stock</div>
          <div className="text-2xl font-bold text-yellow-600">
            {products.filter(p => p.status === 'Few Left').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Out of Stock</div>
          <div className="text-2xl font-bold text-red-600">
            {products.filter(p => p.status === 'Out of Stock').length}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Products List</h2>
            <div className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </div>
          </div>
        </div>

        {loading && products.length === 0 ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      {/* Product Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="shrink-0 h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                            {product.mainImage ? (
                              <img 
                                src={product.mainImage} 
                                alt={product.name}
                                className="h-12 w-12 object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 flex items-center justify-center text-gray-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">ID: {product.id}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              {product.category?.category || 'No category'} • {product.color?.color || 'No color'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Price Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className="font-semibold">${product.price}</span>
                          {product.priceAfterSale && product.priceAfterSale < product.price && (
                            <div className="text-xs text-gray-500 line-through">${product.priceAfterSale}</div>
                          )}
                        </div>
                      </td>


                      {/* Quantity Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${product.quantity > 0 ? 'text-blue-700' : 'text-red-700'}`}>
                          {product.quantity}
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(product.status)}`}>
                          {product.status}
                        </span>
                      </td>

                      {/* Created Date Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(product.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
  {editingSale?.productId === product.id ? (
    <div className="flex items-center gap-2">
      <div className="relative">
        <input
          type="number"
          min="0"
          max="100"
          value={editingSale.value}
          onChange={(e) => setEditingSale({ productId: product.id, value: e.target.value })}
          className="w-20 px-3 py-1 border border-blue-500 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          autoFocus
          disabled={updating}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleUpdateSale(product.id, editingSale.value);
            if (e.key === 'Escape') setEditingSale(null);
          }}
        />
        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
          %
        </span>
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => handleUpdateSale(product.id, editingSale.value)}
          disabled={updating}
          className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          title="Save"
        >
          {updating ? '...' : '✓'}
        </button>
        <button
          onClick={() => setEditingSale(null)}
          disabled={updating}
          className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
          title="Cancel"
        >
          ✕
        </button>
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      {product.sale > 0 ? (
        <div className="group relative">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 cursor-pointer hover:bg-red-200 transition-colors">
            {product.sale}% OFF
          </span>
          <button
            onClick={() => setEditingSale({ productId: product.id, value: product.sale.toString() })}
            className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            title="Edit sale"
          >
            ✎
          </button>
        </div>
      ) : (
        <div className="group relative">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 cursor-pointer hover:bg-gray-200 transition-colors">
            No Sale
          </span>
          <button
            onClick={() => setEditingSale({ productId: product.id, value: '0' })}
            className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            title="Add sale"
          >
            +
          </button>
        </div>
      )}
    </div>
  )}
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-4 sm:mb-0">
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                      <span className="font-medium">{pagination.total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              pagination.page === pageNum
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page === pagination.totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;