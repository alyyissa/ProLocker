import api from "../api";

export const getDeliveryFee = async () => {
  try {
    const res = await api.get('/setting/delivery-price');
    return res.data.deliveryPrice || 3;
  } catch (err) {
    console.error('Failed to fetch delivery fee:', err);
    return 0;
  }
};