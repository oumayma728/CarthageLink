import { Cpu, Factory, Users, Server } from "lucide-react";

const activities = [
  {
    icon: <Cpu className="text-blue-500 w-5 h-5" />,
    action: "Sensor A reported high temperature",
    location: "Tunis, Tunisia",
    time: "2 mins ago",
  },
  {
    icon: <Server className="text-green-500 w-5 h-5" />,
    action: "Device B connected ",
    location: "Sousse, Tunisia",
    time: "10 mins ago",
  },
  {
    icon: <Factory className="text-purple-500 w-5 h-5" />,
    action: "Factory X updated configuration",
    location: "Sfax, Tunisia",
    time: "30 mins ago",
  },
  {
    icon: <Users className="text-pink-500 w-5 h-5" />,
    action: "New operator added",
    location: "Gabes, Tunisia",
    time: "1 hour ago",
  },
];

export default function ActivityFeed() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-l shadow-sm p-4 lg:col-span-1 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0 group"
          >
            <div className="mt-1 mr-3 group-hover:scale-110 transition-transform">
              {activity.icon}
            </div>
            <div className="flex-1">
              <p className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dark:text-white">
                {activity.action}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activity.location}
              </p>
            </div>
            <div className="text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap">
              {activity.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}