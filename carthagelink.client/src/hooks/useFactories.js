import { useState, useEffect, useCallback } from "react";

export default function useFactories() {
  const [fid, setFid] = useState(""); // Factory ID
  const [factories, setFactories] = useState([]); // All factories
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch factories
  const fetchFactories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://localhost:7086/api/Factory", {
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setFactories(data);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);


  // Delete factory
  const deleteFactory = async (factoryId) => {
    try {
      const response = await fetch(`https://localhost:7086/api/Factory/${factoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      await response.json();
      fetchFactories();
    } catch (err) {
      console.error("Error deleting factory:", err);
      alert("Failed to delete factory.");
    }
  };

  useEffect(() => {
    fetchFactories();
  }, [fetchFactories]);

  return {
    fid,
    setFid,
    factories,
    isLoading,
    error,
    fetchFactories,
    deleteFactory,
  };
}
