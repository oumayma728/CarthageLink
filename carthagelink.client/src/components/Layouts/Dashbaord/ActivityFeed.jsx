import PropTypes from 'prop-types';

export default function ActivityFeed({ activities, darkMode }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 lg:col-span-2 hover:shadow-md transition-all duration-200 ${darkMode ? 'dark' : ''}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white transition-colors duration-200">
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={index} 
            className={`flex items-start pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0 group transition-colors duration-200 ${darkMode ? 'dark' : ''}`}
          >
            <div className="mt-1 mr-3 group-hover:scale-110 transition-transform duration-200">
              {activity.icon}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                {activity.action}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                {activity.location}
              </p>
            </div>
            <div className="text-sm text-gray-400 dark:text-gray-500 transition-colors duration-200">
              {activity.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

ActivityFeed.propTypes = {
  activities: PropTypes.array.isRequired,
  darkMode: PropTypes.bool
};