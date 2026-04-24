import type { ApiSuccessResponse } from "./api.js";

export interface HealthcheckData {
  message: string;
}

export type HealthcheckResponse = ApiSuccessResponse<HealthcheckData>;
