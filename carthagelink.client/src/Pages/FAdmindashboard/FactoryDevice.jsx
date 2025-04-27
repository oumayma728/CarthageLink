import { HubConnectionBuilder } from '@microsoft/signalr';
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';

//import * as signalR from '@microsoft/signalr';
// project imports
import SensorsConfig from "../../components/Layouts/Dashboard/deviceData/components/SensorsConfig.jsx";
import Humidity from "../../components/Layouts/Dashboard/deviceData/components/latestValue/Humidity.jsx";
import WaterLevel from "../../components/Layouts/Dashboard/deviceData/components/latestValue/WaterLevel.jsx";
import Temperature from "../../components/Layouts/Dashboard/deviceData/components/latestValue/Temperature.jsx";
import Accelerometer from"../../components/Layouts/Dashboard/deviceData/components/latestValue/Accelerometer.jsx";
import Speedometer from "../../components/Layouts/Dashboard/deviceData/components/latestValue/Speedometer.jsx";
import { getLatestByDeviceId } from "../../api/SensorDataApi.js";
import DashboardLayout from '../../components/Layouts/DashboardLayout.jsx';

const sensorComponents = {
  humidity: Humidity,
  waterlevel: WaterLevel,
  temperature: Temperature,
  accelerometer: Accelerometer,
  speedometer: Speedometer,
};

export default function FactoryDevice() {
  const { deviceId } = useParams();
  const [openDialog, setOpenDialog] = useState(false); // manage sensor config dialog
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latestValueSensors, setLatestValueSensors] = useState([]);
  const [timeSeriesSensors, setTimeSeriesSensors] = useState([]);
  const [sensorData, setSensorData] = useState({
    humidity: 0,
    waterlevel: 0,
    temperature: 0,
    accelerometer: 0,
    speedometer: 0,
  });

  const fetchInitialData = async (deviceId) => {
    try {
      setLoading(true);
      const result = await getLatestByDeviceId(deviceId);
      if (result?.data) {
        const receivedData = result.data.data;
        setSensorData(receivedData);

        // Auto-select sensors to display based on the available data keys
        const detectedSensors = Object.keys(receivedData).filter(sensor => sensorComponents[sensor]);
        setLatestValueSensors(detectedSensors); // You can also split into timeSeries if needed
      }
    } catch (error) {
      console.error("Failed to fetch initial sensor data:", error);
      //setError('Failed to load Sensor Data. Please try again later.');
      setError('No sensor Data present... maybe try adding some sensors to the device.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData(deviceId);
  }, [deviceId]);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:7086/sensorHub") // your hub endpoint
      .withAutomaticReconnect()
      .build();

    let isConnected = false;

    connection
      .start()
      .then(() => {
        isConnected = true;
        console.log("SignalR connected");
      // Subscribe to the device you care about
        return connection.invoke("SubscribeToDevice", "6617f12e4d1f4a1d88c6c9a1");
    })
    .catch(err => {
      console.error("Connection failed:", err);
    });
  
    connection.on("ReceiveSensorData", sensorData => {
      if (sensorData.deviceId === deviceId) {
        setSensorData(sensorData.data);
        console.log("Received sensor data:", sensorData);
      }
    });
  
    return () => {
      if (isConnected) {
        connection.invoke("UnsubscribeFromDevice", deviceId)
          .catch(err => console.error("Unsubscribe failed:", err))
          .finally(() => {
            connection.stop()
              .catch(err => console.error("Error stopping connection:", err));
          });
      } else {
        connection.stop()
          .catch(err => console.error("Stop error (not connected):", err));
      }
    };
  }, [deviceId]);

  const handleSaveConfig = ({ latest, timeseries }) => {
    setLatestValueSensors(latest);
    setTimeSeriesSensors(timeseries);
  };

  return (
    <DashboardLayout>
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 0 }}>
        <Typography component="h2" variant="h6" gutterBottom>
          Device Dashboard
        </Typography>
        <Button variant="contained" color="secondary" onClick={() => setOpenDialog(true)} sx={{ marginBottom: 2 }}>
          Configure Sensors
        </Button>
      </Box>
      {loading && (
        <div style={{ 
          position: 'fixed',
          top: 0,
          left: 100,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <CircularProgress />
        </div>
      )}
      {error && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
          <Alert severity="error">{error}</Alert>
        </div>
      )}
      {!loading && !error && (
       <div>
          {/* Latest Value Sensors */}
          {/*
          <Typography component="h2" variant="h6" gutterBottom>
            Latest Value Sensors
          </Typography>
          */}
          {latestValueSensors.length > 0 ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {latestValueSensors.map(sensor => {
                const SensorComponent = sensorComponents[sensor];
                return <SensorComponent key={sensor} value={sensorData[sensor]} deviceId={deviceId} />;
              })}
            </Box>
          ) : (
            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
              <Alert
                severity="warning"
                sx={{
                  px: 3,
                  py: 1.5,
                }}
              >
                No sensors selected. Click <strong>Configure Sensors</strong> to add some to the dashboard.
              </Alert>
            </Box>
          )}

          {/* Time Series Data */}
          {/* 
          <Typography component="h2" variant="h6" gutterBottom sx={{ mt: 5 }}>
            Time Series Data
          </Typography>
          {timeSeriesSensors.length > 0 ? (
            <Box sx={{ mt: 5, display: "flex", flexWrap: "wrap", gap: 3 }}>
              {timeSeriesSensors.map(sensor => {
                const SensorComponent = sensorComponents[sensor];
                return <SensorComponent key={sensor} value={sensorData[sensor]} />;
              })}
            </Box>
          ) : (
            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
              <Alert
                severity="warning"
                sx={{
                  px: 3,
                  py: 1.5,
                }}
              >
                No time series data selected. Click <strong>Configure Sensors</strong> to add some to the dashboard.
              </Alert>
            </Box>
          )} 
          */}

          {/* Configuration Dialog */}
          <SensorsConfig
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            selectedSensors={{ latest: latestValueSensors, timeseries: timeSeriesSensors }}
            onSave={handleSaveConfig}
          />
        </div>
      )}
    </Box>
    </DashboardLayout>
  )
}
