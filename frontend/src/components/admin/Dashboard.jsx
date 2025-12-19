import React, { useState, useEffect } from 'react';
import RevenueChart from './dashboard/RevenueChart';
import TopProductsChart from './dashboard/TopProductsChart';
import OrderStatusChart from './dashboard/OrderStatusChart';
import StatCard from './dashboard/StatCard';
import { getDashboardStats, getRevenueTrend, getTopProducts } from '../../services/orders/orderServies';
import UserGrowthChart from './dashboard/UserGrowthChart';
import { getUserGrowthStats } from '../../services/user/user';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState({ monthlyData: [], stats: {} });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [statsData, revenueTrend, topProductsData, userGrowth] = await Promise.all([
          getDashboardStats(),
          getRevenueTrend(),
          getTopProducts(),
          getUserGrowthStats()
        ]);
        
        setStats(statsData);
        setRevenueData(revenueTrend);
        setTopProducts(topProductsData);
        setUserGrowthData(userGrowth);
        console.log('User Growth Data:', userGrowth);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Today's Revenue"
          value={`$${stats?.today?.revenue.toFixed(2) || '0.00'}`}
          change={`${stats?.today?.revenue > stats?.yesterday?.revenue ? '+' : ''}${((stats?.today?.revenue - stats?.yesterday?.revenue) / (stats?.yesterday?.revenue || 1) * 100).toFixed(1)}%`}
          changeType={stats?.today?.revenue > stats?.yesterday?.revenue ? 'increase' : 'decrease'}
          icon="💰"
        />
        <StatCard
          title="Today's Orders"
          value={stats?.today?.orders || 0}
          change={`${stats?.today?.orders > stats?.yesterday?.orders ? '+' : ''}${((stats?.today?.orders - stats?.yesterday?.orders) / (stats?.yesterday?.orders || 1) * 100).toFixed(1)}%`}
          changeType={stats?.today?.orders > stats?.yesterday?.orders ? 'increase' : 'decrease'}
          icon="📦"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats?.thisMonth?.revenue.toFixed(2) || '0.00'}`}
          change="This Month"
          changeType="neutral"
          icon="📈"
        />
        <StatCard
          title="Monthly Orders"
          value={stats?.thisMonth?.orders || 0}
          change="Total This Month"
          changeType="neutral"
          icon="📊"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Revenue & Orders Trend</h2>
          <RevenueChart data={revenueData} />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Status Distribution</h2>
          <OrderStatusChart data={stats?.statusDistribution || []} />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Selling Products</h2>
          <TopProductsChart data={topProducts} />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">User Growth</h2>
            <div className="flex space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-lg font-bold text-blue-600">
                  {userGrowthData.stats?.totalUsers || 0}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-lg font-bold text-green-600">
                  {userGrowthData.stats?.newUsersThisMonth || 0}
                </p>
              </div>
            </div>
          </div>
          <UserGrowthChart data={userGrowthData?.monthlyData || []} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;