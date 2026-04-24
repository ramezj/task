import type { ApiErrorResponse, ApiSuccessResponse } from "./api.js";

export interface AuthenticatedUser {
  id: string;
  email: string | null;
  name: string | null;
}

export interface RegisterPendingConfirmationData {
  requiresEmailConfirmation: true;
  message: string;
}

export interface RegisterCompletedData {
  requiresEmailConfirmation: false;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthenticatedUser;
}

export type RegisterSuccessData =
  | RegisterPendingConfirmationData
  | RegisterCompletedData;

export type RegisterSuccessResponse = ApiSuccessResponse<RegisterSuccessData>;

export type RegisterErrorResponse = ApiErrorResponse<
  "Validation Error" | "Conflict" | "Bad Request" | "Internal Server Error"
>;

export interface MeSuccessData {
  message: string;
  user: AuthenticatedUser;
}

export type MeSuccessResponse = ApiSuccessResponse<MeSuccessData>;

export type AuthErrorResponse = ApiErrorResponse<
  "Unauthorized" | "Internal Server Error"
>;
