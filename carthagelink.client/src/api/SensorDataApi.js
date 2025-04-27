import axios from 'axios';

const API_URL = 'https://localhost:7086/api/SensorData';

// get all SensorData
export const getAllSensorData = async () => {
  const response = await axios.get(API_URL);
  return response;
}

// create SensorData
export const createSensorData = async (data) => {
  const response = await axios.post(API_URL, data);
  return response;
}

// get SensorData by deviceId
export const getLatestByDeviceId = async (id) => {
  const response = await axios.get(API_URL + '/' + id);
  return response;
}

// get SensorData by field, deviceId and limit
export const getSensorDataByField = async (field, deviceId, limit) => {
  const response = await axios.get(API_URL + '/' + deviceId + '/' + field + '?limit=' + limit);
  return response;
} 