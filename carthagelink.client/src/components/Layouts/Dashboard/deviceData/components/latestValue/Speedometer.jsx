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

export default function Speedometer({ value, deviceId }) {
  const [Speed, setSpeed] = useState(value);
  const [latestValues, setLatestValues] = useState([]);
  const [timestamps, setTimestamps] = useState([]);

  // Access dark mode from the context
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    setSpeed(value);
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
      const response = await getSensorDataByField('speedometer', deviceId, limit);
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
    <Card sx={{ padding: 2, backgroundColor: darkMode ? 'grey.800' : 'white' }}>
      <CardContent sx={{ height: "100%" }}>
        <Typography variant='h5' align='center' gutterBottom sx={{ color: darkMode ? 'white' : 'black' }}>
          Speedometer
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box height='75%' display="flex" justifyContent="center" alignItems="center">
          <GaugeComponent
            value={Speed}
            type="radial"
            labels={{
              valueLabel: {
                style: { fontSize: 35 },
                formatTextValue: (value) => `${value} m/s`,
              },
              tickLabels: {
                type: "inner",
                ticks: [
                  { value: 20 },
                  { value: 40 },
                  { value: 60 },
                  { value: 80 },
                  { value: 100 }
                ],
                defaultTickValueConfig: {
                  formatTextValue: (value) => `${value} m/s`,
                  style: { fontSize: 10 },
                }
              }
            }}
            arc={{
              colorArray: ['#5BE12C','#EA4228'],
              subArcs: [ {}, {}, {}, {}, {}, {}, {}, {}],
              padding: 0.04,
              width: 0.3
            }}
            pointer={{
              elastic: true,
              animationDelay: 1
            }}
          />
        </Box>

        <Box sx={{ width: '100%', height: 50 }}>
          <SparkLineChart
            colors={['#E6C52A']}
            data={latestValues}
            valueFormatter={(value) => value + ' m/s'}
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
            <AreaGradient color={"#E6C52A"} id={`area-gradient-${value}`} />
          </SparkLineChart>
        </Box>
      </CardContent>
    </Card>
  );
}

Speedometer.propTypes = {
  value: PropTypes.number.isRequired,
  deviceId: PropTypes.string.isRequired,
};
