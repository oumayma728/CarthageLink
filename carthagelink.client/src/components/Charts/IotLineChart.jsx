import PropTypes from 'prop-types';
import { useRef, useEffect, useState, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';

const TemperatureChart = ({ deviceId = "6617f12e4d1f4a1d88c6c9a1" }) => {
  const canvasRef = useRef(null);
  const [timeRange, setTimeRange] = useState('minute');
  const [currentData, setCurrentData] = useState({
    temperature: 0,
    time: new Date().toLocaleTimeString()
  });
  const [deviceStatus, setDeviceStatus] = useState('normal');
  const animationFrameRef = useRef();
 // const lastUpdateRef = useRef(Date.now());
  const [connection, setConnection] = useState(null);

  // Initialize SignalR connection
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("/sensorHub")
      .configureLogging(signalR.LogLevel.Information)
      .build();

    setConnection(newConnection);

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  // Start SignalR connection and handle messages
  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          console.log("SignalR Connected");
          
          connection.on("ReceiveSensorData", (data) => {
            if (data.DeviceId === deviceId) {
              setCurrentData({
                temperature: data.Temperature,
                time: new Date().toLocaleTimeString()
              });
              
              setSensorData(prev => {
                const newData = [...prev.slice(1), {
                  time: new Date(),
                  value: data.Temperature
                }];
                return newData;
              });
              
              updateStatus(data.Temperature);
            }
          });
        })
        .catch(err => console.error('SignalR Connection Error: ', err));
    }
  }, [connection, deviceId]);

  // Initial data setup
  const [sensorData, setSensorData] = useState(() => {
    const data = [];
    const now = new Date();
    const count = timeRange === 'second' ? 60 : (timeRange === 'minute' ? 60 : 24);
    
    for (let i = count - 1; i >= 0; i--) {
      const time = new Date(now);
      
      if (timeRange === 'second') {
        time.setSeconds(now.getSeconds() - i);
      } else if (timeRange === 'minute') {
        time.setMinutes(now.getMinutes() - i);
      } else {
        time.setHours(now.getHours() - i);
      }
      
      data.push({
        time,
        value: 25 // Default starting temperature
      });
    }
    
    return data;
  });

  // Update status based on temperature
  const updateStatus = useCallback((temperature) => {
    let newStatus = 'normal';
    if (temperature > 35) newStatus = 'critical';
    else if (temperature > 30) newStatus = 'warning';
    
    if (newStatus !== deviceStatus) {
      setDeviceStatus(newStatus);
    }
  }, [deviceStatus]);

  // Drawing function for temperature chart
  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth * 2;
    const height = canvas.height = canvas.offsetHeight * 2;
    const padding = 50;
    
    ctx.clearRect(0, 0, width, height);
    
    const values = sensorData.map(d => d.value);
    const minVal = Math.min(...values, 0); // Minimum of 0°C
    const maxVal = Math.max(...values, 50); // Maximum of 50°C
    const yScale = (height - padding * 2) / (maxVal - minVal || 1);
    const xScale = (width - padding * 2) / (sensorData.length - 1);
    
    // Draw temperature threshold zones
    ctx.fillStyle = 'rgba(239, 68, 68, 0.1)'; // Red for critical
    ctx.fillRect(
      padding,
      height - padding - (35 - minVal) * yScale,
      width - padding * 2,
      (35 - minVal) * yScale
    );
    
    ctx.fillStyle = 'rgba(245, 158, 11, 0.1)'; // Yellow for warning
    ctx.fillRect(
      padding,
      height - padding - (30 - minVal) * yScale,
      width - padding * 2,
      (35 - 30) * yScale
    );
    
    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Horizontal grid
    for (let i = 0; i <= 5; i++) {
      const y = padding + i * (height - padding * 2) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      const value = maxVal - i * (maxVal - minVal) / 5;
      ctx.fillText(`${value.toFixed(0)}°C`, padding - 10, y + 4);
    }
    
    // Vertical grid
    const xLabelStep = Math.ceil(sensorData.length / 6);
    for (let i = 0; i < sensorData.length; i += xLabelStep) {
      const x = padding + i * xScale;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
      
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      let label;
      if (timeRange === 'second') {
        label = sensorData[i].time.getSeconds() + 's';
      } else if (timeRange === 'minute') {
        label = sensorData[i].time.getMinutes() + 'm';
      } else {
        label = sensorData[i].time.getHours() + 'h';
      }
      ctx.fillText(label, x, height - padding + 20);
    }
    
    // Draw temperature line
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    sensorData.forEach((point, i) => {
      const x = padding + i * xScale;
      const y = height - padding - (point.value - minVal) * yScale;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Current temperature indicator
    const lastPoint = sensorData[sensorData.length - 1];
    const lastX = width - padding;
    const lastY = height - padding - (lastPoint.value - minVal) * yScale;
    
    ctx.fillStyle = '#4f46e5';
    ctx.beginPath();
    ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(
      `Temperature: ${lastPoint.value.toFixed(1)}°C`,
      lastX + 10,
      lastY - 10
    );
  }, [sensorData, timeRange]);

  // Animation frame effect
  useEffect(() => {
    const animate = () => {
      drawChart();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [drawChart]);

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold mr-3">Temperature Sensor ({deviceId})</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            deviceStatus === 'critical' ? 'bg-red-100 text-red-800' :
            deviceStatus === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {deviceStatus.toUpperCase()}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('hour')}
            className={`px-3 py-1 rounded-md text-xs ${
              timeRange === 'hour' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Hourly
          </button>
          <button
            onClick={() => setTimeRange('minute')}
            className={`px-3 py-1 rounded-md text-xs ${
              timeRange === 'minute' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Minute
          </button>
          <button
            onClick={() => setTimeRange('second')}
            className={`px-3 py-1 rounded-md text-xs ${
              timeRange === 'second' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Second
          </button>
        </div>
      </div>
      
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          className="w-full h-64"
        />
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-gray-500">Current Temp</div>
          <div className="font-semibold">
            {sensorData[sensorData.length - 1]?.value.toFixed(1)}°C
          </div>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-gray-500">Min Temp</div>
          <div className="font-semibold">
            {Math.min(...sensorData.map(d => d.value)).toFixed(1)}°C
          </div>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <div className="text-gray-500">Max Temp</div>
          <div className="font-semibold">
            {Math.max(...sensorData.map(d => d.value)).toFixed(1)}°C
          </div>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 text-right">
        Last updated: {currentData.time}
      </div>
    </div>
  );
};

TemperatureChart.propTypes = {
  deviceId: PropTypes.string
};

export default TemperatureChart;