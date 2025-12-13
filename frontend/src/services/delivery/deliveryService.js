import api from "../api";

export const getDeliveryFee = async () => {
  try {
    const res = await api.get("/delivery");
    const delivery = res.data?.[0];
    if (!delivery) return 0;
    return Number(delivery.price);
  } catch (err) {
    console.error("Failed to fetch delivery fee:", err);
    return 0;
  }
};