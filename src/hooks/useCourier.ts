import { useQuery } from "react-query";
import { getAllCouriers, getCourierById } from "../services/courier.service";

const courierKey = "couriers";

export const useCouriers = () => useQuery([courierKey], getAllCouriers);

export const useCourier = (id: string) =>
  useQuery([courierKey, id], () => getCourierById(id), { enabled: !!id });
