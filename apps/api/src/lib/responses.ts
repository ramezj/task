import type { FastifyReply } from "fastify";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../packages/types/src/api.js";

export function sendError<TError extends string>(
  reply: FastifyReply,
  statusCode: number,
  error: TError,
  message: string,
) {
  const payload: ApiErrorResponse<TError> = {
    statusCode,
    error,
    message,
  };

  return reply.status(statusCode).send(payload);
}

export function sendSuccess<TData>(
  reply: FastifyReply,
  statusCode: number,
  data: TData,
) {
  const payload: ApiSuccessResponse<TData> = {
    statusCode,
    data,
  };

  return reply.status(statusCode).send(payload);
}
