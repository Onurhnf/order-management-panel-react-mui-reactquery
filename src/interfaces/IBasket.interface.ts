export interface Basket {
  id: string;
  courier_id: string;
  status: string;
  orders: number[];
}

export interface Baskets {
  baskets: Basket[];
}
