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
  page = 1,
  limit = 10,
} = {}) => {
  const { data } = await api.get("/orders", {
    params: {
      status,
      date,
      page,
      limit,
    },
  });

  return data;
};
