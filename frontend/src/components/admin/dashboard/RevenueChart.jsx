import React from 'react';
import Chart from 'react-apexcharts';

const RevenueChart = ({ data }) => {
  // Safety check - ensure data is an array
  const safeData = Array.isArray(data) ? data : [];
  
  // Check if we have data to display
  const hasData = safeData.length > 0;

  // If no data, show a clean empty state
  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
        <div className="text-5xl mb-4 text-gray-300">📊</div>
        <p className="font-medium text-gray-600">No revenue data available</p>
        <p className="text-sm text-gray-500 mt-2">
          Start receiving orders to see revenue trends here
        </p>
      </div>
    );
  }

  // Prepare chart data
  const dates = safeData.map(item => {
    if (item?.date) {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
    return 'Unknown Date';
  });

  const revenue = safeData.map(item => {
    const revenueValue = parseFloat(item?.totalRevenue);
    return isNaN(revenueValue) ? 0 : revenueValue;
  });

  const orders = safeData.map(item => {
    const orderCount = parseInt(item?.orderCount);
    return isNaN(orderCount) ? 0 : orderCount;
  });

  // Calculate totals for summary
  const totalRevenue = revenue.reduce((sum, val) => sum + val, 0);
  const totalOrders = orders.reduce((sum, val) => sum + val, 0);
  const averageRevenue = totalRevenue / safeData.length || 0;

  // Chart configuration
  const options = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: true
        }
      }
    },
    colors: ['#3B82F6', '#10B981'],
    stroke: {
      curve: 'smooth',
      width: [3, 2]
    },
    xaxis: {
      categories: dates,
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        }
      }
    },
    yaxis: [
      {
        title: {
          text: 'Revenue ($)',
          style: {
            color: '#3B82F6',
            fontSize: '12px'
          }
        },
        labels: {
          style: {
            colors: '#3B82F6'
          },
          formatter: (value) => `$${value.toFixed(0)}`
        }
      },
      {
        opposite: true,
        title: {
          text: 'Orders',
          style: {
            color: '#10B981',
            fontSize: '12px'
          }
        },
        labels: {
          style: {
            colors: '#10B981'
          }
        }
      }
    ],
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      markers: {
        width: 12,
        height: 12,
        radius: 6
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function(val, { seriesIndex }) {
          if (seriesIndex === 0) {
            return `$${val.toFixed(2)}`;
          }
          return `${val} orders`;
        }
      }
    }
  };

  // Chart data series
  const series = [
    {
      name: 'Revenue',
      data: revenue,
      type: 'line'
    },
    {
      name: 'Orders',
      data: orders,
      type: 'column'
    }
  ];

  return (
    <div className="w-full">
      {/* Chart Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Revenue & Orders Trend</h2>
        <p className="text-gray-600 text-sm">
          Showing {safeData.length} days of data
        </p>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <Chart 
          options={options} 
          series={series} 
          type="line" 
          height={350}
        />
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <span className="text-green-600">📦</span>
            </div>
            <div>
              <p className="text-sm text-green-700 font-medium">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <span className="text-purple-600">📊</span>
            </div>
            <div>
              <p className="text-sm text-purple-700 font-medium">Daily Average</p>
              <p className="text-2xl font-bold text-gray-800">
                ${averageRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Quality Note */}
      {safeData.length > 0 && (
        <div className="mt-4 text-xs text-gray-500 flex items-center">
          <span className="mr-2">ℹ️</span>
          Chart combines revenue (line) and order count (bars) over time
        </div>
      )}
    </div>
  );
};

// Add PropTypes for better development experience
RevenueChart.propTypes = {
  data: (props, propName, componentName) => {
    const propValue = props[propName];
    if (propValue !== undefined && !Array.isArray(propValue)) {
      return new Error(
        `Invalid prop \`${propName}\` supplied to \`${componentName}\`. ` +
        `Expected an array, got ${typeof propValue}.`
      );
    }
  }
};

// Default props
RevenueChart.defaultProps = {
  data: []
};

export default RevenueChart;