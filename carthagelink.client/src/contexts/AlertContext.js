import { createContext, useState, useEffect, useContext } from 'react';
import * as signalR from '@microsoft/signalr';
import axios from 'axios';

export const AlertContext = createContext();

const SENSORS = {
  0: { name: 'Temperature', unit: '°C', color: '#FF6B6B', icon: 'thermometer', thresholds: { critical: 80, warning: 60 } },
  1: { name: 'Humidity', unit: '%', color: '#4ECDC4', icon: 'droplet', thresholds: { critical: 90, warning: 70 } },
  2: { name: 'Speedometer', unit: 'km/h', color: '#45B7D1', icon: 'gauge', thresholds: { critical: 120, warning: 90 } },
  3: { name: 'Accelerometer', unit: 'm/s²', color: '#FFA07A', icon: 'move-3d', thresholds: { critical: 15, warning: 10 } },
  4: { name: 'Waterlevel', unit: 'cm', color: '#A28DFF', icon: 'waves', thresholds: { critical: 200, warning: 150 } },
  //System: { name: 'System', unit: '', color: '#FFA500', icon: 'alert-triangle', thresholds: { critical: 1, warning: 0 } }
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [latestAlert, setLatestAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const processAlert = (rawAlert) => {
    if (!rawAlert) return null;
    
    // Handle different alert formats (API vs SignalR)
    const normalizedAlert = {
      id: rawAlert.id || rawAlert._id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      deviceId: rawAlert.deviceId || rawAlert.DeviceId || 'unknown',
      sensorType: rawAlert.sensorType || rawAlert.SensorType,
      value: rawAlert.value || rawAlert.Value,
      message: rawAlert.message || rawAlert.Message,
      timestamp: rawAlert.timestamp || rawAlert.Timestamp || new Date().toISOString()
    };
  
    // System alerts handling
    if (normalizedAlert.message?.includes("Missing sensor data")) {
      return {
        ...normalizedAlert,
        sensorType: 'System',
        sensorName: 'System Warning',
        unit: '',
        value: 0,
        severity: 'Warning',
        isSystemAlert: true,
        time: new Date(normalizedAlert.timestamp).toLocaleTimeString()
      };
    }
  
    // Normalize sensor type
    const sensorType = typeof normalizedAlert.sensorType === 'string' 
      ? {
          'temperature': 0,
          'humidity': 1,
          'speedometer': 2,
          'accelerometer': 3,
          'waterlevel': 4
        }[normalizedAlert.sensorType.toLowerCase()] 
      : normalizedAlert.sensorType;
  
    const sensorConfig = SENSORS[sensorType];
    if (!sensorConfig) {
      console.error('Invalid sensor type:', normalizedAlert.sensorType, 'in alert:', normalizedAlert);
      return null;
    }
  
    // Extract value from message if not provided
    let value = normalizedAlert.value;
    if (value === undefined || value === null) {
      const valueMatch = normalizedAlert.message.match(/\(([\d.]+)\)/);
      value = valueMatch ? parseFloat(valueMatch[1]) : '--';
    }
  
    // Calculate severity
    let severity = 'Medium';
    if (value !== '--') {
      if (value >= sensorConfig.thresholds.critical) severity = 'Critical';
      else if (value >= sensorConfig.thresholds.warning) severity = 'High';
    }
  
    return {
      ...normalizedAlert,
      sensorType,
      sensorName: sensorConfig.name,
      value,
      unit: sensorConfig.unit,
      severity,
      time: new Date(normalizedAlert.timestamp).toLocaleTimeString(),
      isSystemAlert: false,
      icon: sensorConfig.icon,
      color: sensorConfig.color
    };
  };

  const generateSensorColor = (sensorType) => {
    return SENSORS[sensorType]?.color || '#94a3b8';
  };

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds/60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds/3600)}h ago`;
    return `${Math.floor(seconds/86400)}d ago`;
  };

  const generateTrendData = () => Array(5).fill(0).map(() => Math.random() * 100);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7086/alertHub")
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveAlert", (alert) => {
      const processedAlert = processAlert(alert);
      if (processedAlert) {
        setLatestAlert(processedAlert);
        setAlerts(prev => [processedAlert, ...prev]);
      }
    });

    const fetchAlerts = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("https://localhost:7086/api/Alerts");
        const processedAlerts = res.data.map(processAlert).filter(Boolean);
        setAlerts(processedAlerts);
        if (processedAlerts.length > 0) {
          setLatestAlert(processedAlerts[0]);
        }
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    connection.start()
      .then(() => {
        console.log("SignalR Connected");
        fetchAlerts();
      })
      .catch(err => console.error("SignalR Connection Error:", err));

    return () => connection.stop();
  }, []);

  return (
    <AlertContext.Provider value={{ 
      alerts, 
      latestAlert,
      isLoading,
      generateSensorColor,
      formatRelativeTime,
      generateTrendData,
      SENSORS
    }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlertContext = () => useContext(AlertContext);