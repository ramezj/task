import fp from "fastify-plugin";
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import { supabase } from "./supabase.js";
import type { User } from "@supabase/supabase-js";
import { sendError } from "../lib/responses.js";

declare module "fastify" {
  interface FastifyRequest {
    user: User | null;
  }
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}

export const authPlugin: FastifyPluginAsync = async (fastify, options) => {
  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
          return sendError(
            reply,
            401,
            "Unauthorized",
            "Missing authorization header",
          );
        }
        const token = authHeader.replace("Bearer ", "");
        if (!token) {
          return sendError(reply, 401, "Unauthorized", "Missing token");
        }
        const { data, error } = await supabase.auth.getUser(token);
        if (error || !data.user) {
          return sendError(
            reply,
            401,
            "Unauthorized",
            "Invalid token or user not found",
          );
        }
        request.user = data.user;
      } catch (err) {
        return sendError(
          reply,
          500,
          "Internal Server Error",
          "Authentication failed",
        );
      }
    },
  );
};

export default fp(authPlugin, {
  name: "supabase-auth",
});
