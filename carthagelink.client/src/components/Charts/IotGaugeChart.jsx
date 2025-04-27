import PropTypes from 'prop-types';

const SensorCard = ({ 
  sensorName = 'Sensor', 
  currentValue = 0, 
  targetValue = 0, 
  unit = '°C',
  isConnected = true
}) => {
  const difference = targetValue !== 0 
    ? ((currentValue - targetValue) / targetValue * 100).toFixed(1)
    : '0.0';
  const isAboveTarget = currentValue > targetValue;

  return (
    <div className={`bg-white p-4 rounded-lg shadow border ${
      isConnected ? 'border-gray-200' : 'border-yellow-400'
    } flex-1 min-w-[300px]`}>
      {!isConnected && (
        <div className="bg-yellow-50 text-yellow-800 text-xs p-1 mb-2 rounded text-center">
          Disconnected - Showing last known values
        </div>
      )}
      
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold">{sensorName}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          isAboveTarget ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {isAboveTarget ? 'ABOVE TARGET' : 'WITHIN RANGE'}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Target {sensorName.toLowerCase()}</p>
        <div className="text-3xl font-bold">
          {targetValue}{unit}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500">Current reading</p>
          <div className="text-2xl font-bold">
            {currentValue}{unit}
          </div>
        </div>
        <div className={`text-right ${isAboveTarget ? 'text-red-600' : 'text-green-600'}`}>
          <div className="text-lg font-semibold">
            {isAboveTarget ? '+' : ''}{difference}%
          </div>
          <p className="text-xs">
            {isAboveTarget ? 'Above' : 'Below'} target
          </p>
        </div>
      </div>

      <div className={`p-3 rounded-lg ${
        isAboveTarget ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'
      }`}>
        <p className="text-sm">
          Current {sensorName.toLowerCase()} is {currentValue}{unit}, it's {isAboveTarget ? 'higher' : 'lower'} than your target.
        </p>
        <p className="text-sm font-medium mt-1">
          {isAboveTarget ? 'Consider corrective measures' : 'Within optimal range'}
        </p>
      </div>
    </div>
  );
};

SensorCard.propTypes = {
  sensorName: PropTypes.string,
  currentValue: PropTypes.number,
  targetValue: PropTypes.number,
  unit: PropTypes.string,
  isConnected: PropTypes.bool
};

SensorCard.defaultProps = {
  sensorName: 'Sensor',
  currentValue: 0,
  targetValue: 0,
  unit: '°C',
  isConnected: true
};

export default SensorCard;