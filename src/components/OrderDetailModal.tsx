import { memo, useState } from "react";

import { Box, MenuItem, Modal, Select, Stack, Typography } from "@mui/material";
import { useOrder, useUpdateOrderStatus } from "../hooks/useOrder";
import {
  OrderStatus,
  BasketStatus,
  OrderStatusGroups,
  OrderStatusLabel,
} from "../utils/constants";

interface OrderDetailModalProps {
  open: boolean;
  handleClose: () => void;
  orderNo: string;
  isOnTheWay?: boolean;
}

function OrderDetailModalComponent({
  open,
  handleClose,
  orderNo,
  isOnTheWay,
}: OrderDetailModalProps) {
  const { data: order, isLoading } = useOrder(orderNo);
  const updateOrderStatus = useUpdateOrderStatus();
  const [newStatus, setNewStatus] = useState<OrderStatus | "">(
    order?.status || ""
  );

  if (isLoading) return <div>Loading...</div>;
  if (!order) {
    return <div>No Order...</div>;
  }

  function handleStatusChange(e: { target: { value: string } }): void {
    const newStatus = e.target.value as OrderStatus;
    setNewStatus(newStatus);
    updateOrderStatus.mutate({ id: orderNo, status: newStatus });
  }

  const statusOptions = Object.keys(
    OrderStatusGroups[isOnTheWay ? BasketStatus.ON_THE_WAY : BasketStatus.READY]
  ) as Array<keyof (typeof OrderStatusGroups)[BasketStatus.READY]>;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography
          sx={{ textAlign: "center" }}
          id="modal-modal-title"
          variant="h6"
          component="h2"
          fontWeight="bold"
          mb={2}
        >
          Sipariş Detayı
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <strong>Adres:</strong> {order?.address}
          <br />
          <strong>Ödeme:</strong> {order?.payment}
          <br />
          <strong>Teslimat Zamanı:</strong>{" "}
          {order?.delivery_time &&
            new Date(order.delivery_time).toLocaleString()}
        </Typography>
        <Stack alignItems="center" direction={"row"}>
          <Typography>
            <strong>Statü:</strong>{" "}
          </Typography>

          <Box sx={{ minWidth: 200, ml: 1, justifyContent: "center" }}>
            <Select
              sx={{ minWidth: 150 }}
              value={newStatus}
              size="small"
              onChange={handleStatusChange}
            >
              {statusOptions.map((statusKey) => (
                <MenuItem key={statusKey} value={statusKey}>
                  {OrderStatusLabel[statusKey]}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Stack>
        <Typography>
          <strong>İçerik</strong>
        </Typography>

        <Box maxWidth={400}>
          <Stack
            maxWidth={400}
            mt={1}
            direction={"column"}
            flexWrap={"wrap"}
            gap={1}
          >
            {order.items.map((item) => (
              <li key={item.id}>{item.name} </li>
            ))}
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
}

const OrderDetailModal = memo(OrderDetailModalComponent);
export default OrderDetailModal;

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
};
