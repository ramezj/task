import type { FastifyRequest, FastifyReply } from "fastify";
import type {
  ResetPasswordErrorResponse,
  ResetPasswordSuccessResponse,
} from "@task/types/auth.js";
import { env } from "../../config/env.js";
import { handleSupabaseAuthError } from "../../lib/auth-errors.js";
import { sendError, sendSuccess } from "../../lib/responses.js";
import { supabase } from "../../plugins/supabase.js";
import {
  ResetPasswordBodySchema,
  type ResetPasswordBody,
} from "../../routes/auth/schemas.js";

export async function resetPasswordController(
  req: FastifyRequest<{
    Body: ResetPasswordBody;
    Reply: ResetPasswordSuccessResponse | ResetPasswordErrorResponse;
  }>,
  reply: FastifyReply,
) {
  const parsed = ResetPasswordBodySchema.safeParse(req.body);

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

  const { email } = parsed.data;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${env.CLIENT_URL}/reset-password`,
  });

  if (error) {
    const handledError = handleSupabaseAuthError(
      req,
      reply,
      error,
      "reset password",
    );

    if (handledError) {
      return handledError;
    }

    throw error;
  }

  return sendSuccess(reply, 200, {
    message: "If the account exists, a password reset email has been sent.",
  });
}
