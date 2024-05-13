import { memo, useEffect, useState } from "react";

import {
  Box,
  Card,
  IconButton,
  Stack,
  Typography,
  colors,
} from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";

import { useRemoveBasket, useUpdateBasketStatus } from "../hooks/useBasket";
import { useCourier } from "../hooks/useCourier";
import { useOrdersByBasket } from "../hooks/useOrder";
import { ConnectableElement, useDrag, useDrop } from "react-dnd";
import { useQueryClient } from "react-query";

import {
  BasketStatus,
  BasketStatusLabel,
  ItemTypes,
  OrderStatus,
} from "../utils/constants";
import { getStatusColor } from "../utils/helper";
import BasketDetailModal from "./BasketDetailModal";
import Order from "./Order";

import { IOrder } from "../interfaces/IOrder.interface";
import { IBasket } from "../interfaces/IBasket.interface";

interface BasketProps {
  basket: IBasket;
  isNotReady?: boolean;
}
interface DropResult {
  name: string;
  status: BasketStatus;
}

function BasketComponent({ basket, isNotReady: isOnTheWay }: BasketProps) {
  const basketNo = basket.id;
  const courierNo = basket.courier_id;

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const queryClient = useQueryClient();
  const { data: orders } = useOrdersByBasket(basketNo);

  const { data: courier } = useCourier(courierNo);
  const removeBasket = useRemoveBasket();
  const updateBasketStatus = useUpdateBasketStatus();

  useEffect(() => {
    if (basket && Array.isArray(basket.orders) && basket.orders.length < 1) {
      removeBasket.mutate(basketNo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basket, basketNo]);

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.ORDER,
    drop: () => ({ name: "BASKET", basketNo, basketStatus: basket?.status }),

    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BASKET,
    item: { name: "BASKET", basketNo },
    end: async (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      const basketStatusKey = Object.keys(BasketStatus).find(
        (key) =>
          BasketStatus[key as keyof typeof BasketStatus] ===
          BasketStatus.ON_THE_WAY
      );
      if (item && dropResult) {
        if (
          item.name === ItemTypes.BASKET &&
          dropResult.name === "COLUMN" &&
          dropResult.status !== BasketStatus.READY
        ) {
          await updateBasketStatus.mutateAsync({
            id: basketNo,
            status: basketStatusKey as string,
          });
          await queryClient.invalidateQueries("orders");
        }
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    function isAllOrdersComplated(basketsOrders: string[]): boolean {
      let isAllTrue = false;
      if (Array.isArray(basketsOrders) && basketsOrders.length > 0) {
        isAllTrue = basketsOrders.every((ordersId: string) => {
          const order = orders?.find((order: IOrder) => order.id === ordersId);

          return (
            order?.status === OrderStatus.DELIVERED ||
            order?.status === OrderStatus.NOT_DELIVERED
          );
        });
      }

      return isAllTrue;
    }
    if (basket && Array.isArray(basket.orders)) {
      if (
        isAllOrdersComplated(basket.orders) &&
        basket.status !== BasketStatus.COMPLETED
      ) {
        updateBasketStatus.mutateAsync({
          id: basketNo,
          status: BasketStatus.COMPLETED,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basket, basketNo, orders]);

  if (!basket) {
    return <></>;
  }

  const color = getStatusColor(BasketStatus[basket.status]);
  const opacity = isDragging ? 0.4 : 1;

  function handleBasketClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    event.preventDefault();
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
      <BasketDetailModal
        open={open}
        handleClose={handleClose}
        basket={basket}
        isOnTheWay={isOnTheWay}
      />

      <Card
        sx={{
          width: 400,
          border: `1px solid ${colors.blueGrey[100]}`,
          opacity: opacity,
          cursor: "move",
          p: 2,
          bgcolor: colors.blueGrey[50],
          borderRadius: "5px",
        }}
      >
        <Stack justifyContent={"space-between"} direction={"row"}>
          <Typography fontWeight="bold" color={color}>
            {BasketStatusLabel[basket.status]}
          </Typography>
          <IconButton
            onClick={handleBasketClick}
            sx={{
              alignSelf: "center",
            }}
          >
            <BorderColorIcon />
          </IconButton>
        </Stack>

        <Stack direction="column" gap={3}>
          {basket?.orders.map((order) => (
            <Order
              key={order}
              orderNo={order.toString()}
              basketNo={basketNo}
              isOnTheWay={isOnTheWay}
            />
          ))}
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography fontWeight="bold">Sepet No - {basketNo}</Typography>
            <Typography fontWeight="bold">Kurye - {courier?.name}</Typography>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}
const Basket = memo(BasketComponent);
export default Basket;
