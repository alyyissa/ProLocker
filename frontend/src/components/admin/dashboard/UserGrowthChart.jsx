// components/dashboard/UserGrowthChart.js
import React from 'react';
import Chart from 'react-apexcharts';

const UserGrowthChart = ({ data }) => {
  // Handle undefined or empty data
  if (!data || !Array.isArray(data)) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-gray-500 text-center">No user data available</p>
      </div>
    );
  }

  // Check if data is empty array
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-gray-300 mb-4">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-gray-500">No users registered yet</p>
      </div>
    );
  }

  // Extract months and counts from the data
  const categories = data.map(item => item.month || 'Unknown');
  const seriesData = data.map(item => item.count || 0);

  // Calculate total users for the period
  const totalUsers = seriesData.reduce((sum, count) => sum + count, 0);

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      }
    },
    colors: ['#3B82F6'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '55%',
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ["#374151"]
      },
      formatter: function(val) {
        return val; // Show the exact number
      }
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px',
          fontWeight: 500
        }
      },
      axisBorder: {
        show: true,
        color: '#E5E7EB'
      },
      axisTicks: {
        show: true,
        color: '#E5E7EB'
      }
    },
    yaxis: {
      title: {
        text: 'Number of Users',
        style: {
          color: '#6B7280',
          fontSize: '12px',
          fontWeight: 500
        }
      },
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '11px'
        }
      },
      min: 0,
      tickAmount: 5
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return value + " users";
        }
      }
    },
    title: {
      text: `Total: ${totalUsers} users in last ${data.length} months`,
      align: 'center',
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#374151'
      }
    },
    responsive: [{
      breakpoint: 640,
      options: {
        chart: {
          height: 300
        },
        dataLabels: {
          enabled: false
        },
        plotOptions: {
          bar: {
            columnWidth: '60%'
          }
        }
      }
    }]
  };

  const series = [{
    name: 'New Users',
    data: seriesData
  }];

  return (
    <div>
      <Chart 
        options={options} 
        series={series} 
        type="bar" 
        height={350} 
      />
    </div>
  );
};

// Add default props
UserGrowthChart.defaultProps = {
  data: []
};

export default UserGrowthChart;