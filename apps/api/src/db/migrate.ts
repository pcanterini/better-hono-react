import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
// Check if .env.production exists, otherwise fall back to .env
const envPath = process.env.NODE_ENV === 'production'
  ? path.resolve(process.cwd(), '.env.production')
  : path.resolve(process.cwd(), '.env');

console.log(`Loading environment from: ${envPath}`);
dotenv.config({ path: envPath });

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  console.log('Running migrations...');
  
  const client = new Client({ connectionString });
  await client.connect();
  const db = drizzle(client);

  try {
    await migrate(db, { migrationsFolder: './src/db/migrations' });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();