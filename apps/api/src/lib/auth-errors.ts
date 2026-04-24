import { AuthError, isAuthApiError } from "@supabase/supabase-js";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { ApiErrorName } from "@task/types/api.js";
import { sendError } from "./responses.js";

function getErrorNameFromStatus(statusCode: number): ApiErrorName {
  switch (statusCode) {
    case 400:
      return "Bad Request";
    case 401:
      return "Unauthorized";
    case 403:
      return "Forbidden";
    case 404:
      return "Not Found";
    case 409:
      return "Conflict";
    case 422:
      return "Unprocessable Entity";
    case 429:
      return "Too Many Requests";
    case 500:
      return "Internal Server Error";
    case 501:
      return "Not Implemented";
    default:
      return "Bad Request";
  }
}

export function handleSupabaseAuthError(
  request: FastifyRequest,
  reply: FastifyReply,
  error: unknown,
  operation: string,
) {
  if (isAuthApiError(error)) {
    const statusCode = error.status;
    const errorName = getErrorNameFromStatus(statusCode);

    request.log.warn(
      {
        authErrorCode: error.code,
        authErrorName: error.name,
        authErrorStatus: error.status,
      },
      `Supabase auth API error during ${operation}`,
    );

    return sendError(reply, statusCode, errorName, error.message);
  }

  if (error instanceof AuthError) {
    request.log.warn(
      {
        authErrorName: error.name,
      },
      `Supabase auth client error during ${operation}`,
    );

    return sendError(reply, 400, "Bad Request", error.message);
  }

  return undefined;
}
