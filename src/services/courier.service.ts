import axios from "axios";
import { ENDPOINTS } from "../api/apiEndpoints";
import { ICourier } from "../interfaces/ICourier.interface";

export const getAllCouriers = async (): Promise<ICourier[]> => {
  try {
    const response = await axios.get(ENDPOINTS.COURIERS);
    return response.data;
  } catch (error) {
    console.error("Error fetching couriers:", error);
    throw error;
  }
};

export const getCourierById = async (id: string): Promise<ICourier> => {
  try {
    const response = await axios.get(`${ENDPOINTS.COURIERS}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching courier with id ${id}:`, error);
    throw error;
  }
};
