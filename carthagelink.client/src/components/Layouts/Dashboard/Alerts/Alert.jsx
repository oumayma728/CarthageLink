import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import axios from "axios";
import { Link } from "react-router-dom";
import DashboardLayout from "../../DashboardLayout";
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { 
  Typography, 
  Box, 
  Chip, 
  Paper,
  useTheme,
  useMediaQuery,
  Tooltip,
  Avatar,
  LinearProgress,
  Stack,
  Divider,
  Badge,
  IconButton,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button
} from "@mui/material";
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Eye, AlertTriangle, Bell, BellOff, Droplet, Gauge, Waves, Thermometer, Move3D } from "lucide-react";
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

const SENSORS = {
  0: { 
    name: 'Temperature', 
    unit: '°C', 
    color: '#FF6B6B',
    icon: <Thermometer size={18} />,
    thresholds: { critical: 80, warning: 60 }
  },
  1: { 
    name: 'Humidity', 
    unit: '%', 
    color: '#4ECDC4',
    icon: <Droplet size={18} />,
    thresholds: { critical: 90, warning: 70 }
  },
  2: { 
    name: 'Speed', 
    unit: 'km/h', 
    color: '#45B7D1',
    icon: <Gauge size={18} />,
    thresholds: { critical: 120, warning: 90 }
  },
  3: { 
    name: 'Acceleration', 
    unit: 'm/s²', 
    color: '#FFA07A',
    icon: <Move3D size={18} />,
    thresholds: { critical: 15, warning: 10 }
  },
  4: { 
    name: 'Water Level', 
    unit: 'cm', 
    color: '#A28DFF',
    icon: <Waves size={18} />,
    thresholds: { critical: 200, warning: 150 }
  }
};

const AlertCard = styled(Paper)(({ theme }) => ({
  borderRadius: '12px',
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden'
}));

const SensorAvatar = styled(Avatar)(({ sensorcolor, theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' 
    ? `${sensorcolor}30` 
    : `${sensorcolor}15`,
  color: sensorcolor,
  width: 36,
  height: 36
}));

