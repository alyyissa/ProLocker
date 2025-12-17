import api from "../api"

export const createProductVariant = async (variantData) => {
  try {
    const response = await api.post("/product-varient", variantData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getProductVariants = async (productId) => {
  try {
    const response = await api.get(`/product-varient/product/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateVariantQuantity = async (variantId, quantity) => {
  try {
    const response = await api.patch(`/product-varient/${variantId}`, { quantity });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};