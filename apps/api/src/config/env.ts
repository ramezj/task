import { z } from 'zod'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(import.meta.dirname, '.env') })

const EnvSchema = z.object({
  NODE_ENV:                  z.enum(['development', 'production', 'test']).default('development'),
  PORT:                      z.coerce.number().default(3000),
  LOG_LEVEL:                 z.enum(['fatal','error','warn','info','debug','trace']).default('info'),
  SUPABASE_URL:              z.string().url(),
  SUPABASE_ANON_KEY:         z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_JWT_SECRET:       z.string().min(32),
  CLIENT_URL:                z.string().url(),
})

export const env = EnvSchema.parse(process.env)
export type Env  = z.infer<typeof EnvSchema>