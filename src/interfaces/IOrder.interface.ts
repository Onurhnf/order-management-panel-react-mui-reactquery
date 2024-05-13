import { OrderStatus } from "../utils/constants";
export interface Item {
  id: string;
  name: string;
}

export interface IOrder {
  id?: string;
  address: string;
  payment: string;
  delivery_time: string;
  status: OrderStatus;
  items: Item[];
}

export interface UpdateOrderParams {
  id: string;
  status: string;
}
