import { memo, useState } from "react";

import {
  Box,
  Modal,
  Typography,
  Select,
  MenuItem,
  Stack,
  Divider,
} from "@mui/material";

import {
  useAssignCourierToBasket,
  useUpdateBasketStatus,
} from "../hooks/useBasket";
import { useCouriers } from "../hooks/useCourier";

import { BasketStatus, BasketStatusLabel } from "../utils/constants";

import { ICourier } from "../interfaces/ICourier.interface";
import { IBasket } from "../interfaces/IBasket.interface";

interface BasketDetailModalProps {
  open: boolean;
  handleClose: () => void;
  basket: IBasket;
  isOnTheWay?: boolean;
}

function BasketDetailModalComponent({
  open,
  handleClose,
  basket,
  isOnTheWay,
}: BasketDetailModalProps) {
  const updateBasketStatus = useUpdateBasketStatus();
  const assignCourierToBasket = useAssignCourierToBasket();
  const { data: couriers } = useCouriers();
  const [newStatus, setNewStatus] = useState<BasketStatus>(
    basket?.status || ""
  );

  if (!basket) {
    return <div>No Basket...</div>;
  }

  function handleStatusChange(e: { target: { value: string } }): void {
    setNewStatus(e.target.value as BasketStatus);
    updateBasketStatus.mutate({ id: basket.id, status: e.target.value });
  }

  function handleCourierChange(e: { target: { value: string } }): void {
    assignCourierToBasket.mutate({
      basketId: basket.id,
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
      <Box sx={modalStyle}>
        <Typography
          sx={{ textAlign: "center" }}
          id="modal-modal-title"
          variant="h6"
          component="h2"
          fontWeight="bold"
          mb={2}
        >
          Sepet Detay
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            rowGap: 1,
          }}
        >
          <Typography sx={{ alignContent: "center", textAlign: "center" }}>
            <strong>Kurye : </strong>
          </Typography>
          {isOnTheWay ? (
            <Typography sx={{ minWidth: 150, ml: -3 }}>
              {
                couriers?.find((courier: ICourier) => {
                  return courier.id === basket.courier_id;
                })?.name
              }
            </Typography>
          ) : (
            <Box sx={{ minWidth: 200, justifyContent: "center" }}>
              <Select
                size="small"
                sx={{ minWidth: 150, ml: -4 }}
                value={basket.courier_id || ""}
                onChange={handleCourierChange}
              >
                {couriers &&
                  couriers.map((courier: ICourier) => (
                    <MenuItem key={courier.id} value={courier.id}>
                      {courier.name}
                    </MenuItem>
                  ))}
              </Select>
            </Box>
          )}

          <Typography sx={{ alignContent: "center", textAlign: "center" }}>
            <strong>Statü : </strong>
          </Typography>
          <Box
            sx={{
              minWidth: 200,
            }}
          >
            <Select
              size="small"
              value={newStatus}
              onChange={handleStatusChange}
              sx={{ minWidth: 150, ml: -4 }}
            >
              {Object.keys(BasketStatus).map((statusKey) => (
                <MenuItem key={statusKey} value={statusKey}>
                  {BasketStatusLabel[statusKey as BasketStatus]}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography
          sx={{ textAlign: "center" }}
          id="modal-modal-title"
          variant="body1"
          fontWeight="bold"
          my={1}
        >
          <strong>Sipariş Numaraları</strong>
        </Typography>
        <Box maxWidth={400}>
          <Stack
            maxWidth={400}
            mt={1}
            direction={"row"}
            flexWrap={"wrap"}
            gap={1}
          >
            {basket.orders.map((orderId) => (
              <li key={orderId}>{orderId}</li>
            ))}
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
}

const BasketDetailModal = memo(BasketDetailModalComponent);
export default BasketDetailModal;

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
