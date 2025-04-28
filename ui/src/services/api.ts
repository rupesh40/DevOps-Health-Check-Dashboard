import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export interface Service {
  name: string;
  url: string;
  status?: string;
  last_checked?: string;
}

export const getServices = async (): Promise<Service[]> => {
  const response = await axios.get(`${API_BASE_URL}/health`);
  return response.data.services;
};

export const addService = async (service: Omit<Service, 'status' | 'last_checked'>): Promise<void> => {
  await axios.post(`${API_BASE_URL}/services`, service);
};

export const deleteService = async (name: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/services/${name}`);
};