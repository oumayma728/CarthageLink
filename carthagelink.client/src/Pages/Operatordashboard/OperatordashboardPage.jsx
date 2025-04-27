import PropTypes from 'prop-types';
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import Header from "../../components/Layouts/Dashboard/DashboardHeader";
import useDashboardData from "../../hooks/useDashboardData";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Alert from "@mui/material/Alert";
import FactoryDevice from "../../components/Layouts/Dashboard/deviceData/index.jsx";

export default function OperatorDashboardPage({ deviceId: propDeviceId }) {
  const { deviceId: paramDeviceId } = useParams();
  const { user } = useAuth();
  const { loading, error, lastUpdated, refreshData } = useDashboardData();
  
  const targetDeviceId = propDeviceId || paramDeviceId;
  const userDeviceId = Array.isArray(user?.deviceId) ? user.deviceId[0] : user?.deviceId;

  console.log("Rendering with deviceId:", targetDeviceId);

  return (
    <DashboardLayout activePage="/dashboard">      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={targetDeviceId ? `Device ${targetDeviceId} Dashboard` : "Dashboard Overview"}
          onRefresh={refreshData}
          loading={loading}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {userDeviceId && (
            <Alert severity="info" sx={{ mb: 3 }}>
              You're assigned to device: <strong>{userDeviceId}</strong>
            </Alert>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
              Error: {error.message || String(error)}
            </div>
          )}

          {lastUpdated && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Last updated: {new Date(lastUpdated).toLocaleTimeString()}
            </div>
          )}
          
          {targetDeviceId ? (
            <FactoryDevice key={targetDeviceId} deviceId={targetDeviceId} />
          ) : (
            <div className="text-center py-10">
              <p className="text-lg">No device selected</p>
              {userDeviceId && (
                <p className="text-sm text-gray-500 mt-2">
                  Your assigned device is: {userDeviceId}
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
}

OperatorDashboardPage.propTypes = {
  deviceId: PropTypes.string
};