export type ApiErrorName =
  | "Bad Request"
  | "Unauthorized"
  | "Forbidden"
  | "Not Found"
  | "Conflict"
  | "Unprocessable Entity"
  | "Too Many Requests"
  | "Internal Server Error"
  | "Not Implemented";

export interface ApiErrorResponse<TError extends string = string> {
  statusCode: number;
  error: TError;
  message: string;
}

export interface ApiSuccessResponse<TData> {
  statusCode: number;
  data: TData;
}
