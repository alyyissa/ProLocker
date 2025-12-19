import api from "../api";

export const getUserGrowthStats = async () => {
  try {
    const { data } = await api.get('/users/growth-stats/admin');
    return data;
  } catch (error) {
    console.error('Error fetching user growth stats:', error);
    return { monthlyData: [], stats: { totalUsers: 0, newUsersThisMonth: 0 } };
  }
};