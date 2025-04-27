import DashboardLayout from "../../components/Layouts/DashboardLayout";
import Header from "../../components/Layouts/Dashboard/DashboardHeader";
import useDashboardData from "../../hooks/useDashboardData";
//import DeviceOverview from '../../components/features/Devices/deviceOverview.jsx';
//import MapCard from '../../components/Map/MapCard';
import { Typography, Box } from "@mui/material";
import ProductionChart from "../../components/Charts/ProductionChart";
import DeviceStatusChart from "../../components/Charts/DeviceStatusChart";
export default function FactoryDashboardPage() {
  const { 
    data: dashboardData = {}, 
    loading, 
    error, 
    lastUpdated, 
    refreshData 
  } = useDashboardData();

  return (
    <DashboardLayout activePage="/dashboard">      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header 
          title="Dashboard Overview"
          onRefresh={refreshData}
          loading={loading}
        />
        
        <Box component="main" sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
          {error && (
            <Box sx={{ bgcolor: 'error.light', borderLeft: 4, borderColor: 'error.main', p: 2, mb: 3 }}>
              Error: {error.message || String(error)}
            </Box>
          )}
          {lastUpdated && (
            <Typography variant="body2" color="text.secondary" mt={2}>
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </Typography>
          )}
        </Box>
        <ProductionChart/>
        <DeviceStatusChart/>
      </Box>
    </DashboardLayout>
  );
}