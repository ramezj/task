import { apiRequest } from "./client";
import type { 
  ListProductsRequestData, 
  ListProductsSuccessData,
  ProductDetailSuccessData,
  CreateProductRequestData,
  UpdateProductRequestData
} from "@task/types/product.js";

export const productsApi = {
  list: async (query?: ListProductsRequestData) => {
    const response = await apiRequest<ListProductsSuccessData>("/api/products", {
      query: query as Record<string, string | undefined>,
    });
    return response.data;
  },
  
  get: async (id: string) => {
    const response = await apiRequest<ProductDetailSuccessData>(`/api/products/${id}`);
    return response.data;
  },

  create: async (accessToken: string, data: CreateProductRequestData) => {
    const response = await apiRequest<ProductDetailSuccessData>("/api/products", {
      method: "POST",
      accessToken,
      body: data,
    });
    return response.data;
  },

  update: async (accessToken: string, id: string, data: UpdateProductRequestData) => {
    const response = await apiRequest<ProductDetailSuccessData>(`/api/products/${id}`, {
      method: "PATCH",
      accessToken,
      body: data,
    });
    return response.data;
  },

  delete: async (accessToken: string, id: string) => {
    await apiRequest(`/api/products/${id}`, {
      method: "DELETE",
      accessToken,
    });
  },
};
