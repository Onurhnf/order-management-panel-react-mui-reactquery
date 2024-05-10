import axios from "axios";
import { ENDPOINTS } from "../api/apiEndpoints";
import { Order } from "../interfaces/IOrder.interface";

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const response = await axios.get(ENDPOINTS.ORDERS);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderById = async (id: string): Promise<Order> => {
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
): Promise<Order> => {
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
export const createOrder = async (newOrder: Order): Promise<Order> => {
  try {
    const response = await axios.post(ENDPOINTS.ORDERS, newOrder);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};
