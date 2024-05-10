import { Box, Button, Card, Stack, Typography, colors } from "@mui/material";
import { useBaskets } from "../hooks/useBasket";
import { useCreateOrder, useOrders } from "../hooks/useOrder";
import { BASKET_STATUS, ITEM_TYPES, ORDER_STATUS } from "../utils/constants";
import Basket from "./Basket";
import Order from "./Order";
import { ConnectableElement, useDrop } from "react-dnd";

interface ColumnProps {
  isReady: boolean;
  isComplated?: boolean;
}

function Column({ isReady, isComplated }: ColumnProps) {
  const { data: baskets, isLoading: isBasketsLoading } = useBaskets();
  const { data: orders } = useOrders();
  const createOrder = useCreateOrder();

  const [, drop] = useDrop(() => ({
    accept: [ITEM_TYPES.BASKET, ITEM_TYPES.ORDER],
    canDrop: () => !isComplated,
    drop: (_item: unknown, monitor) => {
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        return { name: "COLUMN", isReady };
      }
    },
  }));
  if (isBasketsLoading) return <div>Loading...</div>;

  const readyBaskets = baskets?.filter(
    (basket) =>
      BASKET_STATUS[basket.status as keyof typeof BASKET_STATUS] ===
      BASKET_STATUS.READY
  );
  const readyOrders = orders?.filter(
    (order) =>
      ORDER_STATUS[order.status as keyof typeof ORDER_STATUS] ===
        ORDER_STATUS.PREPARING ||
      ORDER_STATUS[order.status as keyof typeof ORDER_STATUS] ===
        ORDER_STATUS.PREPARED
  );

  const complatedBaskets = baskets?.filter(
    (basket) =>
      BASKET_STATUS[basket.status as keyof typeof BASKET_STATUS] ===
      BASKET_STATUS.COMPLETED
  );

  const commonOrders = readyOrders?.filter((order) =>
    readyBaskets?.some((basket) => basket.orders.includes(order.id as string))
  );

  const filteredReadyOrders = readyOrders?.filter(
    (order) => !commonOrders?.includes(order)
  );

  const onTheWayBaskets = baskets?.filter(
    (basket) =>
      BASKET_STATUS[basket.status as keyof typeof BASKET_STATUS] ===
      BASKET_STATUS.ON_THE_WAY
  );

  async function handleOpenCreateOrder(): Promise<void> {
    await createOrder.mutateAsync({
      address:
        "Kadıköy, İstanbul, Turkey,  Başka bir Sok, No: 456 Bina: 7 Daire: 8 Bina Adı: Uzun Apartmanı",
      payment: "Credit Card",
      status: "PREPARING",
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
    });
  }

  return (
    <Box
      ref={(node: ConnectableElement) => {
        drop(node);
      }}
    >
      <Card
        sx={{
          border: `1px solid ${colors.blueGrey[100]}`,
          m: 2,
          p: 2,
          height: "80vh",
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: `${colors.grey[400]} ${colors.grey[50]}`,
        }}
      >
        {isReady && (
          <Stack direction="column" gap={2}>
            <Typography variant="h5" fontWeight="bold" alignSelf={"center"}>
              Bekleyen Siparisler
            </Typography>
            {readyBaskets?.map((basket) => (
              <Basket
                key={basket.id}
                basketNo={basket.id}
                courierNo={basket.courier_id}
              />
            ))}

            <Stack sx={{ mx: 2, gap: 2 }}>
              {filteredReadyOrders?.map((order) => (
                <Order key={order.id} orderNo={order.id as string} />
              ))}
            </Stack>
            <Button variant="outlined" onClick={handleOpenCreateOrder}>
              Sipariş Ekle
            </Button>
          </Stack>
        )}

        {!isReady && !isComplated && Array.isArray(onTheWayBaskets) && (
          <Stack direction="column" gap={2}>
            <Typography variant="h5" fontWeight="bold" alignSelf={"center"}>
              Yoldaki Siparisler
            </Typography>
            {onTheWayBaskets?.map((basket) => (
              <Basket
                key={basket.id}
                basketNo={basket.id}
                courierNo={basket.courier_id}
                isOnTheWay={!isReady}
              />
            ))}
          </Stack>
        )}
        {isComplated && Array.isArray(complatedBaskets) && (
          <Stack direction="column" gap={2}>
            <Typography variant="h5" fontWeight="bold" alignSelf={"center"}>
              Tamamlanan Siparisler
            </Typography>
            {complatedBaskets?.map((basket) => (
              <Basket
                key={basket.id}
                basketNo={basket.id}
                courierNo={basket.courier_id}
                isOnTheWay={!isReady}
              />
            ))}
          </Stack>
        )}
      </Card>
    </Box>
  );
}
export default Column;
