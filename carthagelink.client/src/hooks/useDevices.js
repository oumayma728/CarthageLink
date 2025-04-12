import { useState, useEffect, useCallback } from "react";

export default function useDevices() {
  //const [did, setdid] = useState(""); // State to store Device id
  const [devices, setDevices] = useState([]); // State to store list of Devices
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // Store any error messages

  // Fetch Devices with useCallback to memoize the function
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
      setDevices(data); // Update the state with fetched Devices
    } catch (err) {
      setError(err.message); // Set error message in state
      console.error("Fetch error:", err); // Log error to the console
    } finally {
      setIsLoading(false); // Set loading to false once fetch is complete
    }
  }, []); // Empty dependency array ensures this function doesn't get recreated

  // Function to delete 
  const deleteDevice= async (did) => {
    try {
      const response = await fetch(`https://localhost:7086/api/Device/${did}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      await response.json(); // Process the response after deletion
      fetchDevices(); // Refresh the list of Devices after deletion
    } catch (err) {
      console.error("Error deleting Device:", err);
    }
  };
  const updateDeviceStatus = async (deviceId, newStatus) => {
    try {
      const response = await fetch(`https://localhost:7086/api/Device/${deviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })//JSON.stringify function takes an object and converts it into a JSON string
      });
  
      if (!response.ok) throw new Error("Update failed");
  
      await fetchDevices(); // Refresh list after update
    } catch (error) {
      console.error("Failed to update device status:", error);
    }
  };
  
  // Initial data fetch when component mounts
  useEffect(() => {
    fetchDevices(); // This should be called when component mounts
  }, [fetchDevices]); // Ensure fetchDevices is in dependency array
  return {
    devices,
    isLoading,
    error,
    fetchDevices,
    deleteDevice,
    updateDeviceStatus 

  };
}
