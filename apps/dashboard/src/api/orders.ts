import { apiRequest } from "./client";
import type { 
  ListOrdersSuccessData,
  OrderDetailSuccessData,
  UpdateOrderStatusRequestData,
  ListOrdersRequestData
} from "@task/types/order.js";

export const ordersApi = {
  list: async (accessToken: string, query?: ListOrdersRequestData & { status?: string }) => {
    const response = await apiRequest<ListOrdersSuccessData>("/api/orders", {
      accessToken,
      query: query as Record<string, string | undefined>,
    });
    return response.data;
  },

  get: async (accessToken: string, id: string) => {
    const response = await apiRequest<OrderDetailSuccessData>(`/api/orders/${id}`, {
      accessToken,
    });
    return response.data;
  },

  updateStatus: async (accessToken: string, id: string, data: UpdateOrderStatusRequestData) => {
    const response = await apiRequest<OrderDetailSuccessData>(`/api/orders/${id}/status`, {
      method: "PATCH",
      accessToken,
      body: data,
    });
    return response.data;
  },
};
