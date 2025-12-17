import api from '../api'

export const getProducts = async (filters = {}, page = 1, limit = 12) => {
  const cleanedFilters = Object.fromEntries(
    Object.entries(filters).filter(
      ([_, value]) => value !== null && value !== undefined
    )
  );
  const params = {
    ...cleanedFilters,
    page,
    limit,
  };

  const response = await api.get("/products", { params });
  return response.data;
};

export const getProductBySlug = async (slug) => {
    try {
        const response = await api.get(`/products/${slug}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const ProductService = {
  search: async (query) => {
    if (!query || query.length < 2) return [];
    const res = await api.get(`/products/search?q=${query}`);
    return res.data;
  },
  searchAdmin: async (query) => {
    if (!query || query.length < 2) return [];
    const res = await api.get(`/products/search/admin?q=${query}`);
    return res.data;
  },
  getProductsForAdmin: async (filters = {}, page = 1, limit = 12) => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([key, value]) => {
          if (key === 'sale') return value !== null && value !== undefined;
          return value !== null && value !== undefined && value !== '';
        }
      )
    );
    
    const params = {
      ...cleanedFilters,
      page,
      limit,
    };

    try {
      const res = await api.get('/products/admin/list', { params });
      return res.data;
    } catch (error) {
      console.error('Error fetching admin products:', error);
      throw error;
    }
  },
};

export const getRelatedProducts = async (productId) => {
  const res = await api.get(`/products/${productId}/related`);
  return res.data;
};

export const getMostSoldProducts = async () => {
  const res = await api.get("/products/most-sold"); 
  return res.data;
};


export const createProduct = async (productData) => {
  try {
    const response = await api.post("/products", productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
