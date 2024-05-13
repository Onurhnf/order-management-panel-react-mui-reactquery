export enum OrderStatus {
  PREPARING = "PREPARING",
  PREPARED = "PREPARED",
  ON_THE_WAY = "ON_THE_WAY",
  DELIVERED = "DELIVERED",
  NOT_DELIVERED = "NOT_DELIVERED",
}

export const OrderStatusLabel = {
  [OrderStatus.PREPARING]: "Hazırlanıyor",
  [OrderStatus.PREPARED]: "Hazırlandı",
  [OrderStatus.ON_THE_WAY]: "Yolda",
  [OrderStatus.DELIVERED]: "Teslim Edildi",
  [OrderStatus.NOT_DELIVERED]: "Teslim Edilemedi",
};

export enum BasketStatus {
  READY = "READY",
  ON_THE_WAY = "ON_THE_WAY",
  COMPLETED = "COMPLETED",
}
export const BasketStatusLabel = {
  [BasketStatus.READY]: "Hazır",
  [BasketStatus.ON_THE_WAY]: "Yolda",
  [BasketStatus.COMPLETED]: "Tamamlandı",
};

export const OrderStatusGroups = {
  [BasketStatus.READY]: {
    [OrderStatus.PREPARING]: OrderStatusLabel[OrderStatus.PREPARING],
    [OrderStatus.PREPARED]: OrderStatusLabel[OrderStatus.PREPARED],
  },
  [BasketStatus.ON_THE_WAY]: {
    [OrderStatus.ON_THE_WAY]: OrderStatusLabel[OrderStatus.ON_THE_WAY],
    [OrderStatus.DELIVERED]: OrderStatusLabel[OrderStatus.DELIVERED],
    [OrderStatus.NOT_DELIVERED]: OrderStatusLabel[OrderStatus.NOT_DELIVERED],
  },
};

export const ItemTypes = {
  ORDER: "ORDER",
  BASKET: "BASKET",
};

export const DUMMY_ORDER_DATA = {
  address:
    "Kadıköy, İstanbul, Turkey, Başka bir Sok, No: 456 Bina: 7 Daire: 8 Bina Adı: Uzun Apartmanı",
  payment: "Credit Card",
  status: OrderStatus.PREPARING,
  delivery_time: "2024-12-26T23:59:59Z",
  items: [
    {
      id: "5",
      name: "Tavuklu Salata",
    },
    {
      id: "6",
      name: "Ayran",
    },
  ],
};
