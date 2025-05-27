import { Pool } from 'pg';
import { DB_URL } from '../config/config';

const db = new Pool({
  connectionString: DB_URL, // Supabase connection string
  ssl: {
    rejectUnauthorized: false, // required for Supabase
  },
});

export default db;
