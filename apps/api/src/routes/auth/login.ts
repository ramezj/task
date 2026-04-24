import type { FastifyPluginAsync } from "fastify";
import type {
  LoginErrorResponse,
  LoginSuccessResponse,
} from "@task/types/auth.js";
import { loginController } from "../../controllers/auth/loginController.js";
import type { LoginBody } from "./schemas.js";

const loginRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post<{
    Body: LoginBody;
    Reply: LoginSuccessResponse | LoginErrorResponse;
  }>("/login", loginController);
};

export default loginRoute;
