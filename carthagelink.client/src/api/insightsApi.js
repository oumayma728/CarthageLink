// src/api/InsightsApi.js
import axios from 'axios';

const API_BASE_URL = "https://localhost:7086/api/Insights";

// insightsApi.js
// insightsApi.js
export const getInsights = async () => {
  const response = await axios.get(
    API_BASE_URL,
  );

  return response;
}

export const getFactoryData = async (id) => {
  const response = await axios.get(
    `${API_BASE_URL}/${id}`,
  );

  return response;
}