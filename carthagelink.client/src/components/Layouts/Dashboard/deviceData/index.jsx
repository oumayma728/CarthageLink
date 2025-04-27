import { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';
import { HubConnectionBuilder } from '@microsoft/signalr';

// Components
import SensorsConfig from "./components/SensorsConfig";
import Humidity from "./components/latestValue/Humidity";
import WaterLevel from "./components/latestValue/WaterLevel";
import Temperature from "./components/latestValue/Temperature";
import Accelerometer from "./components/latestValue/Accelerometer";
import Speedometer from "./components/latestValue/Speedometer";

// API
import { getLatestByDeviceId } from "../../../../api/SensorDataApi";

const sensorComponents = {
  humidity: Humidity,
  waterlevel: WaterLevel,
  temperature: Temperature,
  accelerometer: Accelerometer,
  speedometer: Speedometer,
};

export default function FactoryDevice({ deviceId }) {
  const [openDialog, setOpenDialog] = useState(false);
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
        const detectedSensors = Object.keys(receivedData).filter(sensor => sensorComponents[sensor]);
        setLatestValueSensors(detectedSensors);
      }
    } catch (error) {
      console.error("Failed to fetch initial sensor data:", error);
      setError('No sensor Data present... maybe try adding some sensors to the device.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deviceId) {
      fetchInitialData(deviceId);
    }
  }, [deviceId]);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:7086/sensorHub")
      .withAutomaticReconnect()
      .build();

    let isConnected = false;

    connection.start()
      .then(() => {
        isConnected = true;
        console.log("SignalR connected");
        return connection.invoke("SubscribeToDevice", deviceId);
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
          {latestValueSensors.length > 0 ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {latestValueSensors.map(sensor => {
                const SensorComponent = sensorComponents[sensor];
                return <SensorComponent key={sensor} value={sensorData[sensor]} deviceId={deviceId} />;
              })}
            </Box>
          ) : (
            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
              <Alert severity="warning" sx={{ px: 3, py: 1.5 }}>
                No sensors selected. Click <strong>Configure Sensors</strong> to add some to the dashboard.
              </Alert>
            </Box>
          )}
          <SensorsConfig
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            selectedSensors={{ latest: latestValueSensors, timeseries: timeSeriesSensors }}
            onSave={handleSaveConfig}
          />
        </div>
      )}
    </Box>
  );
}