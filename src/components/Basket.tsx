import {
  Box,
  Card,
  IconButton,
  Stack,
  Typography,
  colors,
} from "@mui/material";
import Order from "./Order";
import {
  useBasket,
  useRemoveBasket,
  useUpdateBasketStatus,
} from "../hooks/useBasket";
import { BASKET_STATUS, ITEM_TYPES } from "../utils/constants";
import { getStatusColor } from "../utils/helper";
import { useCourier } from "../hooks/useCourier";
import { ConnectableElement, useDrag, useDrop } from "react-dnd";
import { useEffect, useRef, useState } from "react";
import BasketDetailModal from "./BasketDetailModal";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { useQueryClient } from "react-query";
import { useOrdersByBasket } from "../hooks/useOrder";

interface BasketProps {
  basketNo: string;
  courierNo: string;
  isOnTheWay?: boolean;
}
interface DropResult {
  name: string;
  isReady: boolean;
}

function Basket({ basketNo, courierNo, isOnTheWay }: BasketProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const isFirstRun = useRef(true);

  const queryClient = useQueryClient();

  const { data: basket, isLoading } = useBasket(basketNo);
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
    accept: ITEM_TYPES.ORDER,
    drop: () => ({ name: "BASKET", basketNo }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPES.BASKET,
    item: { name: "BASKET", basketNo },
    end: async (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      const basketStatusKey = Object.keys(BASKET_STATUS).find(
        (key) =>
          BASKET_STATUS[key as keyof typeof BASKET_STATUS] ===
          BASKET_STATUS.ON_THE_WAY
      );
      if (item && dropResult) {
        if (
          item.name === "BASKET" &&
          dropResult.name === "COLUMN" &&
          !dropResult.isReady
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
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return; // Skip the first run
    }
    if (basket && Array.isArray(basket.orders)) {
      const allOrdersCompleted = basket.orders.every((orderId) => {
        const order = orders?.find((order) => order.id === orderId);
        return (
          order?.status === "DELIVERED" || order?.status === "NOT_DELIVERED"
        );
      });

      if (allOrdersCompleted && basket.status !== "COMPLETED") {
        updateBasketStatus.mutateAsync({
          id: basketNo,
          status: "COMPLETED",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basket, basketNo, orders]);

  if (isLoading) return <div>Loading...</div>;
  if (!basket) {
    return <></>;
  }

  const color = getStatusColor(
    BASKET_STATUS[basket.status as keyof typeof BASKET_STATUS]
  );
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
        basketNo={basketNo}
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
            {BASKET_STATUS[basket.status as keyof typeof BASKET_STATUS]}
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
          <Stack direction={"row"} justifyContent={"flex-end"}>
            <Typography fontWeight="bold">Kurye - {courier?.name}</Typography>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}
export default Basket;
