import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchMyOrders, placeOrder } from "@/lib/api";

const orderKeys = {
  myOrders: (accessToken: string | null) => ["orders", "my", accessToken] as const,
  myOrdersRoot: ["orders", "my"] as const,
};

export function useMyOrdersQuery(accessToken?: string | null) {
  return useQuery({
    queryKey: orderKeys.myOrders(accessToken ?? null),
    queryFn: () => fetchMyOrders(accessToken!),
    enabled: Boolean(accessToken),
  });
}

export function usePlaceOrderMutation(accessToken?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof placeOrder>[1]) => placeOrder(accessToken!, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: orderKeys.myOrdersRoot });
    },
  });
}
