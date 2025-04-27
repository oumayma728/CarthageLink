import { PieChart } from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ["Online", "Offline", "Maintenance"],
  datasets: [
    {
      data: [85, 10, 5],
      backgroundColor: ["#4CAF50", "#F44336", "#FFC107"],
      borderWidth: 0,
    },
  ],
};

export default function DeviceStatusChart() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <PieChart className="text-gray-500 dark:text-gray-400 w-5 h-5" />
        <h3 className="text-lg font-semibold dark:text-white">📊 Device Status</h3>
      </div>
      <div className="h-64">
        <Pie
          data={data}
          options={{
            plugins: {
              legend: { position: "bottom", labels: { color: "#6B7280" } },
            },
            onClick: (_, elements) => {
              if (elements.length > 0) {
                const status = ["online", "offline", "maintenance"][elements[0].index];
                console.log(`Filtering ${status} devices...`);
              }
            },
          }}
        />
      </div>
    </div>
  );
}