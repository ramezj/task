import type { Product, ProductCategory } from "@task/types/product.js";
import type { FastifyReply } from "fastify";

import { sendError } from "../../lib/responses.js";
import { supabase } from "../../plugins/supabase.js";

type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  image_url: string | null;
  is_active: boolean;
  category:
    | {
        id: string;
        name: string;
        slug: string;
      }
    | {
        id: string;
        name: string;
        slug: string;
      }[]
    | null;
};

export const productSelect = `
  id,
  name,
  description,
  price,
  image_url,
  is_active,
  category:categories(
    id,
    name,
    slug
  )
`;

export function mapProductRow(row: ProductRow): Product {
  const categoryValue = Array.isArray(row.category) ? row.category[0] ?? null : row.category;
  const category: ProductCategory | null = categoryValue
    ? {
        id: categoryValue.id,
        name: categoryValue.name,
        slug: categoryValue.slug,
      }
    : null;

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    imageUrl: row.image_url,
    isActive: row.is_active,
    category,
  };
}

export async function resolveCategoryIdBySlug(slug: string, reply: FastifyReply) {
  const { data, error } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    sendError(reply, 500, "Internal Server Error", "Failed to filter products by category");
    return null;
  }

  if (!data) {
    return "";
  }

  return data.id;
}

export async function ensureCategoryExists(categoryId: string | null | undefined, reply: FastifyReply) {
  if (!categoryId) {
    return true;
  }

  const { data, error } = await supabase
    .from("categories")
    .select("id")
    .eq("id", categoryId)
    .maybeSingle();

  if (error) {
    sendError(reply, 500, "Internal Server Error", "Failed to validate category");
    return false;
  }

  if (!data) {
    sendError(reply, 404, "Not Found", "Category not found");
    return false;
  }

  return true;
}
