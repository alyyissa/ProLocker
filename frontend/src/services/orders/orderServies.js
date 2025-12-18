import api from "../api";

export const createOrder = async (orderData) => {
  try {
    const response = await api.post("/orders", orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMyOrders = async (userId) => {
  try {
    const response = await api.get(`/orders/my-orders/${userId}`)
    return response.data;
  } catch (error) {
    throw error
  }
}

export const getOrderById = async (orderId) => {
  try {
    const res = await api.get(`/orders/${orderId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getOrders = async ({
  status,
  date,
  search,
  page = 1,
  limit = 10,
} = {}) => {
  const { data } = await api.get("/orders", {
    params: {
      status,
      date,
      page,
      limit,
      search,
    },
  });

  return data;
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.patch(`/orders/${orderId}`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getDashboardStats = async () => {
  const res = await api.get('/orders/admin/stats/sales-summary');
  return res.data;
};

export const getRevenueTrend = async (days = 30) => {
  const res = await api.get(`/orders/admin/stats/revenue-trend?days=${days}`);
  return res.data;
};

export const getTopProducts = async (limit = 5) => {
  const res = await api.get(`/orders/admin/stats/top-products?limit=${limit}`);
  return res.data;
};