import { colors } from "@mui/material";
import { BasketStatus, OrderStatus } from "./constants";

export function getStatusColor(status: string) {
  switch (status) {
    case OrderStatus.PREPARING:
      return colors.blueGrey[500];
    case OrderStatus.PREPARED:
      return colors.blue[500];
    case OrderStatus.ON_THE_WAY:
      return colors.orange[500];
    case OrderStatus.DELIVERED:
      return colors.green[500];
    case OrderStatus.NOT_DELIVERED:
      return colors.red[500];
    case BasketStatus.COMPLETED:
      return colors.green[700];
    case BasketStatus.ON_THE_WAY:
      return colors.indigo[500];
    case BasketStatus.READY:
      return colors.yellow[700];
    default:
      return colors.blueGrey[500];
  }
}

export const getBasketTitle = (status: BasketStatus): string => {
  switch (status) {
    case BasketStatus.READY:
      return "Bekleyen Siparisler";
    case BasketStatus.ON_THE_WAY:
      return "Yoldaki Siparisler";
    case BasketStatus.COMPLETED:
      return "Tamamlanan Siparisler";
    default:
      return "";
  }
};
