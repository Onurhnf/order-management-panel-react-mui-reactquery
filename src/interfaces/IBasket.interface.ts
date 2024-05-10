export interface Basket {
  id: string;
  courier_id: string;
  status: string;
  orders: string[];
}

export interface Baskets {
  baskets: Basket[];
}
