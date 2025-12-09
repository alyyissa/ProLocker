import api from "../api";

export const sendOrder = (orderData) =>{
    return api.post("/orders", orderData)
}

export const getUserOrders = (page = 1, limit = 3) => {
  return api.get(`/orders/user?page=${page}&limit=${limit}`);
};

export const getOrderById = (id) => {
  return api.get(`/orders/${id}`);
};
