import PropTypes from 'prop-types';
import { useState, useEffect, useContext } from 'react';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses } from '@mui/x-charts/LineChart';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import GaugeComponent from 'react-gauge-component';
import AreaGradient from './AreaGradient';
import { getSensorDataByField } from '../../../../../../api/SensorDataApi.js';
import { DarkModeContext } from '../../../../../../contexts/DarkModeContext.js'; // Import DarkModeContext

export default function Humidity({ value, deviceId }) {
  const [humidity, setHumidity] = useState(value);
  const [latestValues, setLatestValues] = useState([]);
  const [timestamps, setTimestamps] = useState([]);

  // Access dark mode from the context
  const { darkMode } = useContext(DarkModeContext);

  const darkModeColor = '#1F2937'; // Dark background color for dark mode

  useEffect(() => {
    setHumidity(value);
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
      const response = await getSensorDataByField('humidity', deviceId, limit);
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

  return (
    <div className={`rounded-lg shadow-md p-4 h-full flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <Card sx={{ padding: 2, backgroundColor: darkMode ? darkModeColor : 'white' }}>
        <CardContent sx={{ height: "100%" }}>
          <Typography variant='h5' align='center' gutterBottom sx={{ color: darkMode ? 'white' : 'black' }}>
            Humidity
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box height="70%" display="flex" justifyContent="center" alignItems="center">
            <GaugeComponent
              type="semicircle"
              arc={{
                colorArray: ['#C7DFF7', '#97C3F0' ,'#4393E4'],
                padding: 0.02,
                subArcs: [
                  { limit: 30 },
                  { limit: 70 },
                  { limit: 100 },
                ],
              }}
              labels={{
                tickLabels: {
                  type: "inner",
                  ticks: [
                    { value: 30 },
                    { value: 70 },
                    { value: 100 }
                  ],
                }
              }}
              pointer={{
                type: "blob",
                animationDelay: 1
              }}
              value={humidity}
            />
          </Box>

          <Box sx={{ width: '100%', height: 60, mb: 5 }}>
            <SparkLineChart
              colors={['#97C3F0']}
              data={latestValues}
              valueFormatter={(value) => value + ' %'}
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
                  fill: `url(#area-gradient-${value})`,
                },
              }}
            >
              <AreaGradient color={"#97C3F0"} id={`area-gradient-${value}`} />
            </SparkLineChart>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

Humidity.propTypes = {
  value: PropTypes.number.isRequired,
  deviceId: PropTypes.string.isRequired,
};
