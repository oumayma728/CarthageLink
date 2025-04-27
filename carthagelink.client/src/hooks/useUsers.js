import { useState, useEffect, useCallback } from "react";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  //const [factoryUsers, setFactoryUsers] = useState([]); // NEW
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://localhost:7086/api/User", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  

  const deleteUser = async (uid) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`https://localhost:7086/api/User/${uid}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Delete failed");

      // Re-fetch users after delete
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    //factoryUsers,
    isLoading,
    error,
    fetchUsers,
    //fetchFactoryUsers,
    deleteUser,
  };
}
