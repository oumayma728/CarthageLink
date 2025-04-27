import PropTypes from 'prop-types';
import { useState, useEffect} from 'react';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses } from '@mui/x-charts/LineChart';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Thermometer from 'react-thermometer-component'
import AreaGradient from './AreaGradient'; 
import { getSensorDataByField } from '../../../../../../api/SensorDataApi.js';

export default function Temperature({ value, deviceId }) {
  const [temperature, setTemperature] = useState(value);
  const [latestValues, setLatestValues] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    setTemperature(value);
    setLatestValues(prev => {
      const updated = [...prev, value];
      return updated.slice(-20);
    });
    setTimestamps(prev => {
      const updated = [...prev, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })];
      return updated.slice(-20);
    });
  }, [value]);

  const fetchSensorData = async (deviceId, limit) => {
    try {
      const response = await getSensorDataByField('temperature', deviceId, limit);
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
  } , [deviceId]);

  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Card sx={{ padding: 2 }}>
      <CardContent sx={{ height: "100%" }}>
        <Typography variant='h5' align='center' gutterBottom>
          Temperature
        </Typography>
        <Divider sx={{ mb: 2 }}/>
        <Box height="70%" display="flex" justifyContent="center" alignItems="center">
          <Thermometer
            theme={isDarkMode ? 'dark' : 'light'}
            value={temperature}
            max="100"
            steps="2"
            format="°C"
            size="normal"
            height="200"
          />
        </Box>
        <Box sx={{ width: '100%', height: 50 }}>
          <SparkLineChart
            colors={['#F44336']}
            data={latestValues}
            valueFormatter={(value) => value + ' °C'}
            area
            showHighlight
            showTooltip
            xAxis={{
              scaleType: 'point',
              data: timestamps,
              valueFormatter: (value) => value,
            }}
            sx={{
              [`& .${areaElementClasses.root}`]: {
                fill:`url(#area-gradient-${value})`,
              },
            }}
          >  
            <AreaGradient color={"#F44336"} id={`area-gradient-${value}`} />
          </SparkLineChart>
        </Box>
      </CardContent>
    </Card>
  );
}

Temperature.propTypes = {
  value: PropTypes.number.isRequired,
  deviceId: PropTypes.string.isRequired,
};