export default function AlertsDashboard() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Helper functions
  const calculateSeverity = (sensorType, value) => {
    const sensor = SENSORS[sensorType];
    if (!sensor || value === undefined || value === null) return 'Medium';
    
    if (value >= sensor.thresholds.critical) return 'Critical';
    if (value >= sensor.thresholds.warning) return 'High';
    return 'Medium';
  };

  const generateTrendData = () => {
    return Array(5).fill(0).map(() => Math.random() * 100);
  };

  const processAlerts = (rawAlerts) => {
    if (!Array.isArray(rawAlerts)) {
      console.error("Expected array but got:", rawAlerts);
      return [];
    }
  
    return rawAlerts.map(alert => {
      const sensorType = typeof alert.sensorType === 'string' 
        ? parseInt(alert.sensorType) 
        : alert.sensorType;
  
      if (!SENSORS.hasOwnProperty(sensorType)) {
        console.warn(`Unknown sensorType ${sensorType} in alert:`, alert);
        return null;
      }
  
      return {
        id: alert.id?.timestamp || `${alert.deviceId}-${sensorType}-${Date.now()}`,
        deviceId: alert.deviceId || 'unknown',
        sensorType: sensorType,
        sensorName: SENSORS[sensorType].name,
        value: alert.value ?? '--',
        unit: SENSORS[sensorType].unit,
        message: alert.message || `${SENSORS[sensorType].name} alert`,
        timestamp: alert.timestamp || new Date().toISOString(),
        time: alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : '--',
        severity: calculateSeverity(sensorType, alert.value),
        trend: generateTrendData()
      };
    }).filter(alert => alert !== null);
  };

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("https://localhost:7086/api/Alerts");
        setAlerts(processAlerts(res.data));
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7086/alertHub")
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveAlert", (alert) => {
      if (!muted) {
        const sensorType = typeof alert.sensorType === 'string' 
          ? parseInt(alert.sensorType)
          : alert.sensorType;

        if (!SENSORS[sensorType]) return;

        setAlerts(prev => [processAlerts([alert])[0], ...prev]);
      }
    });

    connection.start().catch(console.error);

    return () => connection.stop();
  }, [muted]);

  const groupedAlerts = alerts.reduce((acc, alert) => {
    if (!alert || !SENSORS.hasOwnProperty(alert.sensorType)) return acc;
    acc[alert.sensorType] = acc[alert.sensorType] || [];
    acc[alert.sensorType].push(alert);
    return acc;
  }, {});

  // Generic columns configuration
  const columns = [
    { 
      field: 'sensorName', 
      headerName: 'Sensor', 
      width: 150,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <SensorAvatar sensorcolor={SENSORS[params.row.sensorType].color}>
            {SENSORS[params.row.sensorType].icon}
          </SensorAvatar>
          <Typography>{params.value}</Typography>
        </Stack>
      )
    },
    { 
      field: 'value', 
      headerName: 'Reading', 
      width: 120,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography fontWeight="600">
            {params.value}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {params.row.unit}
          </Typography>
        </Stack>
      )
    },
    { 
      field: 'severity', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value}
          size="small"
          sx={{
            fontWeight: 600,
            backgroundColor: theme.palette.mode === 'dark'
              ? `${theme.palette[params.value.toLowerCase()]?.main}30`
              : `${theme.palette[params.value.toLowerCase()]?.main}15`,
            color: theme.palette[params.value.toLowerCase()]?.main
          }}
        />
      )
    },
    { 
      field: 'time', 
      headerName: 'Time', 
      width: 120,
      renderCell: (params) => (
        <Typography variant="caption">
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'message', 
      headerName: 'Details', 
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <Typography noWrap>{params.value}</Typography>
        </Tooltip>
      )
    },
    {
      field: 'actions',
      headerName: '',
      width: 80,
      renderCell: (params) => (
        <Tooltip title="View details">
          <IconButton 
            component={Link}
            to={`/devices/view/${params.row.deviceId}`}
            size="small"
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: `${theme.palette.primary.main}10`
              }
            }}
          >
            <Eye size={16} />
          </IconButton>
        </Tooltip>
      )
    }
  ];

  return (
    <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
      <Box sx={{ p: isMobile ? 1 : 2 }}>
        <AlertCard sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: theme.palette.error.main, width: 40, height: 40 }}>
                <AlertTriangle size={20} />
              </Avatar>
              <Box>
                <Typography variant="h6">Device Alerts</Typography>
                <Typography variant="body2" color="textSecondary">
                  Real-time monitoring dashboard
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title={muted ? "Unmute alerts" : "Mute alerts"}>
                <IconButton 
                  size="small" 
                  onClick={() => setMuted(!muted)}
                  color={muted ? "default" : "error"}
                >
                  {muted ? <BellOff size={18} /> : <Bell size={18} />}
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </AlertCard>

        {isLoading ? (
          <LinearProgress sx={{ my: 2 }} />
        ) : (
          Object.entries(SENSORS).map(([sensorKey, sensor]) => {
            const sensorType = parseInt(sensorKey);
            const sensorAlerts = groupedAlerts[sensorType] || [];
            
            return (
              <AlertCard key={sensorKey} sx={{ mb: 2 }}>
                <Accordion defaultExpanded disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: theme.palette.mode === 'dark'
                        ? `${sensor.color}20`
                        : `${sensor.color}10`,
                      borderBottom: `1px solid ${theme.palette.divider}`
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <SensorAvatar sensorcolor={sensor.color}>
                        {sensor.icon}
                      </SensorAvatar>
                      <Box>
                        <Typography fontWeight="600">{sensor.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {sensorAlerts.length} active alerts
                        </Typography>
                      </Box>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    {sensorAlerts.length > 0 ? (
                      <Box sx={{ height: 300 }}>
                        <DataGrid
                          rows={sensorAlerts}
                          columns={columns}
                          pageSize={5}
                          rowsPerPageOptions={[5]}
                          disableSelectionOnClick
                          sx={{
                            border: 'none',
                            [`& .${gridClasses.columnHeaders}`]: {
                              backgroundColor: theme.palette.background.default,
                              borderBottom: `1px solid ${theme.palette.divider}`
                            },
                            [`& .${gridClasses.row}`]: {
                              '&:hover': {
                                backgroundColor: `${sensor.color}05`
                              }
                            }
                          }}
                        />
                      </Box>
                    ) : (
                      <Box sx={{ p: 3, textAlign: 'center', backgroundColor: `${sensor.color}03` }}>
                        <Typography color="textSecondary">
                          No {sensor.name.toLowerCase()} alerts detected
                        </Typography>
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              </AlertCard>
            );
          })
        )}
      </Box>
    </DashboardLayout>
  );
}