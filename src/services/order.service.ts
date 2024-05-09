import axios from "axios";
import { ENDPOINTS } from "../api/apiEndpoints";

export const getAllOrders = async () => {
  try {
    const response = await axios.get(ENDPOINTS.ORDERS);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderById = async (id: string) => {
  try {
    const response = await axios.get(`${ENDPOINTS.ORDERS}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order with id ${id}:`, error);
    throw error;
  }
};

export const updateOrderStatus = async (id: string, status: string) => {
  try {
    const response = await axios.patch(`${ENDPOINTS.ORDERS}/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error(
      `Error updating order status for order with id ${id}:`,
      error
    );
    throw error;
  }
};
