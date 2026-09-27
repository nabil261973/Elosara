import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { Connector, IpAddressTypes, AuthTypes } from '@google-cloud/cloud-sql-connector';
import * as schema from './schema';

const connector = new Connector();

let dbInstance: NodePgDatabase<typeof schema> | null = null;

export async function getDb(): Promise<NodePgDatabase<typeof schema>> {
  if (dbInstance) {
    return dbInstance;
  }

  // 1. Direct PostgreSQL URL (Neon / Vercel Postgres / Supabase)
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (databaseUrl) {
    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false },
      max: 5,
    });
    dbInstance = drizzle(pool, { schema });
    return dbInstance;
  }

  // 2. Local Cloud SQL Unix Socket / Proxy (AI Studio runtime with SQL_HOST)
  if (process.env.SQL_HOST) {
    const pool = new Pool({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER || process.env.SQL_ADMIN_USER || 'ai_studio_admin',
      password: process.env.SQL_PASSWORD || process.env.SQL_ADMIN_PASSWORD,
      database: process.env.SQL_DB_NAME || 'cloud_sql_development_database',
      max: 5,
    });
    dbInstance = drizzle(pool, { schema });
    return dbInstance;
  }

  // 3. Google Cloud SQL Connector fallback (Cloud Run IAM)
  const instanceConnectionName =
    process.env.INSTANCE_CONNECTION_NAME ||
    'seraphic-domain-l83d0:europe-west3:ai-studio-60c80c86';

  const clientOpts = await connector.getOptions({
    instanceConnectionName,
    ipType: IpAddressTypes.PUBLIC,
    authType: AuthTypes.IAM,
  });

  const pool = new Pool({
    ...clientOpts,
    user: process.env.DB_USER || 'ai_studio_admin',
    database: process.env.DB_NAME || 'cloud_sql_development_database',
    max: 5,
  });

  dbInstance = drizzle(pool, { schema });
  return dbInstance;
}
