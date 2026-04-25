import type { Order, OrderItem, OrderStatus } from "@task/types/order.js";

export type ProductLookupRow = {
  id: string;
  price: number | string;
};

type OrderRow = {
  id: string;
  user_id: string;
  status: string;
  total_amount: number | string;
  created_at: string;
  order_items:
    | {
        id: string;
        product_id: string;
        quantity: number;
        unit_price: number | string;
        product:
          | {
              name: string | null;
              image_url: string | null;
            }
          | {
              name: string | null;
              image_url: string | null;
            }[]
          | null;
      }[]
    | null;
};

export const orderSelect = `
  id,
  user_id,
  status,
  total_amount,
  created_at,
  order_items(
    id,
    product_id,
    quantity,
    unit_price,
    product:products(
      name,
      image_url
    )
  )
`;

export function mapOrderRow(row: OrderRow): Order {
  const items: OrderItem[] = (row.order_items ?? []).map((item) => {
    const productValue = Array.isArray(item.product) ? (item.product[0] ?? null) : item.product;

    return {
      id: item.id,
      productId: item.product_id,
      quantity: item.quantity,
      unitPrice: Number(item.unit_price),
      productName: productValue?.name ?? null,
      productImageUrl: productValue?.image_url ?? null,
    };
  });

  return {
    id: row.id,
    userId: row.user_id,
    status: row.status as OrderStatus,
    totalAmount: Number(row.total_amount),
    createdAt: row.created_at,
    items,
  };
}
