import axios from "axios";
import { ENDPOINTS } from "../api/apiEndpoints";
import { Basket } from "../interfaces/IBasket.interface";
import { getOrderById, updateOrderStatus } from "./order.service";
import { BASKET_STATUS, ORDER_STATUS } from "../utils/constants";

export const getAllBaskets = async (): Promise<Basket[]> => {
  try {
    const response = await axios.get(ENDPOINTS.BASKETS);
    return response.data;
  } catch (error) {
    console.error("Error fetching baskets:", error);
    throw error;
  }
};

export const getBasketById = async (id: string): Promise<Basket> => {
  try {
    const response = await axios.get(`${ENDPOINTS.BASKETS}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching basket with id ${id}:`, error);
    throw error;
  }
};

export const updateBasketStatus = async (
  id: string,
  status: string
): Promise<Basket> => {
  try {
    const basket = await getBasketById(id);
    if (!basket.courier_id) {
      throw new Error("Kuryesi olmayan sepet statüsü güncellenemez. ");
    }

    if (status === "ON_THE_WAY") {
      const orderUpdatePromises = basket.orders.map(async (orderId) => {
        const order = await getOrderById(orderId);
        if (order.status === "PREPARED") {
          await updateOrderStatus(orderId, "ON_THE_WAY");
        } else if (order.status === "PREPARING") {
          throw new Error("Sepetteki ürünler henüz hazır değil.");
        }
      });
      await Promise.all(orderUpdatePromises);
    }

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
      courier_id: courierId,
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
    const basket = await getBasketById(basketId);
    const updatedOrders = basket.orders.filter(
      (order: string) => order !== orderId
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

export const createBasket = async (orderIds: string[]): Promise<Basket> => {
  if (orderIds.length < 2) {
    throw new Error("At least two order IDs are required to create a basket");
  }

  for (const orderId of orderIds) {
    const order = await getOrderById(orderId);

    if (
      ORDER_STATUS[order.status as keyof typeof ORDER_STATUS] !==
      ORDER_STATUS.PREPARED
    ) {
      throw new Error(`Siparişler "HAZIRLANIYOR" statüsünde olmalı.`);
    }
  }
  const basketStatusKey = Object.keys(BASKET_STATUS).find(
    (key) =>
      BASKET_STATUS[key as keyof typeof BASKET_STATUS] === BASKET_STATUS.READY
  );
  try {
    const response = await axios.post(ENDPOINTS.BASKETS, {
      orders: orderIds,
      status: basketStatusKey,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating basket:", error);
    throw error;
  }
};
export const removeBasket = async (basketId: string) => {
  try {
    const response = await axios.delete(`${ENDPOINTS.BASKETS}/${basketId}`);
    return response.data;
  } catch (error) {
    console.error(`Error removing basket with id ${basketId}:`, error);
    throw error;
  }
};
