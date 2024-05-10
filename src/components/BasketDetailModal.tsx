import { Box, Modal, Typography, Select, MenuItem, Stack } from "@mui/material";
import {
  useAssignCourierToBasket,
  useBasket,
  useUpdateBasketStatus,
} from "../hooks/useBasket";
import { BASKET_STATUS } from "../utils/constants";
import { useCouriers } from "../hooks/useCourier";
import { useState } from "react";
import { CourierDetail } from "../interfaces/ICourier.interface";

interface BasketDetailModalProps {
  open: boolean;
  handleClose: () => void;
  basketNo: string;
  isOnTheWay?: boolean;
}

function BasketDetailModal({
  open,
  handleClose,
  basketNo,
  isOnTheWay,
}: BasketDetailModalProps) {
  const { data: basket, isLoading } = useBasket(basketNo);
  const updateBasketStatus = useUpdateBasketStatus();
  const assignCourierToBasket = useAssignCourierToBasket();
  const { data: couriers } = useCouriers();
  const [newStatus, setNewStatus] = useState(basket?.status || "");

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
  if (!basket) {
    return <div>No Basket...</div>;
  }

  function handleStatusChange(e: { target: { value: string } }): void {
    setNewStatus(e.target.value as string);
    updateBasketStatus.mutate({ id: basketNo, status: e.target.value });
  }

  function handleCourierChange(e: { target: { value: string } }): void {
    assignCourierToBasket.mutate({
      basketId: basketNo,
      courierId: e.target.value,
    });
  }

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
          Sepet Detay
        </Typography>
        <Stack alignItems="center" direction={"row"}>
          <Typography>
            <strong>Kurye: &nbsp; </strong>{" "}
          </Typography>
          {isOnTheWay ? (
            <Typography>
              {
                couriers?.find((courier: CourierDetail) => {
                  return courier.id === basket.courier_id;
                })?.name
              }
            </Typography>
          ) : (
            <Select
              size="small"
              autoWidth
              value={basket.courier_id || ""}
              onChange={handleCourierChange}
            >
              {couriers &&
                couriers.map((courier: CourierDetail) => (
                  <MenuItem key={courier.id} value={courier.id}>
                    {courier.name}
                  </MenuItem>
                ))}
            </Select>
          )}
        </Stack>
        <Stack alignItems="center" direction={"row"}>
          <Typography>
            <strong>Statü:&nbsp;</strong>
          </Typography>
          <Select size="small" value={newStatus} onChange={handleStatusChange}>
            {Object.keys(BASKET_STATUS).map((statusKey) => (
              <MenuItem key={statusKey} value={statusKey}>
                {BASKET_STATUS[statusKey as keyof typeof BASKET_STATUS]}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        <Typography>
          <strong>Sipariş Numaraları</strong>
        </Typography>
        <ul>
          {basket.orders.map((orderId) => (
            <li key={orderId}>{orderId}</li>
          ))}
        </ul>
      </Box>
    </Modal>
  );
}

export default BasketDetailModal;
