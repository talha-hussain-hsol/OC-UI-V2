import React from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "../../../contexts/themeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const FinancialChart = ({ data, year, chartType = "bar" }) => {
  const { theme } = useTheme();


  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "$",
        data: data.values,
        backgroundColor:
        chartType === "bar" ? `bg-color-barchart-${theme}` : "transparent",
        borderColor: "#68D930",
        borderWidth: 2,
        borderRadius: chartType === "bar" ? 10 : 0,
        tension: chartType === "line" ? 0.4 : 0,
        fill: false,
        
      },
    ],
  };

  const options = {
    scales: {
      y: {
        ticks: {
          color: "#a5bdd9",
          callback: function (value) {
            return `$${value}M`;
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      x: {
        ticks: {
          color: "#a5bdd9",
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className={`p-6 bg-color-card-${theme} shadow-${theme}`}>
      {chartType === "bar" ? (
        <Bar data={chartData} options={options} />
      ) : (
        <Line data={chartData} options={options} />
      )}
      <div className={`text-center text-color-text-${theme} mt-4 text-lg`}>{year}</div>
    </div>
  );
};

export default FinancialChart;
