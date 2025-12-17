import React, { useState, useEffect } from 'react';
import { ProductService } from '../../../services/products/productsService';
import { createProductVariant, getProductVariants, updateVariantQuantity } from '../../../services/productVarient/productVarient';
import { getSize } from '../../../services/size/sizeService';


const ProductVariant = () => {
  // Form state
  const [formData, setFormData] = useState({
    productId: '',
    sizeId: '',
    quantity: ''
  });

  // Search and data states
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [existingVariants, setExistingVariants] = useState([]);
  
  // Loading and status states
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [fetchingVariants, setFetchingVariants] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Variant quantities for each size
  const [sizeQuantities, setSizeQuantities] = useState({});

  // Fetch sizes on component mount
  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const sizesData = await getSize();
        // Sort sizes by symbol order
        const sortedSizes = sizesData.sort((a, b) => {
          const sizeOrder = { 
            'S': 1, 'M': 2, 'L': 3, 'XL': 4, 
            '2XL': 5, '3XL': 6, '4XL': 7, '5XL': 8 
          };
          return (sizeOrder[a.symbol] || 99) - (sizeOrder[b.symbol] || 99);
        });
        setSizes(sortedSizes);
      } catch (err) {
        setError('Failed to load sizes');
        console.error('Error fetching sizes:', err);
      }
    };

    fetchSizes();
  }, []);

  useEffect(() => {
    const searchProductsHandler = async () => {
      if (!searchQuery.trim() || searchQuery.length < 3) {
        setProducts([]);
        return;
      }

      setSearchLoading(true);
      try {
        const results = await ProductService.search(searchQuery);
        setProducts(results);
      } catch (err) {
        console.error('Error searching products:', err);
        setProducts([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const timer = setTimeout(searchProductsHandler, 800);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchExistingVariants = async () => {
      if (!selectedProduct) {
        setExistingVariants([]);
        return;
      }

      setFetchingVariants(true);
      try {
        const variants = await getProductVariants(selectedProduct.id);
        setExistingVariants(variants);
        
        // Initialize size quantities with existing data
        const initialQuantities = {};
        variants.forEach(variant => {
          initialQuantities[variant.size.id] = variant.quantity || '';
        });
        setSizeQuantities(initialQuantities);
      } catch (err) {
        console.error('Error fetching variants:', err);
        setExistingVariants([]);
        setSizeQuantities({});
      } finally {
        setFetchingVariants(false);
      }
    };

    fetchExistingVariants();
  }, [selectedProduct]);

  const handleProductSelect = async (product) => {
    setSelectedProduct(product);
    setFormData(prev => ({ ...prev, productId: product.id }));
    setSearchQuery(product.name);
    setProducts([]);
    setError('');
    setSuccess('');
  };

  const handleSizeQuantityChange = (sizeId, quantity) => {
    setSizeQuantities(prev => ({
      ...prev,
      [sizeId]: quantity
    }));
  };

  const processSequentiallyWithDelay = async (items, processFunction, delay = 500) => {
    const results = [];
    for (let i = 0; i < items.length; i++) {
      try {
        const result = await processFunction(items[i]);
        results.push(result);
        
        // Add delay between requests (except for the last one)
        if (i < items.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (err) {
        console.error(`Failed to process item ${i + 1}:`, err);
        // Continue with other items
        results.push({ error: err.message, item: items[i] });
      }
    }
    return results;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.productId) {
        throw new Error('Please select a product');
      }

      // Prepare data for all sizes
      const operations = [];
      
      sizes.forEach(size => {
        const newQuantity = sizeQuantities[size.id] || '';
        const existingVariant = existingVariants.find(v => v.size.id === size.id);
        
        if (newQuantity !== '' && parseInt(newQuantity) >= 0) {
          if (existingVariant) {
            // Update existing variant
            if (parseInt(newQuantity) !== existingVariant.quantity) {
              operations.push({
                type: 'update',
                variantId: existingVariant.id,
                sizeId: size.id,
                quantity: parseInt(newQuantity)
              });
            }
          } else {
            // Create new variant (only if quantity > 0)
            if (parseInt(newQuantity) > 0) {
              operations.push({
                type: 'create',
                productId: parseInt(formData.productId),
                sizeId: size.id,
                quantity: parseInt(newQuantity)
              });
            }
          }
        }
      });

      if (operations.length === 0) {
        throw new Error('No changes to save');
      }

      // Process operations sequentially with delay
      const results = await processSequentiallyWithDelay(operations, async (op) => {
        if (op.type === 'create') {
          return await createProductVariant({
            productId: op.productId,
            sizeId: op.sizeId,
            quantity: op.quantity
          });
        } else {
          return await updateVariantQuantity(op.variantId, op.quantity);
        }
      }, 1000);

      // Count successes
      const successfulOps = results.filter(r => !r.error);
      const failedOps = results.filter(r => r.error);

      // Refresh variants data
      if (selectedProduct) {
        const refreshedVariants = await getProductVariants(selectedProduct.id);
        setExistingVariants(refreshedVariants);
      }

      if (failedOps.length === 0) {
        setSuccess(`Successfully updated ${successfulOps.length} variants!`);
      } else if (successfulOps.length > 0) {
        setSuccess(`Updated ${successfulOps.length} variants. ${failedOps.length} failed.`);
      } else {
        throw new Error('All operations failed');
      }

    } catch (err) {
      setError(err.message || err.response?.data?.message || 'Failed to update variants');
      console.error('Error updating variants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = (quantity) => {
    const newQuantities = {};
    sizes.forEach(size => {
      newQuantities[size.id] = quantity;
    });
    setSizeQuantities(newQuantities);
  };

  const calculateChanges = () => {
    let created = 0;
    let updated = 0;
    let unchanged = 0;

    sizes.forEach(size => {
      const newQuantity = sizeQuantities[size.id] || '';
      const existingVariant = existingVariants.find(v => v.size.id === size.id);
      
      if (newQuantity !== '') {
        if (!existingVariant && parseInt(newQuantity) > 0) {
          created++;
        } else if (existingVariant && parseInt(newQuantity) !== existingVariant.quantity) {
          updated++;
        } else {
          unchanged++;
        }
      }
    });

    return { created, updated, unchanged };
  };

  const changes = calculateChanges();
  const totalQuantity = Object.values(sizeQuantities)
    .filter(qty => qty !== '')
    .reduce((sum, qty) => sum + (parseInt(qty) || 0), 0);
  
  const sizesWithQuantity = Object.values(sizeQuantities)
    .filter(qty => qty !== '' && parseInt(qty) > 0).length;

  return (
    <div className="py-10 flex flex-col justify-between bg-white mb-20">
      <div className="max-w-5xl mx-auto w-full px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Manage Product Variants</h1>
          <p className="text-gray-600 mt-2">Add or update stock quantities for each size variant</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Error: {error}</span>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Success: {success}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Product Search Section */}
          <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">1. Select Product</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Product *
                <span className="text-gray-500 text-sm font-normal ml-1">(Type at least 3 characters)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type product name to search..."
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
                {searchLoading && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Selected Product Display */}
            {selectedProduct && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {selectedProduct.mainImage && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                          <img 
                            src={selectedProduct.mainImage} 
                            alt={selectedProduct.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{selectedProduct.name}</h3>
                          {fetchingVariants && (
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            ${selectedProduct.price}
                          </span>
                          {selectedProduct.category && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {selectedProduct.category.category || selectedProduct.category.name}
                            </span>
                          )}
                          {selectedProduct.color && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {selectedProduct.color.color || selectedProduct.color.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProduct(null);
                      setFormData(prev => ({ ...prev, productId: '' }));
                      setSearchQuery('');
                      setExistingVariants([]);
                      setSizeQuantities({});
                    }}
                    className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Search Results Dropdown */}
            {products.length > 0 && !selectedProduct && (
              <div className="absolute z-10 mt-1 w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                <div className="p-2 border-b border-gray-200">
                  <p className="text-sm text-gray-600">{products.length} products found</p>
                </div>
                {products.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleProductSelect(product)}
                    className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                  >
                    {product.mainImage && (
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 shrink-0">
                        <img 
                          src={product.mainImage} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium text-blue-600">${product.price}</span>
                        {product.priceAfterSale && product.priceAfterSale < product.price && (
                          <span className="text-sm text-gray-500 line-through">${product.price}</span>
                        )}
                      </div>
                    </div>
                    <span className="text-blue-600 text-sm font-medium whitespace-nowrap">Select →</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Size Quantities Section */}
          {selectedProduct && (
            <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">2. Manage Stock Quantities</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {existingVariants.length > 0 
                      ? `${existingVariants.length} existing variants found. Update quantities below.`
                      : 'No existing variants. Add quantities below.'
                    }
                  </p>
                </div>
                
                {/* Quick Add Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(5)}
                    className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium"
                  >
                    Set all to 5
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(10)}
                    className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-medium"
                  >
                    Set all to 10
                  </button>
                  <button
                    type="button"
                    onClick={() => setSizeQuantities({})}
                    className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium"
                  >
                    Clear all
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {sizes.map((size) => {
                  const existingVariant = existingVariants.find(v => v.size.id === size.id);
                  const currentQuantity = sizeQuantities[size.id] || '';
                  const isChanged = existingVariant 
                    ? parseInt(currentQuantity || 0) !== existingVariant.quantity
                    : currentQuantity !== '' && parseInt(currentQuantity) > 0;

                  return (
                    <div 
                      key={size.id} 
                      className={`bg-gray-50 border rounded-xl p-4 transition ${
                        isChanged 
                          ? 'border-yellow-400 bg-yellow-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-center mb-4">
                        <div className={`inline-flex items-center justify-center w-12 h-12 border rounded-lg mb-2 ${
                          isChanged ? 'bg-yellow-100 border-yellow-300' : 'bg-white border-gray-300'
                        }`}>
                          <span className="text-xl font-bold text-gray-900">{size.symbol}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{size.name}</p>
                        {existingVariant && (
                          <p className="text-xs text-gray-500 mt-1">
                            Current: <span className="font-semibold">{existingVariant.quantity}</span>
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-600 text-center">
                          New Quantity
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            value={currentQuantity}
                            onChange={(e) => handleSizeQuantityChange(size.id, e.target.value)}
                            placeholder={existingVariant ? existingVariant.quantity.toString() : "0"}
                            className="w-full py-2 px-3 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          />
                        </div>
                        {isChanged && (
                          <p className="text-xs text-yellow-600 text-center font-medium">
                            Changed
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Changes Summary */}
              <div className="mt-8 p-5 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center md:text-left">
                    <p className="text-sm font-medium text-blue-700 mb-1">Total Stock</p>
                    <p className="text-3xl font-bold text-blue-900">{totalQuantity}</p>
                    <p className="text-xs text-blue-600 mt-1">total units</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm font-medium text-blue-700 mb-1">Sizes with Stock</p>
                    <p className="text-3xl font-bold text-blue-900">
                      {sizesWithQuantity} / {sizes.length}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">size variants</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm font-medium text-blue-700 mb-1">To Create</p>
                    <p className="text-3xl font-bold text-green-600">{changes.created}</p>
                    <p className="text-xs text-green-600 mt-1">new variants</p>
                  </div>
                  
                  <div className="text-center md:text-right">
                    <p className="text-sm font-medium text-blue-700 mb-1">To Update</p>
                    <p className="text-3xl font-bold text-yellow-600">{changes.updated}</p>
                    <p className="text-xs text-yellow-600 mt-1">existing variants</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          {selectedProduct && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>
                    {changes.created + changes.updated > 0 
                      ? `Ready to save ${changes.created + changes.updated} changes` 
                      : 'No changes to save'}
                  </span>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading || (changes.created + changes.updated === 0)}
                className="px-8 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm hover:shadow"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  `SAVE ${changes.created + changes.updated} CHANGES`
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProductVariant;