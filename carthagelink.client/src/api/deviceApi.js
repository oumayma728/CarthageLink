import axios from "axios";

const API_URL = '/api/Device';

// get all fDevices
export const getAllDevices = async () => {
  const response = await axios.get(API_URL);

  console.log('response', response);
  return response;
}

// create Device
export const createDevice = async (data) => {
  const response = await axios.post(API_URL, data);
  return response;
}

// get Device by id
export const getDeviceById = async (id) => {
  const response = await axios.get(API_URL + '/' + id);
  return response;
}

// update Device by id
export const updateDevice = async (id, data) => {
  const response = await axios.put(API_URL + '/' + id, data);
  return response;
}

// delete Device by id
export const deleteDevice = async (id) => {
  const response = await axios.delete(API_URL + '/' + id);
  return response;
} 
