import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getAllBaskets,
  getBasketById,
  updateBasketStatus,
  assignCourierToBasket,
  addOrderToBasket,
  removeOrderFromBasket,
} from "../services/basket.service";
import { toast } from "react-hot-toast";

const basketKey = "baskets";

export const useBaskets = () => useQuery([basketKey], getAllBaskets);

export const useBasket = (id: string) =>
  useQuery([basketKey, id], () => getBasketById(id));

export const useUpdateBasketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, status }: { id: string; status: string }) =>
      updateBasketStatus(id, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([basketKey]);
        toast.success("Basket Status Updated Successfully!");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useAssignCourierToBasket = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ basketId, courierId }: { basketId: string; courierId: string }) =>
      assignCourierToBasket(basketId, courierId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([basketKey]);
        toast.success("Courier Assigned to Basket Successfully!");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useAddOrderToBasket = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ basketId, orderId }: { basketId: string; orderId: string }) =>
      addOrderToBasket(basketId, orderId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([basketKey]);
        toast.success("Order Added to Basket Successfully!");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useRemoveOrderFromBasket = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ basketId, orderId }: { basketId: string; orderId: string }) =>
      removeOrderFromBasket(basketId, orderId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([basketKey]);
        toast.success("Order Removed from Basket Successfully!");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    }
  );
};
