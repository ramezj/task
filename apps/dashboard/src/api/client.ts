import type { ApiErrorResponse, ApiSuccessResponse } from "@task/types/api.js";

const API_URL = process.env.API_URL || "http://localhost:8080";

function isApiErrorResponse(payload: unknown): payload is ApiErrorResponse {
  if (!payload || typeof payload !== "object") {
    return false;
  }
  return "error" in payload && "message" in payload;
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly errorName: string
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

type RequestOptions = {
  accessToken?: string;
  body?: unknown;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  query?: Record<string, string | undefined>;
};

export async function apiRequest<TData>(path: string, options: RequestOptions = {}) {
  const queryString = options.query
    ? new URLSearchParams(
        Object.entries(options.query).filter((entry): entry is [string, string] =>
          typeof entry[1] === "string" && entry[1].length > 0
        )
      ).toString()
    : "";

  const response = await fetch(`${API_URL}${path}${queryString ? `?${queryString}` : ""}`, {
    method: options.method ?? "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });

  const payload = (await response.json().catch(() => null)) as
    | ApiSuccessResponse<TData>
    | ApiErrorResponse
    | null;

  if (!response.ok) {
    const errorPayload = isApiErrorResponse(payload) ? payload : null;

    throw new ApiClientError(
      errorPayload?.message ?? "Request failed.",
      errorPayload?.statusCode ?? response.status,
      errorPayload?.error ?? "Request Error"
    );
  }

  return payload as ApiSuccessResponse<TData>;
}
