export interface ApiErrorResponse<TError extends string = string> {
  statusCode: number;
  error: TError;
  message: string;
}

export interface ApiSuccessResponse<TData> {
  statusCode: number;
  data: TData;
}
