import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import DevicesTable from "../../components/features/Devices/DeviceTable.jsx";
import DeleteModal from "../../components/ui/DeleteModal";
import useDevices from "../../hooks/useDevices.js";
import { useAuth } from "../../context/AuthContext"; // Assuming you have auth context

export default function DevicePage() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const { user } = useAuth(); // Get logged-in user info
  
  // Use the factoryId from the user object
  const { 
    devices, 
    isLoading, 
    error, 
    updatingStatusId,
    deleteDevice, 
    updateDeviceStatus,
    refreshDevices
  } = useDevices(user?.factoryId);

  const handleDelete = async () => {
    const success = await deleteDevice(selectedDeviceId);
    if (success) {
      refreshDevices(); // Refresh the list after deletion
      setIsDeleteModalOpen(false);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedDeviceId(id);
    setIsDeleteModalOpen(true);
  };

  return (
    <DashboardLayout activePage="/Device">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold mb-2 sm:mb-0 dark:text-white">
            Devices {user?.factoryId && `(Factory: ${user.factoryId})`}
          </h1>
          {user?.factoryId && (
            <Link 
              to="/devices/new"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
            >
              <Plus size={16} />
              Add Device
            </Link>
          )}
        </div>

        {!user?.factoryId && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
            <p>Your account is not assigned to any factory. Please contact administrator.</p>
          </div>
        )}

        <DevicesTable 
          devices={devices}
          isLoading={isLoading}
          error={error}
          onDelete={openDeleteModal}
          onStatusChange={updateDeviceStatus}
          updatingStatusId={updatingStatusId}
        />
      </div>

      <DeleteModal 
        isOpen={isDeleteModalOpen}
        title="Delete Device"
        message="Are you sure you want to delete this device?"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
}