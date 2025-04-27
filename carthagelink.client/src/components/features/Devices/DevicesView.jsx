import { HubConnectionBuilder } from '@microsoft/signalr';
import { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';

// imports
import SensorsConfig from "../../../components/Layouts/Dashboard/deviceData/components/SensorsConfig.jsx";
import Humidity from "../../../components/Layouts/Dashboard/deviceData/components/latestValue/Humidity.jsx";
import WaterLevel from "../../../components/Layouts/Dashboard/deviceData/components/latestValue/WaterLevel.jsx";
import Temperature from "../../../components/Layouts/Dashboard/deviceData/components/latestValue/Temperature.jsx";
import Accelerometer from "../../../components/Layouts/Dashboard/deviceData/components/latestValue/Accelerometer.jsx";
import Speedometer from "../../../components/Layouts/Dashboard/deviceData/components/latestValue/Speedometer.jsx";
import { getLatestByDeviceId } from "../../../api/SensorDataApi.js";
import DashboardLayout from '../../Layouts/DashboardLayout.jsx';

const sensorComponents = {
  humidity: Humidity,
  waterlevel: WaterLevel,
  temperature: Temperature,
  accelerometer: Accelerometer,
  speedometer: Speedometer,
};

export default function Index() {
  const { deviceId } = useParams();
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

  const connectionRef = useRef(null); // to keep the connection persistent

  const fetchInitialData = async (deviceId) => {
    try {
      setLoading(true);
      const result = await getLatestByDeviceId(deviceId);
      if (result?.data) {
        const receivedData = result.data.data;
        setSensorData(receivedData);
        console.log("Initial sensor data received:", receivedData);
      }
    } catch (error) {
      console.error("Failed to fetch initial sensor data:", error);
      setError('No sensor data present... maybe try adding some sensors to the device.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData(deviceId);
  }, [deviceId]);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:7086/sensorHub")
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    connection
      .start()
      .then(() => {
        console.log("SignalR connected");
        connection.invoke("SubscribeToDevice", deviceId);
      })
      .catch(err => {
        console.error("Connection failed:", err);
      });

    connection.on("ReceiveSensorData", (incomingData) => {
      if (incomingData.deviceId === deviceId) {
        setSensorData(incomingData.data);
        console.log("Real-time data updated:", incomingData);
      }
    });

    return () => {
      if (connectionRef.current) {
        connectionRef.current.invoke("UnsubscribeFromDevice", deviceId).finally(() => {
          connectionRef.current.stop();
        });
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
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography component="h2" variant="h6" gutterBottom>
            Device Dashboard
          </Typography>
          <Button variant="contained" color="secondary" onClick={() => setOpenDialog(true)} sx={{ mb: 2 }}>
            Configure Sensors
          </Button>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ my: 2, mx: 'auto', width: 'fit-content' }}>{error}</Alert>
        )}

        {!loading && !error && (
          <>
            {(latestValueSensors.length > 0 || Object.keys(sensorData).length > 0) ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {(latestValueSensors.length > 0 ? latestValueSensors : Object.keys(sensorData)).map(sensor => {
                  const SensorComponent = sensorComponents[sensor];
                  return SensorComponent ? <SensorComponent key={sensor} value={sensorData[sensor]} deviceId={deviceId} /> : null;
                })}
              </Box>
            ) : (
              <Alert severity="warning" sx={{ mt: 4 }}>
                No sensors selected. Click <strong>Configure Sensors</strong> to add some to the dashboard.
              </Alert>
            )}

            <SensorsConfig
              open={openDialog}
              onClose={() => setOpenDialog(false)}
              selectedSensors={{ latest: latestValueSensors, timeseries: timeSeriesSensors }}
              onSave={handleSaveConfig}
            />
          </>
        )}
      </Box>
    </DashboardLayout>
  );
}
