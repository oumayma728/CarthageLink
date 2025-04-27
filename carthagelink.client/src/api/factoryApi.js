import axios from 'axios';

const BASE_URL = 'https://localhost:7086/api/Factory';

export const getFactoryDevices = async (factoryId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${factoryId}/devices`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching devices for factory ${factoryId}:`, error);
    throw error;
  }
};

export const getFactoryById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching factory by ID ${id}:`, error);
    throw error;
  }
};
