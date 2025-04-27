import { useState, useEffect } from 'react';
import { useNavigate , useParams } from 'react-router-dom';
import { Typography, CircularProgress, Box } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import SensorsIcon from '@mui/icons-material/Sensors';
import Alert from '@mui/material/Alert';

import { getFactoryById } from '../api/factoryApi.js';
import { getFactoryData } from '../api/insightsApi.js';


export default function Index() {
  const navigate = useNavigate();
  const { factoryId } = useParams();
  const [factoryName, setFactoryName] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deviceStatus = {
    0: "Active ",
    1: "Inactive",
    2: "maintenance",
  };

  const deviceStatusColor = {
    0: "red",
    1: "green",
    2: "yellow",
  };

 

  useEffect(() => {
    const fetchFactoryName = async () => {
    try {
        const response = await getFactoryById(factoryId);
        setFactoryName(response.data.name);
      } catch (error) {
        console.error('Error fetching factory name:', error);
      }
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getFactoryData(factoryId);
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load Data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchFactoryName();
  }, [factoryId]);

  const handleDeviceClick = (deviceId) => {
  navigate(`/insights/${factoryId}/devices/${deviceId}`);
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Box p={2}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          {factoryName}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack direction="row" spacing={2} mt={4}>
          <Stack direction="column" spacing={2} width="100%" border={1} borderColor="hsl(222deg 100% 65% / 20%)" borderRadius={4} p={5}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SensorsIcon sx={{  color: 'primary.main', mr: '10px' }} />
              Devices
            </Typography>
            <Divider color="hsl(222deg 100% 65% / 20%)"/>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Serial Number</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.devices.map(device => (
                    <TableRow key={device.id}>
                      <TableCell>{device.name}</TableCell>
                      <TableCell>{device.serialNumber}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <SensorsIcon sx={{ color: deviceStatusColor[device.status] }} />
                          <Typography variant="body2" ml={1}>
                            {deviceStatus[device.status]}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outlined" 
                          color="secondary"
                          onClick={() => handleDeviceClick(device.deviceId)}>                           View Data
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Stack>
      </Box>
    </div>
  )
}
