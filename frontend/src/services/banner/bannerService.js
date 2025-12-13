import api from "../api";

export const getActiveBanner = async () => {
  const res = await api.get("/banner/active");
  return res.data;
};
