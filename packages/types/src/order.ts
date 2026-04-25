import type { ApiErrorName, ApiErrorResponse, ApiSuccessResponse } from "./api.js";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  productName: string | null;
  productImageUrl: string | null;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export interface PlaceOrderItemInput {
  productId: string;
  quantity: number;
}

export interface PlaceOrderRequestData {
  items: PlaceOrderItemInput[];
}

export interface PlaceOrderSuccessData {
  message: string;
  order: Order;
}

export interface MyOrdersSuccessData {
  message: string;
  orders: Order[];
}

export interface ListOrdersRequestData {
  page?: number;
  limit?: number;
}

export interface ListOrdersSuccessData {
  message: string;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  orders: Order[];
}

export interface UpdateOrderStatusRequestData {
  status: OrderStatus;
}

export interface UpdateOrderStatusSuccessData {
  message: string;
  order: Order;
}

export type PlaceOrderSuccessResponse = ApiSuccessResponse<PlaceOrderSuccessData>;
export type MyOrdersSuccessResponse = ApiSuccessResponse<MyOrdersSuccessData>;
export type ListOrdersSuccessResponse = ApiSuccessResponse<ListOrdersSuccessData>;
export type UpdateOrderStatusSuccessResponse = ApiSuccessResponse<UpdateOrderStatusSuccessData>;

export type OrderErrorResponse = ApiErrorResponse<
  "Validation Error" | "Unauthorized" | "Forbidden" | "Not Found" | ApiErrorName
>;
