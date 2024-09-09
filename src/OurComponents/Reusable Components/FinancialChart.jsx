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
import { useTheme } from "../../contexts/themeContext";

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
  console.log("theme", theme);

  // const backgroundClass = {
  //   theme1: "bg-color-card-theme1",
  //   theme2: "bg-color-theme2",
  //   theme3: "bg-color-theme3",
  //   theme4: "bg-color-theme4",
  // };

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "$",
        data: data.values,
        backgroundColor:
          // chartType === "bar" ? "rgba(0, 255, 255, 0.2)" : "transparent",
        chartType === "bar" ? `bg-color-barchart1-${theme}` : "transparent",
        borderColor: "rgba(0, 255, 255, 1)",
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
    <div className={`p-6 bg-color-${theme} shadow-lg`}>
      {chartType === "bar" ? (
        <Bar data={chartData} options={options} />
      ) : (
        <Line data={chartData} options={options} />
      )}
      <div className={`text-center text-color-${theme} mt-4 text-lg`}>{year}</div>
    </div>
  );
};

export default FinancialChart;
