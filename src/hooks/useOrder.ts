import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../services/order.service";
import { toast } from "react-hot-toast";
import { Order, UpdateOrderParams } from "../interfaces/IOrder.interface";
import { useBaskets } from "./useBasket";

const orderKey = "orders";

export const useOrders = () => useQuery([orderKey], getAllOrders);

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (params: UpdateOrderParams) => updateOrderStatus(params.id, params.status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([orderKey]);
        toast.success("Sipariş başarıyla güncellendi");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useOrder = (id: string) =>
  useQuery([orderKey, id], () => getOrderById(id));

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation((newOrder: Order) => createOrder(newOrder), {
    onSuccess: () => {
      queryClient.invalidateQueries([orderKey]);
      toast.success("Sipariş başarıyla oluşturuldu");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
export const useOrdersByBasket = (basketNo: string) => {
  const { data: allOrders, isLoading, error } = useOrders();
  const { data: allBaskets } = useBaskets();

  const basket = allBaskets?.find((basket) => basket.id === basketNo);
  const orders = basket
    ? allOrders?.filter((order) => basket.orders.includes(order.id as string))
    : [];

  return { data: orders, isLoading, error };
};
