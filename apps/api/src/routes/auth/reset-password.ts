import type { FastifyPluginAsync } from "fastify";
import type {
  ResetPasswordErrorResponse,
  ResetPasswordSuccessResponse,
} from "@task/types/auth.js";
import { resetPasswordController } from "../../controllers/auth/resetPasswordController.js";
import type { ResetPasswordBody } from "./schemas.js";

const resetPasswordRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post<{
    Body: ResetPasswordBody;
    Reply: ResetPasswordSuccessResponse | ResetPasswordErrorResponse;
  }>("/reset-password", resetPasswordController);
};

export default resetPasswordRoute;
