import type { ApiErrorName, ApiErrorResponse, ApiSuccessResponse } from "./api.js";

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
  category: ProductCategory | null;
}

export interface ListProductsRequestData {
  search?: string;
  category?: string;
}

export interface ListProductsSuccessData {
  message: string;
  products: Product[];
}

export interface ProductDetailSuccessData {
  message: string;
  product: Product;
}

export interface CreateProductRequestData {
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  categoryId?: string | null;
  isActive?: boolean;
}

export interface UpdateProductRequestData {
  name?: string;
  description?: string | null;
  price?: number;
  imageUrl?: string | null;
  categoryId?: string | null;
  isActive?: boolean;
}

export interface ProductMutationSuccessData {
  message: string;
  product: Product;
}

export interface DeleteProductSuccessData {
  message: string;
}

export type ListProductsSuccessResponse = ApiSuccessResponse<ListProductsSuccessData>;
export type ProductDetailSuccessResponse = ApiSuccessResponse<ProductDetailSuccessData>;
export type ProductMutationSuccessResponse = ApiSuccessResponse<ProductMutationSuccessData>;
export type DeleteProductSuccessResponse = ApiSuccessResponse<DeleteProductSuccessData>;

export interface ListCategoriesSuccessData {
  message: string;
  categories: ProductCategory[];
}

export type ListCategoriesSuccessResponse = ApiSuccessResponse<ListCategoriesSuccessData>;

export type ProductErrorResponse = ApiErrorResponse<
  "Validation Error" | "Unauthorized" | "Forbidden" | "Not Found" | ApiErrorName
>;
