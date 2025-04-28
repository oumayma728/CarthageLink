// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'https://localhost:7086/api/Reports';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
export const reportIssue = async (issueType, description) => {
  try {
    const response = await axios.post('https://localhost:7086/api/Issues', {
      type: issueType,
      description: description,
      reporter: "Operator" // You can get this from user context
    });
    return response.status === 200;
  } catch (error) {
    console.error('Error reporting issue:', error);
    return false;
  }
};
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