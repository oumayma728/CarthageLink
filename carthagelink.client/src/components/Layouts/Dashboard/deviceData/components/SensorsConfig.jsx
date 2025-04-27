import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// List of all available sensors
const allSensors = ['temperature', 'humidity', 'waterlevel', 'accelerometer', 'speedometer'];

export default function SensorsConfig({ open, onClose, selectedSensors = {}, onSave }) {
  const [selections, setSelections] = useState({
    latest: [],
    timeseries: [],
  });

  useEffect(() => {
    if (open) {
      setSelections({
        latest: selectedSensors.latest || [],
        timeseries: selectedSensors.timeseries || [],
      });
    }
  }, [open, selectedSensors]);

  const handleCheckboxChange = (sensor, type) => {
    setSelections((prevSelections) => {
      const current = prevSelections[type];
      const updated = current.includes(sensor)
        ? current.filter((s) => s !== sensor)
        : [...current, sensor];

      return {
        ...prevSelections,
        [type]: updated,
      };
    });
  };

  const handleSave = () => {
    onSave({
      latest: selections.latest,
      timeseries: selections.timeseries,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Configure Sensors</h2>
        </div>
        
        <div className="p-4 overflow-auto">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Sensor
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Latest Value
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Time Series
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allSensors.map(sensor => (
                  <tr key={sensor}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sensor.charAt(0).toUpperCase() + sensor.slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <input
                        type="checkbox"
                        checked={selections.latest.includes(sensor)}
                        onChange={() => handleCheckboxChange(sensor, 'latest')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <input
                        type="checkbox"
                        checked={selections.timeseries.includes(sensor)}
                        onChange={() => handleCheckboxChange(sensor, 'timeseries')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Configure
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
        </div>
        
        <div className="p-4 border-t flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

SensorsConfig.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedSensors: PropTypes.shape({
    latest: PropTypes.arrayOf(PropTypes.string),
    timeseries: PropTypes.arrayOf(PropTypes.string)
  }),
  onSave: PropTypes.func.isRequired
};