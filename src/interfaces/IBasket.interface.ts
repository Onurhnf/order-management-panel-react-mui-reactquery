import { BasketStatus } from "../utils/constants";

export interface IBasket {
  id: string;
  courier_id: string;
  status: BasketStatus;
  orders: string[];
}
