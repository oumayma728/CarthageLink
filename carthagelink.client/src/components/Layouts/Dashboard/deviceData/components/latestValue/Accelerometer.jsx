import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
} from 'chart.js';
import GaugeComponent from 'react-gauge-component';
import { getSensorDataByField } from '../../../../../../api/SensorDataApi.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);

export default function Accelerometer({ value, deviceId }) {
  const [acceleration, setAcceleration] = useState(value);
  const [latestValues, setLatestValues] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    setAcceleration(value);
    setLatestValues(prev => {
      const updated = [...prev, value];
      return updated.slice(-20); // Limit to last 20 values
    });
    setTimestamps(prev => {
      const updated = [...prev, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })];
      return updated.slice(-20);
    });
  }, [value]);

  const fetchSensorData = async (deviceId, limit) => {
    try {
      const response = await getSensorDataByField('accelerometer', deviceId, limit);
      if (response && response.data) {
        const reversed = response.data.toReversed();
        setLatestValues(reversed.map(d => d.value));
        setTimestamps(
          reversed.map(d =>
            new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          )
        );
      }
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  }

  useEffect(() => {
    fetchSensorData(deviceId, 20);
  }, [deviceId]);

  // Chart data configuration
  const chartData = {
    labels: timestamps,
    datasets: [
      {
        label: 'Acceleration (m/s²)',
        data: latestValues,
        borderColor: '#39E3B8',
        backgroundColor: 'rgba(57, 227, 184, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y} m/s²`
        }
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
      <h3 className="text-xl font-semibold text-center mb-2">Accelerometer</h3>
      <div className="border-b border-gray-200 mb-4"></div>
      
      <div className="flex-grow flex flex-col justify-center items-center mb-4">
        <GaugeComponent
          minValue={-60}
          value={acceleration}
          maxValue={100}      
          arc={{
            nbSubArcs: 8,
            colorArray: ['#5BE12C', '#F5CD19', "#4393E4"],
            width: 0.3,
            padding: 0.003
          }}
          labels={{
            valueLabel: {
              style: { fontSize: 40 },
              formatTextValue: (value) => `${value} m/s²`,
            },
            tickLabels: {
              type: "outer",
              ticks: [
                { value: -20 },
                { value: -40 },
                { value: 10 },
                { value: 60 },
                { value: 100 },
              ],
              defaultTickValueConfig: {
                formatTextValue: (value) => `${value} m/s²`,
                style: { fontSize: 10 },
              }
            }
          }}
        />
      </div>
      
      <div className="w-full h-16">
        <Line
          ref={chartRef}
          data={chartData}
          options={chartOptions}
        />
      </div>
    </div>
  );
}

Accelerometer.propTypes = {
  value: PropTypes.number.isRequired,
  deviceId: PropTypes.string.isRequired,
};