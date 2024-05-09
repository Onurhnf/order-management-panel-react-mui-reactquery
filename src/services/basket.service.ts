import axios from "axios";
import { ENDPOINTS } from "../api/apiEndpoints";
import { Order } from "../interfaces/IOrder.interface";

export const getAllBaskets = async () => {
  try {
    const response = await axios.get(ENDPOINTS.BASKETS);
    return response.data;
  } catch (error) {
    console.error("Error fetching baskets:", error);
    throw error;
  }
};

export const getBasketById = async (id: string) => {
  try {
    const response = await axios.get(`${ENDPOINTS.BASKETS}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching basket with id ${id}:`, error);
    throw error;
  }
};

export const updateBasketStatus = async (id: string, status: string) => {
  try {
    const response = await axios.patch(`${ENDPOINTS.BASKETS}/${id}`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error updating basket status for basket with id ${id}:`,
      error
    );
    throw error;
  }
};

export const assignCourierToBasket = async (
  basketId: string,
  courierId: string
) => {
  try {
    const response = await axios.patch(`${ENDPOINTS.BASKETS}/${basketId}`, {
      courierId,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error assigning courier to basket with id ${basketId}:`,
      error
    );
    throw error;
  }
};

export const addOrderToBasket = async (basketId: string, orderId: string) => {
  try {
    const basket = await axios.get(`${ENDPOINTS.BASKETS}/${basketId}`);
    const updatedOrders = [...basket.data.orders, orderId];

    const response = await axios.patch(`${ENDPOINTS.BASKETS}/${basketId}`, {
      orders: updatedOrders,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error adding order ${orderId} to basket ${basketId}:`,
      error
    );
    throw error;
  }
};

export const removeOrderFromBasket = async (
  basketId: string,
  orderId: string
) => {
  try {
    const basket = await axios.get(`${ENDPOINTS.BASKETS}/${basketId}`);
    const updatedOrders = basket.data.orders.filter(
      (order: Order) => order.id !== orderId
    );

    const response = await axios.patch(`${ENDPOINTS.BASKETS}/${basketId}`, {
      orders: updatedOrders,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error removing order ${orderId} from basket ${basketId}:`,
      error
    );
    throw error;
  }
};
