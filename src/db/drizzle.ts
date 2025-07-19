import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';


<<<<<<< HEAD

=======
>>>>>>> d2aad546ae51ae686502e6bfd923cae2e017ff6b
const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);

export const db = drizzle({ client: sql, casing:"snake_case"});