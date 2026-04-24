import type {
  ApiErrorName,
  ApiErrorResponse,
  ApiSuccessResponse,
} from "./api.js";

export interface AuthenticatedUser {
  id: string;
  email: string | null;
  name: string | null;
}

export interface RegisterPendingConfirmationData {
  requiresEmailConfirmation: true;
  message: string;
}

export interface AuthSessionData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthenticatedUser;
}

export interface RegisterCompletedData extends AuthSessionData {
  requiresEmailConfirmation: false;
}

export type RegisterSuccessData =
  | RegisterPendingConfirmationData
  | RegisterCompletedData;

export type RegisterSuccessResponse = ApiSuccessResponse<RegisterSuccessData>;

export type RegisterErrorResponse = ApiErrorResponse<
  "Validation Error" | ApiErrorName
>;

export type LoginSuccessResponse = ApiSuccessResponse<AuthSessionData>;

export type LoginErrorResponse = ApiErrorResponse<
  "Validation Error" | ApiErrorName
>;

export interface ResetPasswordSuccessData {
  message: string;
}

export type ResetPasswordSuccessResponse =
  ApiSuccessResponse<ResetPasswordSuccessData>;

export type ResetPasswordErrorResponse = ApiErrorResponse<
  "Validation Error" | ApiErrorName
>;

export interface MeSuccessData {
  message: string;
  user: AuthenticatedUser;
}

export type MeSuccessResponse = ApiSuccessResponse<MeSuccessData>;

export type AuthErrorResponse = ApiErrorResponse<
  "Unauthorized" | "Internal Server Error"
>;
