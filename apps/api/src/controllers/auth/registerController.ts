import type { FastifyRequest, FastifyReply } from "fastify";
import { AuthError } from "@supabase/supabase-js";
import type {
  RegisterErrorResponse,
  RegisterSuccessResponse,
} from "@task/types/auth.js";
import {
  RegisterBodySchema,
  type RegisterBody,
} from "../../routes/auth/schemas.js";
import { supabase } from "../../plugins/supabase.js";
import { sendError, sendSuccess } from "../../lib/responses.js";

export async function registerController(
  req: FastifyRequest<{
    Body: RegisterBody;
    Reply: RegisterSuccessResponse | RegisterErrorResponse;
  }>,
  reply: FastifyReply,
) {
  const parsed = RegisterBodySchema.safeParse(req.body);
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

  const { name, email, password } = parsed.data;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });

  if (error) {
    if (error instanceof AuthError) {
      const statusCode = error.message.includes("already registered") ? 409 : 400;
      const errorCode = statusCode === 409 ? "Conflict" : "Bad Request";

      return sendError(reply, statusCode, errorCode, error.message);
    }

    throw error;
  }

  if (!data.session) {
    return sendSuccess(reply, 201, {
      requiresEmailConfirmation: true,
      message:
        "Registration successful. Please check your email to confirm your account.",
    });
  }

  return sendSuccess(reply, 201, {
    requiresEmailConfirmation: false,
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresIn: data.session.expires_in,
    user: {
      id: data.user!.id,
      email: data.user!.email ?? null,
      name,
    },
  });
}
