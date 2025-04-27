import { useState, useEffect, useCallback } from "react";

export default function useLicenses() {
  const [licenses, setLicenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLicenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://localhost:7086/api/License", {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLicenses(data);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
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