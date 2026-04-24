import type { FastifyPluginAsync } from "fastify";
import type {
  RegisterErrorResponse,
  RegisterSuccessResponse,
} from "@task/types/auth.js";
import { registerController } from "../../controllers/auth/registerController.js";
import type { RegisterBody } from "./schemas.js";

const registerRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post<{
    Body: RegisterBody;
    Reply: RegisterSuccessResponse | RegisterErrorResponse;
  }>("/register", registerController);
};

export default registerRoute;
