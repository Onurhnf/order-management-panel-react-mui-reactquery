import axios from "axios";
import { ENDPOINTS } from "../api/apiEndpoints";
import { IOrder } from "../interfaces/IOrder.interface";

export const getAllOrders = async (): Promise<IOrder[]> => {
  try {
    const response = await axios.get(ENDPOINTS.ORDERS);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderById = async (id: string): Promise<IOrder> => {
  try {
    const response = await axios.get(`${ENDPOINTS.ORDERS}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order with id ${id}:`, error);
    throw error;
  }
};

export const updateOrderStatus = async (
  id: string,
  status: string
): Promise<IOrder> => {
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
export const createOrder = async (newOrder: IOrder): Promise<IOrder> => {
  try {
    const response = await axios.post(ENDPOINTS.ORDERS, newOrder);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};
