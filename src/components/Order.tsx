import { memo, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { blueGrey } from "@mui/material/colors";

import { useOrder } from "../hooks/useOrder";
import {
  useAddOrderToBasket,
  useCreateBasket,
  useRemoveOrderFromBasket,
} from "../hooks/useBasket";
import { ConnectableElement, useDrag, useDrop } from "react-dnd";

import OrderDetailModal from "./OrderDetailModal";
import { getStatusColor } from "../utils/helper";
import {
  BasketStatus,
  ItemTypes,
  OrderStatus,
  OrderStatusLabel,
} from "../utils/constants";

interface OrderProps {
  orderNo: string;
  basketNo?: string;
  isOnTheWay?: boolean;
}
interface DropResult {
  name: string;
  orderNo: string;
  basketNo: string;
  basketStatus: BasketStatus;
}
function OrderComponent({ orderNo, basketNo, isOnTheWay }: OrderProps) {
  const { data: order, isLoading } = useOrder(orderNo);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const createBasket = useCreateBasket();
  const addOrderToBasket = useAddOrderToBasket();
  const removeOrderFromBasket = useRemoveOrderFromBasket();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.ORDER,
    item: { name: ItemTypes.ORDER, orderNo, basketNo },
    canDrag: !isOnTheWay,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
        if (
          item.name === ItemTypes.ORDER &&
          dropResult.name === ItemTypes.ORDER &&
          !basketNo
        ) {
          createBasket.mutate([item.orderNo, dropResult.orderNo]);
        }
        if (item.name === ItemTypes.ORDER) {
          if (
            dropResult.name === ItemTypes.BASKET &&
            !basketNo &&
            dropResult.basketStatus === BasketStatus.READY
          ) {
            addOrderToBasket.mutate({
              basketId: dropResult.basketNo,
              orderId: item.orderNo,
            });
          } else if (dropResult.name !== ItemTypes.BASKET && basketNo) {
            removeOrderFromBasket.mutate({
              basketId: basketNo,
              orderId: item.orderNo,
            });
          }
        }
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.ORDER,
    drop: () => ({ name: ItemTypes.ORDER, orderNo }),
  }));

  if (isLoading) return <div>Loading...</div>;

  if (!order) {
    return <div>No Order...</div>;
  }
  const color = getStatusColor(OrderStatus[order.status]);
  const opacity = isDragging ? 0.4 : 1;

  function handleOrderClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    event.stopPropagation();
    handleOpen();
  }

  return (
    <Box
      ref={(node: ConnectableElement) => {
        drag(node);
        drop(node);
      }}
    >
      <OrderDetailModal
        orderNo={orderNo}
        open={open}
        handleClose={handleClose}
        isOnTheWay={isOnTheWay}
      />
      <Button
        onClick={handleOrderClick}
        sx={{ m: 0, p: 0, borderRadius: "10px" }}
      >
        <Card
          sx={{
            width: 400,
            border: `1px solid ${blueGrey[100]}`,
            borderRadius: "10px",
            opacity: opacity,
            cursor: "move",
          }}
        >
          <CardContent>
            <Stack justifyContent="space-between" direction="row">
              <Typography fontWeight="bold" color={color}>
                {OrderStatusLabel[order.status]}
              </Typography>

              <Typography fontWeight="bold">Sipariş No: {order.id}</Typography>
            </Stack>
          </CardContent>
          <CardContent>
            <Stack textAlign="start">
              <Typography>{order.address}</Typography>
            </Stack>
          </CardContent>
        </Card>
      </Button>
    </Box>
  );
}

const Order = memo(OrderComponent);
export default Order;
