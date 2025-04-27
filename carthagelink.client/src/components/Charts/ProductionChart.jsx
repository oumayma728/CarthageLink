import { LineChart } from "lucide-react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from "chart.js";

ChartJS.register(LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

const data = {
  labels: ["8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM"],
  datasets: [
    {
      label: "Actual Output",
      data: [120, 135, 148, 110, 95, 130, 150],
      borderColor: "#2196F3",
      tension: 0.3,
    },
    {
      label: "Target Output",
      data: [130, 130, 130, 130, 130, 130, 130],
      borderColor: "#FF5722",
      borderDash: [5, 5],
    },
  ],
};

export default function ProductionChart() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <LineChart className="text-gray-500 dark:text-gray-400 w-5 h-5" />
        <h3 className="text-lg font-semibold dark:text-white">📈 Production Output</h3>
      </div>
      <div className="h-64">
        <Line
          data={data}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: false,
                grid: { color: "rgba(0, 0, 0, 0.05)" },
                ticks: { color: "#6B7280" },
              },
              x: { ticks: { color: "#6B7280" } },
            },
            plugins: {
              legend: { labels: { color: "#6B7280" } },
            },
          }}
        />
      </div>
    </div>
  );
}