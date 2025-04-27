import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Fragment } from 'react';

const StyledText = styled('text', {
  shouldForwardProp: (prop) => prop !== 'variant',
})(({ theme }) => ({
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fill: (theme.vars || theme).palette.text.secondary,
  variants: [
    {
      props: {
        variant: 'primary',
      },
      style: {
        fontSize: theme.typography.h5.fontSize,
      },
    },
    {
      props: ({ variant }) => variant !== 'primary',
      style: {
        fontSize: theme.typography.body2.fontSize,
      },
    },
    {
      props: {
        variant: 'primary',
      },
      style: {
        fontWeight: theme.typography.h5.fontWeight,
      },
    },
    {
      props: ({ variant }) => variant !== 'primary',
      style: {
        fontWeight: theme.typography.body2.fontWeight,
      },
    },
  ],
}));

function PieCenterLabel({ primaryText, secondaryText }) {
  const { width, height, left, top } = useDrawingArea();
  const primaryY = top + height / 2 - 10;
  const secondaryY = primaryY + 24;

  return (
    <Fragment>
      <StyledText variant="primary" x={left + width / 2} y={primaryY}>
        {primaryText}
      </StyledText>
      <StyledText variant="secondary" x={left + width / 2} y={secondaryY}>
        {secondaryText}
      </StyledText>
    </Fragment>
  );
}

PieCenterLabel.propTypes = {
  primaryText: PropTypes.string.isRequired,
  secondaryText: PropTypes.string.isRequired,
};

export default function DeviceOverview() {
  // Example data - replace with your own backend/API logic
  const deviceStatus = [
    { id: 0, value: 18000, label: 'Online', color: '#4CAF50' },
    { id: 1, value: 8000, label: 'Offline', color: '#BE3053' },
  ];

  const networkTypes = [
    { id: 0, value: 4000, label: 'LoRa', color: '#2196F3' },
    { id: 1, value: 8000, label: 'NB-IoT', color: '#FF9800' },
    { id: 2, value: 14000, label: 'WiFi', color: '#9C27B0' },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" align="center" gutterBottom>
          Devices Status & Network Types
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <PieChart
            //colors= {['#4CAF50', '#BE3053', '#2196F3', '#FF9800', '#9C27B0']}
            series={[
              {
                data: deviceStatus,
                innerRadius: 50,
                outerRadius: 80,
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: { innerRadius: 60, additionalRadius: -10, color: 'gray' },
                //arcLabel: (item) => `${item.label} (${item.value})`,
                
              },
              {
                data: networkTypes,
                innerRadius: 100,
                outerRadius: 140,
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: { innerRadius: 110, additionalRadius: -10, color: 'gray' },
                //arcLabel: (item) => `${item.label} (${item.value})`,
                //colors: NETWORK_COLORS,
              },
            ]}
            width={400}
            height={300}
          >
            <PieCenterLabel primaryText="26K" secondaryText="Total" />
          </PieChart>
        </Box>
      </CardContent>
    </Card>
  );
};
