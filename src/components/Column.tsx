import { memo } from "react";

import { Box, Button, Card, Stack, Typography, colors } from "@mui/material";

import { useBasketsByStatus } from "../hooks/useBasket";
import { useCreateOrder, useOrders } from "../hooks/useOrder";
import { ConnectableElement, useDrop } from "react-dnd";

import { BasketStatus, DUMMY_ORDER_DATA, ItemTypes } from "../utils/constants";
import { getBasketTitle } from "../utils/helper";
import Basket from "./Basket";
import Order from "./Order";

interface ColumnProps {
  status: BasketStatus;
}

function ColumnComponent({ status }: ColumnProps) {
  const createOrder = useCreateOrder();
  const { baskets, filteredReadyOrders, isLoading } = useBasketsByStatus(
    status,
    useOrders().data
  );

  const [, drop] = useDrop(() => ({
    accept: [ItemTypes.BASKET, ItemTypes.ORDER],
    canDrop: () => status !== BasketStatus.COMPLETED,
    drop: (_item: unknown, monitor) => {
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        return { name: "COLUMN", status };
      }
    },
  }));

  if (isLoading) return <div>Loading...</div>;

  async function handleOpenCreateOrder(): Promise<void> {
    await createOrder.mutateAsync(DUMMY_ORDER_DATA);
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
        <Stack direction="column" gap={2}>
          <Typography variant="h5" fontWeight="bold" alignSelf={"center"}>
            {getBasketTitle(status)}
          </Typography>
          {baskets?.map((basket) => (
            <Basket
              key={basket.id}
              basket={basket}
              isNotReady={status !== BasketStatus.READY}
            />
          ))}
          {status === BasketStatus.READY && (
            <>
              <Stack sx={{ mx: 2, gap: 2 }}>
                {filteredReadyOrders?.map((order) => (
                  <Order key={order.id} orderNo={order.id as string} />
                ))}
              </Stack>
              <Button variant="outlined" onClick={handleOpenCreateOrder}>
                Sipariş Ekle
              </Button>
            </>
          )}
        </Stack>
      </Card>
    </Box>
  );
}

const Column = memo(ColumnComponent);
export default Column;
