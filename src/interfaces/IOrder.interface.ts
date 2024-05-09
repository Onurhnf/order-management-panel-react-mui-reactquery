export interface Item {
  id: string;
  name: string;
}

export interface Order {
  id: string;
  address: string;
  payment: string;
  delivery_time: string;
  status: string;
  items: Item[];
}

export interface Orders {
  orders: Order[];
}
export interface UpdateOrderParams {
  id: string;
  status: string;
}
