import type { FastifyRequest, FastifyReply } from "fastify";
import type {
  LoginErrorResponse,
  LoginSuccessResponse,
} from "@task/types/auth.js";
import {
  LoginBodySchema,
  type LoginBody,
} from "../../routes/auth/schemas.js";
import { handleSupabaseAuthError } from "../../lib/auth-errors.js";
import { sendError, sendSuccess } from "../../lib/responses.js";
import { supabase } from "../../plugins/supabase.js";

export async function loginController(
  req: FastifyRequest<{
    Body: LoginBody;
    Reply: LoginSuccessResponse | LoginErrorResponse;
  }>,
  reply: FastifyReply,
) {
  const parsed = LoginBodySchema.safeParse(req.body);

  if (!parsed.success) {
    const details = Object.entries(parsed.error.flatten().fieldErrors)
      .flatMap(([field, messages]) =>
        (messages ?? []).map((message) => `${field}: ${message}`),
      )
      .join(", ");

    return sendError(
      reply,
      400,
      "Validation Error",
      details || "Validation failed.",
    );
  }

  const { email, password } = parsed.data;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const handledError = handleSupabaseAuthError(req, reply, error, "login");

    if (handledError) {
      return handledError;
    }

    throw error;
  }

  return sendSuccess(reply, 200, {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresIn: data.session.expires_in,
    user: {
      id: data.user.id,
      email: data.user.email ?? null,
      name:
        typeof data.user.user_metadata?.name === "string"
          ? data.user.user_metadata.name
          : null,
    },
  });
}
