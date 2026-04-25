import type { FastifyReply, FastifyRequest } from "fastify";
import { supabase } from "../../plugins/supabase.js";
import { sendSuccess } from "../../lib/responses.js";
import type { ListCategoriesSuccessResponse } from "@task/types/product.js";

export async function listCategoriesController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  if (error) {
    throw error;
  }

  return sendSuccess(reply, 200, {
    message: "Categories retrieved successfully.",
    categories: data,
  });
}
