import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getAllBaskets,
  getBasketById,
  updateBasketStatus,
  assignCourierToBasket,
  addOrderToBasket,
  removeOrderFromBasket,
  createBasket,
  removeBasket,
} from "../services/basket.service";
import { toast } from "react-hot-toast";

const basketKey = "baskets";

export const useBaskets = () => useQuery([basketKey], getAllBaskets);

export const useBasket = (id: string) =>
  useQuery([basketKey, id], () => getBasketById(id), { enabled: !!id });

export const useUpdateBasketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, status }: { id: string; status: string }) =>
      updateBasketStatus(id, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([basketKey]);
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
        toast.success("Kurye başarıyla sepete atandı.");
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
        toast.success("Sipariş başarıyla sepete eklendi.");
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
        toast.success("Sipariş sepetten başarıyla kaldırıldı.");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    }
  );
};
export const useCreateBasket = () => {
  const queryClient = useQueryClient();

  return useMutation((newBasket: string[]) => createBasket(newBasket), {
    onSuccess: () => {
      queryClient.invalidateQueries([basketKey]);
      toast.success("Sepet başarıyla oluşturuldu.");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
export const useRemoveBasket = () => {
  const queryClient = useQueryClient();

  return useMutation((basketId: string) => removeBasket(basketId), {
    onSuccess: () => {
      queryClient.invalidateQueries([basketKey]);
      toast.success("Sepet başarıyla silindi.");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
