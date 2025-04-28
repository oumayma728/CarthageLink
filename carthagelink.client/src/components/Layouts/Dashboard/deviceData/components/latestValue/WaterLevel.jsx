import PropTypes from 'prop-types';
import { useState, useEffect, useContext } from 'react';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses } from '@mui/x-charts/LineChart';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { color } from 'd3-color';
import { interpolateRgb } from 'd3-interpolate';
import LiquidFillGauge from 'react-liquid-gauge';
import AreaGradient from './AreaGradient';
import { getSensorDataByField } from '../../../../../../api/SensorDataApi.js';
import { DarkModeContext } from '../../../../../../contexts/DarkModeContext.js';

export default function WaterLevel({ value, deviceId }) {
  const [waterLevel, setWaterLevel] = useState(value);
  const [latestValues, setLatestValues] = useState([]);
  const [timestamps, setTimestamps] = useState([]);

  const { darkMode } = useContext(DarkModeContext);

  const darkModeColor = '#1F2937'; // Dark background color for dark mode

  useEffect(() => {
    setWaterLevel(value);
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
      const response = await getSensorDataByField('waterlevel', deviceId, limit);
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

  // Updated to use the same teal color as Accelerometer
  const primaryColor = '#4393E4';
  const startColor = color(primaryColor).darker(0.2).toString();
  const endColor = color(primaryColor).brighter(0.2).toString();
  const interpolate = interpolateRgb(startColor, endColor);
  const fillColor = interpolate(value / 100);
  
  const gradientStops = [
    {
      key: '0%',
      stopColor: color(fillColor).darker(0.5).toString(),
      stopOpacity: 1,
      offset: '0%'
    },
    {
      key: '50%',
      stopColor: fillColor,
      stopOpacity: 0.75,
      offset: '50%'
    },
    {
      key: '100%',
      stopColor: color(fillColor).brighter(0.5).toString(),
      stopOpacity: 0.5,
      offset: '100%'
    }
  ];

  return (
    <Card sx={{ padding: 2, backgroundColor: darkMode ? darkModeColor : 'white' }}>
      <CardContent sx={{ height: "100%" }}>
        <Typography variant='h5' align='center' gutterBottom sx={{ color: darkMode ? 'white' : 'black' }}>
          Water Level
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box height="68%" display="flex" justifyContent="center" alignItems="center">
          <LiquidFillGauge 
            width={150}
            height={150}
            value={waterLevel}
            percent="%"
            textSize={1}
            textOffsetX={0}
            textOffsetY={0}
            textRenderer={({ value, width, height, textSize, percent }) => {
              value = Math.round(value);
              const radius = Math.min(height / 2, width / 2);
              const textPixels = (textSize * radius / 2);
              const valueStyle = {
                  fontSize: textPixels
              };
              const percentStyle = {
                  fontSize: textPixels * 0.8,
              };

              return (
                <tspan>
                  <tspan className="value" style={valueStyle}>{value}</tspan>
                  <tspan style={percentStyle}>{percent}</tspan>
                </tspan>
              );
            }}
            riseAnimation
            waveAnimation
            waveFrequency={2}
            waveAmplitude={1}
            gradient
            gradientStops={gradientStops}
            circleStyle={{
                fill: fillColor
            }}
            waveStyle={{
                fill: fillColor
            }}
            textStyle={{
                fill: color(darkMode ? '#fff' : '#444').toString(),
                fontFamily: 'Arial'
            }}
            waveTextStyle={{
                fill: color('#fff').toString(),
                fontFamily: 'Arial'
            }}       
          />
        </Box>
        <Box sx={{ width: '100%', height: 60, mb: 5 }}>
          <SparkLineChart
            colors={[primaryColor]}  // Updated to use the same color
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
            <AreaGradient color={primaryColor} id={`area-gradient-${value}`} />
          </SparkLineChart>
        </Box>
      </CardContent>
    </Card>
  );
}

WaterLevel.propTypes = {
  value: PropTypes.number.isRequired,
  deviceId: PropTypes.string.isRequired,
};
