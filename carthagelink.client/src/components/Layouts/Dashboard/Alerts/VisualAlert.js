/*import { useEffect, useState } from 'react';
import { useAlertContext } from '../../../../contexts/AlertContext.js';
import { X } from 'lucide-react';

const VisualAlert = () => {
  const { latestAlert } = useAlertContext();
  const [visible, setVisible] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);

  useEffect(() => {
    if (latestAlert) {
      setCurrentAlert(latestAlert);
      setVisible(true);
      
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [latestAlert]);

  if (!visible || !currentAlert) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fadeIn">
      <div 
        className={`flex items-start p-4 rounded-lg shadow-lg border-l-4 max-w-xs sm:max-w-md ${
          currentAlert.severity === 'Critical' 
            ? 'bg-red-50 dark:bg-red-900/30 border-red-500' 
            : currentAlert.severity === 'High' 
              ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-500'
              : currentAlert.severity === 'Medium'
                ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-500'
                : 'bg-blue-50 dark:bg-blue-900/30 border-blue-500'
        }`}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: currentAlert.severity === 'Critical' 
                  ? '#ef4444' 
                  : currentAlert.severity === 'High'
                    ? '#f97316'
                    : currentAlert.severity === 'Medium'
                      ? '#eab308'
                      : '#3b82f6'
              }}
            />
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {currentAlert.sensorName} Alert
            </h4>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {currentAlert.message}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {new Date(currentAlert.timestamp).toLocaleTimeString()}
          </p>
        </div>
        <button 
          onClick={() => setVisible(false)}
          className="ml-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default VisualAlert;*/