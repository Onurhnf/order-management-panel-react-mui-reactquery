import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../services/order.service";
import { toast } from "react-hot-toast";
import { UpdateOrderParams } from "../interfaces/IOrder.interface";

const orderKey = "orders";

export const useOrders = () => useQuery([orderKey], getAllOrders);

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (params: UpdateOrderParams) => updateOrderStatus(params.id, params.status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([orderKey]);
        toast.success("Order Updated Successfully!");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useOrder = (id: string) =>
  useQuery([orderKey, id], () => getOrderById(id));
