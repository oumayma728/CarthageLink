// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'https://localhost:7086/api/Reports';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateReport = async (startDate, endDate) => {
  try {
    const response = await axios.post('https://localhost:7086/api/Reports/generate', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

export const getAllReports = async () => {
  try {
    const response = await api.get('https://localhost:7086/api/Reports');
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

export const getReportById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
};