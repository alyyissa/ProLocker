import React from 'react';
import Chart from 'react-apexcharts';

const OrderStatusChart = ({ data }) => {
  const statusColors = {
    PENDING: '#FBBF24',
    PROCESSING: '#3B82F6',
    SHIPPED: '#8B5CF6',
    DELIVERED: '#10B981',
    DECLINED: '#EF4444',
    CANCELLED: '#6B7280'
  };

  const categories = data.map(item => item.status);
  const series = data.map(item => item.count);

  const options = {
    chart: {
      type: 'donut',
      height: 350
    },
    colors: categories.map(status => statusColors[status] || '#9CA3AF'),
    labels: categories,
    legend: {
      position: 'bottom',
      horizontalAlign: 'center'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Orders',
              formatter: () => series.reduce((a, b) => a + b, 0)
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val, { seriesIndex, w }) => {
        return w.config.series[seriesIndex];
      },
      dropShadow: {
        enabled: false
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  return <Chart options={options} series={series} type="donut" height={350} />;
};

export default OrderStatusChart;