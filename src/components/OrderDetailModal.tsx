import { Box, MenuItem, Modal, Select, Stack, Typography } from "@mui/material";
import { useOrder, useUpdateOrderStatus } from "../hooks/useOrder";
import {
  ORDER_STATUS_ON_THE_WAY,
  ORDER_STATUS_READY,
} from "../utils/constants";
import { useState } from "react";

interface OrderDetailModalProps {
  open: boolean;
  handleClose: () => void;
  orderNo: string;
  isOnTheWay?: boolean;
}

function OrderDetailModal({
  open,
  handleClose,
  orderNo,
  isOnTheWay,
}: OrderDetailModalProps) {
  const { data: order, isLoading } = useOrder(orderNo);
  const updateOrderStatus = useUpdateOrderStatus();
  const [newStatus, setNewStatus] = useState(order?.status || "");

  const style = {
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

  if (isLoading) return <div>Loading...</div>;
  if (!order) {
    return <div>No Order...</div>;
  }

  function handleStatusChange(e: { target: { value: string } }): void {
    setNewStatus(e.target.value as string);
    updateOrderStatus.mutate({ id: orderNo, status: e.target.value });
  }

  const statusOptions = isOnTheWay
    ? ORDER_STATUS_ON_THE_WAY
    : ORDER_STATUS_READY;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          sx={{ textAlign: "center" }}
          id="modal-modal-title"
          variant="h6"
          component="h2"
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
          <Select value={newStatus} size="small" onChange={handleStatusChange}>
            {Object.keys(statusOptions).map((statusKey) => (
              <MenuItem key={statusKey} value={statusKey}>
                {statusOptions[statusKey as keyof typeof statusOptions]}
              </MenuItem>
            ))}
          </Select>
        </Stack>
        <Typography>
          <strong>İçerik</strong>
        </Typography>
        <ul>
          {order.items.map((item) => (
            <li key={item.id}>{item.name} </li>
          ))}
        </ul>
      </Box>
    </Modal>
  );
}

export default OrderDetailModal;
