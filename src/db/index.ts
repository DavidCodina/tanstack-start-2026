import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// For neon-http, you can omit the schema and still get good functionality,
// but including it doesn't hurt and provides better DX if you want to use
// it in your IDE. You only need it if you want to use Relational Queries
// (the db.query API).

export const db = drizzle(process.env.DATABASE_URL!, { schema, logger: true })
