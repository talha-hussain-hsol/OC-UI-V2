import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../../contexts/themeContext';
Chart.register(ArcElement, Tooltip, Legend);

const DonutChart = ({ labels, dataValues, colors }) => {
  const { theme } = useTheme();
  console.log("theme", theme);

  const data = {
    labels: labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: colors,
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          usePointStyle: true,
          boxWidth: 45,
          padding: 20,
        },
      },
    },
  };

  return (
    <div className={`bg-color-card-${theme} w-full flex justify-center `}>
  <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[50%] max-w-md rounded-lg ">
    <Doughnut data={data} options={options}  />
  </div>
 </div>

  );
};

export default DonutChart;


