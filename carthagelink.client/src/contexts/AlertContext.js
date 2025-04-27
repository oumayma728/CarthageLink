import { createContext, useState, useEffect, useContext } from 'react';
import * as signalR from '@microsoft/signalr';
import axios from 'axios';

export const AlertContext = createContext();

const SENSORS = {
  1: { name: 'Temperature', unit: '°C', color: '#7c3aed' },
  2: { name: 'Humidity', unit: '%', color: '#10b981' },
  3: { name: 'Speedometer', unit: 'km/h', color: '#0ea5e9' },
  4: { name: 'Accelerometer', unit: 'm/s²', color: '#f59e0b' },
  5: { name: 'Waterlevel', unit: 'cm', color: '#6366f1' }
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [latestAlert, setLatestAlert] = useState(null);

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

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7086/alertHub")
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.on("ReceiveAlert", (alert) => {
      console.log("New alert received:", alert);
      
      const newAlert = {
        id: alert._id || Math.random().toString(),
        deviceId: alert.deviceId || alert.DeviceId || 'Unknown Device',
        sensorType: alert.sensorType || alert.SensorType,
        sensorName: SENSORS[alert.sensorType || alert.SensorType]?.name || 'Sensor',
        value: alert.value || alert.Value || 'N/A',
        message: alert.message || alert.Message || 'No message',
        timestamp: alert.timestamp || alert.Timestamp || new Date().toISOString(),
        severity: alert.severity || alert.Severity || 'Medium'
      };

      setLatestAlert(newAlert);
      setAlerts(prev => [newAlert, ...prev].slice(0, 50)); // Keep last 50 alerts
    });

    const fetchAlerts = async () => {
      try {
        const res = await axios.get("https://localhost:7086/api/Alerts");
        const formattedAlerts = res.data.map(alert => ({
          id: alert._id || Math.random().toString(),
          deviceId: alert.deviceId || alert.DeviceId || 'Unknown Device',
          sensorType: alert.sensorType || alert.SensorType,
          sensorName: SENSORS[alert.sensorType || alert.SensorType]?.name || 'Sensor',
          value: alert.value || alert.Value || 'N/A',
          message: alert.message || alert.Message || 'No message',
          timestamp: alert.timestamp || alert.Timestamp || new Date().toISOString(),
          severity: alert.severity || alert.Severity || 'Medium'
        }));
        setAlerts(formattedAlerts);
        if (formattedAlerts.length > 0) {
          setLatestAlert(formattedAlerts[0]);
        }
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      }
    };

    connection.start()
      .then(() => {
        console.log("SignalR Connected");
        fetchAlerts();
      })
      .catch(err => console.error("SignalR Connection Error:", err));

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <AlertContext.Provider value={{ 
      alerts, 
      latestAlert,
      generateSensorColor,
      formatRelativeTime
    }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlertContext must be used within an AlertProvider");
  }
  return context;
};