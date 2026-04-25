import { useQuery } from "@tanstack/react-query";
import type { ListProductsRequestData } from "@task/types/product.js";

import { fetchProductById, fetchProducts } from "@/lib/api";

const productKeys = {
  list: (filters: ListProductsRequestData = {}) =>
    ["products", "list", filters.search ?? null, filters.category ?? null] as const,
  detail: (productId: string) => ["products", "detail", productId] as const,
};

export function useProductsQuery(filters: ListProductsRequestData = {}) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => fetchProducts(filters),
  });
}

export function useProductQuery(productId?: string) {
  return useQuery({
    queryKey: productKeys.detail(productId ?? ""),
    queryFn: () => fetchProductById(productId ?? ""),
    enabled: Boolean(productId),
  });
}
