import { defineConfig } from 'drizzle-kit';

const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

export default defineConfig({
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: dbUrl
    ? { url: dbUrl }
    : {
        host: process.env.SQL_HOST || process.env.DB_HOST || '127.0.0.1',
        user:
          process.env.SQL_ADMIN_USER ||
          process.env.SQL_USER ||
          process.env.DB_USER ||
          'ai_studio_admin',
        password:
          process.env.SQL_ADMIN_PASSWORD ||
          process.env.SQL_PASSWORD ||
          process.env.DB_PASSWORD ||
          '',
        database:
          process.env.SQL_DB_NAME ||
          process.env.DB_NAME ||
          'cloud_sql_development_database',
        ssl: false,
      },
});
