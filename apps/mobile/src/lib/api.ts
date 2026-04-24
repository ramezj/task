import { config } from "@/lib/config";
import type { ApiErrorResponse, ApiSuccessResponse } from "@task/types/api.js";
import type {
  AuthSessionData,
  LoginRequestData,
  MeSuccessData,
  RegisterRequestData,
  RegisterSuccessData,
} from "@task/types/auth.js";

export type { AuthenticatedUser } from "@task/types/auth.js";

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
  method?: "GET" | "POST";
};

async function request<TData>(path: string, options: RequestOptions = {}) {
  const response = await fetch(`${config.apiUrl}${path}`, {
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

export async function login(payload: LoginRequestData) {
  const response = await request<AuthSessionData>("/api/auth/login", {
    method: "POST",
    body: payload,
  });

  return response.data;
}

export async function register(payload: RegisterRequestData) {
  const response = await request<RegisterSuccessData>("/api/auth/register", {
    method: "POST",
    body: payload,
  });

  return response.data;
}

export async function fetchCurrentUser(accessToken: string) {
  const response = await request<MeSuccessData>("/api/auth/me", {
    accessToken,
  });

  return response.data;
}
