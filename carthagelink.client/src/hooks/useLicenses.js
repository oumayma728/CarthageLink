import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext.js";
export default function useLicenses() {
  const [licenses, setLicenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
const {user} =useAuth();
  const fetchLicenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://localhost:7086/api/licenses?factoryId=${user.factoryId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${user.token}`, // Use token if necessary
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("All licenses:", data);
  
      if (data.length === 0) {
        console.log("No licenses found for your account.");
      } else {
        setLicenses(data);  // Set licenses in your state
      }
    } catch (error) {
      console.error("Error fetching licenses:", error);
    }
  }, []);

  const deleteLicense = async (id) => {
    try {
      const response = await fetch(`https://localhost:7086/api/License/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to delete license');
      }

      return await response.json();
    } catch (err) {
      console.error("Delete error:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, [fetchLicenses]);

  return {
    licenses,
    isLoading,
    error,
    fetchLicenses,
    deleteLicense,
  };
}