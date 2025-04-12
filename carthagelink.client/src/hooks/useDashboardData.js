import { useState, useEffect, useCallback } from "react";

export default function useDashboardData() {
  const [data, setData] = useState({
    devices: 0,
    factories: 0,
    users: 0,
    licenses: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true); //turn on loading spinner 
      setError(null);
      
      const response = await fetch('https://localhost:7086/api/Dashboard/counts'); //send GET request to backend
      if (!response.ok) throw new Error('Failed to fetch dashboard data');//case of an error 
      
      const result = await response.json(); //parses the raw repsonse into json
      setData({//	Save data into state
        devices: result.devices || 0,
        factories: result.factories || 0,
        users: result.users || 0,
        licenses: result.licenses || 0,
        recentActivities: result.recentActivities || []
      });
      setLastUpdated(new Date());//Save timestamp

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);//Turn off the spinner	
    }
  }, []);

  useEffect(() => { //When the component loads or when fetchData changes
    fetchData();
    const interval = setInterval(fetchData, 30000); //setInterval runs the fetchData() function every 30s to keep the dashboard data fresh.
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, lastUpdated, refreshData: fetchData };
}