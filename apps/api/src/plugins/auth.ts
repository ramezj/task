import fp from "fastify-plugin";
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import { supabase } from "./supabase.js";
import type { User } from "@supabase/supabase-js";
import { sendError } from "../lib/responses.js";

declare module "fastify" {
  interface FastifyRequest {
    user: User | null;
    userRole: string | null;
  }
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
    authorizeAdmin: (
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
        request.userRole = null;
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

  fastify.decorate(
    "authorizeAdmin",
    async function (request: FastifyRequest, reply: FastifyReply) {
      await fastify.authenticate(request, reply);

      if (reply.sent || !request.user) {
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", request.user.id)
        .maybeSingle();

      if (error) {
        return sendError(
          reply,
          500,
          "Internal Server Error",
          "Failed to verify user role",
        );
      }

      if (!data) {
        return sendError(reply, 403, "Forbidden", "Profile not found");
      }

      request.userRole = data.role;

      if (data.role !== "admin") {
        return sendError(
          reply,
          403,
          "Forbidden",
          "Admin access is required for this action",
        );
      }
    },
  );
};

export default fp(authPlugin, {
  name: "supabase-auth",
});
