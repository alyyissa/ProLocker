import React from 'react';
import Chart from 'react-apexcharts';

const TopProductsChart = ({ data }) => {
  const productNames = data.map(item => item.productName);
  const quantitiesSold = data.map(item => parseInt(item.totalSold) || 0);
  const revenueGenerated = data.map(item => parseFloat(item.totalRevenue) || 0);

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        columnWidth: '60%',
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: {
        fontSize: '12px',
        colors: ['#fff']
      },
      formatter: (val) => val.toLocaleString()
    },
    xaxis: {
      categories: productNames,
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        }
      }
    },
    colors: ['#3B82F6'],
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val, { seriesIndex, dataPointIndex }) => {
          if (seriesIndex === 0) {
            return `${val} units sold`;
          }
          return `$${val} revenue`;
        }
      }
    }
  };

  const series = [
    {
      name: 'Units Sold',
      data: quantitiesSold
    }
  ];

  return <Chart options={options} series={series} type="bar" height={350} />;
};

export default TopProductsChart;