import { colors } from "@mui/material";
import { BASKET_STATUS, ORDER_STATUS } from "./constants";

export function getStatusColor(status: string) {
  switch (status) {
    case ORDER_STATUS.PREPARING:
      return colors.blueGrey[500];
    case ORDER_STATUS.PREPARED:
      return colors.blue[500];
    case ORDER_STATUS.ON_THE_WAY:
      return colors.orange[500];
    case ORDER_STATUS.DELIVERED:
      return colors.green[500];
    case ORDER_STATUS.NOT_DELIVERED:
      return colors.red[500];
    case BASKET_STATUS.COMPLETED:
      return colors.green[700];
    case BASKET_STATUS.ON_THE_WAY:
      return colors.indigo[500];
    case BASKET_STATUS.READY:
      return colors.yellow[700];
    default:
      return colors.blueGrey[500];
  }
}
