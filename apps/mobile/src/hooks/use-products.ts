import { useQuery } from "@tanstack/react-query";
import type { ListProductsRequestData } from "@task/types/product.js";

import { fetchProducts } from "@/lib/api";

const productKeys = {
  list: (filters: ListProductsRequestData = {}) =>
    ["products", "list", filters.search ?? null, filters.category ?? null] as const,
};

export function useProductsQuery(filters: ListProductsRequestData = {}) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => fetchProducts(filters),
  });
}
