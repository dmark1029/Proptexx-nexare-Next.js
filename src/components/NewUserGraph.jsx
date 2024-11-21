import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';

const UserGraph = ({ newUsersData }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (newUsersData.length === 0 || !chartRef.current) return;

    // Extract the creation dates of users
    const creationDates = newUsersData.map((user) => user.createdAt);

    // Count the number of new users for each day
    const userCountPerDay = creationDates.reduce((countMap, date) => {
      const day = date.split('T')[0]; // Extract day part from the full date
      countMap[day] = (countMap[day] || 0) + 1;
      return countMap;
    }, {});

    // Convert the count map to arrays for labels and data
    const labels = Object.keys(userCountPerDay);
    const data = labels.map((day) => userCountPerDay[day]);

    const drawChart = () => {
      const ctx = chartRef.current.getContext('2d');

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'New Users',
              data,
              backgroundColor: 'black',
              borderColor: 'black',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
                parser: 'YYYY-MM-DD',
              },
            },
            y: {
              beginAtZero: true,
              stepSize: 1,
            },
          },
        },
      });
    };

    drawChart();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [newUsersData]);

  return <canvas ref={chartRef} />;
};

export default UserGraph;
