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
  5: { name: 'System', unit: '', color: '#FFA500', icon: 'alert-triangle', thresholds: { critical: 1, warning: 0 } }
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [latestAlert, setLatestAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connection, setConnection] = useState(null);

  const reportIssue = async (type, description) => {
    try {
      const response = await axios.post('https://localhost:7086/api/Issues', {
        type,
        description,
        reporter: "User" // You can get this from auth context
      });
      
      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error reporting issue:', error);
      return false;
    }
  };

  const processAlert = (rawAlert) => {
    if (!rawAlert) return null;
    
    const normalizedAlert = {
      id: rawAlert.id || rawAlert._id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      deviceId: rawAlert.deviceId || rawAlert.DeviceId || 'unknown',
      sensorType: rawAlert.sensorType || rawAlert.SensorType,
      value: rawAlert.value || rawAlert.Value,
      message: rawAlert.message || rawAlert.Message,
      timestamp: rawAlert.timestamp || rawAlert.Timestamp || new Date().toISOString()
    };
  
    // System alerts handling (including issues)
    if (normalizedAlert.sensorType === 5 || normalizedAlert.message?.includes("Missing sensor data")) {
      return {
        ...normalizedAlert,
        sensorType: 5,
        sensorName: 'System Issue',
        unit: '',
        value: 0,
        severity: 'Critical',
        isSystemAlert: true,
        time: new Date(normalizedAlert.timestamp).toLocaleTimeString(),
        icon: SENSORS[5].icon,
        color: SENSORS[5].color
      };
    }
  
    // Normalize sensor type
    const sensorType = typeof normalizedAlert.sensorType === 'string' 
      ? {
          'temperature': 0,
          'humidity': 1,
          'speedometer': 2,
          'accelerometer': 3,
          'waterlevel': 4,
          'system': 5
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
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7086/alertHub")
      .withAutomaticReconnect()
      .build();

    newConnection.on("ReceiveAlert", (alert) => {
      const processedAlert = processAlert(alert);
      if (processedAlert) {
        setLatestAlert(processedAlert);
        setAlerts(prev => [processedAlert, ...prev].slice(0, 100)); // Limit to 100 alerts
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

    newConnection.start()
      .then(() => {
        console.log("SignalR Connected");
        setConnection(newConnection);
        fetchAlerts();
      })
      .catch(err => console.error("SignalR Connection Error:", err));

    return () => {
      newConnection.stop();
    };
  }, []);

  return (
    <AlertContext.Provider value={{ 
      alerts, 
      latestAlert,
      isLoading,
      generateSensorColor,
      formatRelativeTime,
      generateTrendData,
      SENSORS,
      reportIssue,
      connection
    }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlertContext = () => useContext(AlertContext);