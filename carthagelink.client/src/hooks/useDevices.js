import { useState, useEffect, useCallback } from "react";
import { getFactoryDevices } from '../api/factoryApi.js';
import { useAuth } from '../contexts/AuthContext.js'; // Import auth context

export default function useDevices() {
  const { user } = useAuth(); // Get user from auth context
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://localhost:7086/api/Device", {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setDevices(data); 
    } catch (err) {
      setError(err.message); 
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []); 

  // Fetch Devices by factory ID
  const fetchDevicesByFactoryId = useCallback(async () => {
    if (!user?.factoryId) {
      setDevices([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await getFactoryDevices(user.factoryId);
      setDevices(data);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.factoryId]); // Re-run when factoryId changes

  // Function to delete device
  const deleteDevice = async (did) => {
    try {
      const response = await fetch(`https://localhost:7086/api/Device/${did}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");
      
      await response.json();
      fetchDevices(); // Refresh the list
    } catch (err) {
      console.error("Error deleting Device:", err);
      throw err; // Re-throw to handle in component
    }
  };

  // Function to update device status
  const updateDeviceStatus = async (deviceId, newStatus) => {
    setUpdatingStatusId(deviceId);
    try {
      const response = await fetch(`https://localhost:7086/api/Device/${deviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error("Update failed");

      await fetchDevices(); // Refresh list after update
    } catch (error) {
      console.error("Failed to update device status:", error);
      throw error;
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Initial data fetch when component mounts or factoryId changes
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return {
    devices,
    isLoading,
    error,
    fetchDevices,
    updatingStatusId,
    fetchDevicesByFactoryId,
    deleteDevice,
    updateDeviceStatus
  };
}