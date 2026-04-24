import { z } from "zod";

export const RegisterBodySchema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(72),
});

export type RegisterBody = z.infer<typeof RegisterBodySchema>;
