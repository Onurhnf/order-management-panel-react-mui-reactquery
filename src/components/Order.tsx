import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { ITEM_TYPES, ORDER_STATUS } from "../utils/constants";
import { useOrder } from "../hooks/useOrder";
import { getStatusColor } from "../utils/helper";
import { ConnectableElement, useDrag, useDrop } from "react-dnd";
import {
  useAddOrderToBasket,
  useCreateBasket,
  useRemoveOrderFromBasket,
} from "../hooks/useBasket";
import OrderDetailModal from "./OrderDetailModal";
import { useState } from "react";

interface OrderProps {
  orderNo: string;
  basketNo?: string;
  isOnTheWay?: boolean;
}
interface DropResult {
  name: string;
  orderNo: string;
  basketNo: string;
}
function Order({ orderNo, basketNo, isOnTheWay }: OrderProps) {
  const { data: order, isLoading } = useOrder(orderNo);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const createBasket = useCreateBasket();
  const addOrderToBasket = useAddOrderToBasket();
  const removeOrderFromBasket = useRemoveOrderFromBasket();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPES.ORDER,
    item: { name: "ORDER", orderNo, basketNo },
    canDrag: !isOnTheWay,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
        if (item.name === "ORDER" && dropResult.name === "ORDER" && !basketNo) {
          createBasket.mutate([item.orderNo, dropResult.orderNo]);
        }
        if (item.name === "ORDER") {
          if (dropResult.name === "BASKET" && !basketNo) {
            addOrderToBasket.mutate({
              basketId: dropResult.basketNo,
              orderId: item.orderNo,
            });
          } else if (dropResult.name !== "BASKET" && basketNo) {
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
    accept: ITEM_TYPES.ORDER,
    drop: () => ({ name: "ORDER", orderNo }),
  }));

  if (isLoading) return <div>Loading...</div>;

  if (!order) {
    return <div>No Order...</div>;
  }
  const color = getStatusColor(
    ORDER_STATUS[order.status as keyof typeof ORDER_STATUS]
  );
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
                {ORDER_STATUS[order.status as keyof typeof ORDER_STATUS]}
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

export default Order;
