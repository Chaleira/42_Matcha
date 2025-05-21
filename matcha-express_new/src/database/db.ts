import { Pool, Client, PoolClient } from 'pg';
import { DB_URL } from '../config/config';

const db = new Pool({
  connectionString: DB_URL, // Supabase connection string
  ssl: {
    rejectUnauthorized: false, // required for Supabase
  },
});

db.connect(async (err, client: PoolClient | undefined, done: (release?: any) => void) => {
  console.log("DB connected");
  if (client) {
    await client.query('LISTEN novo_usuario');

    client.on('notification', (msg) => {
      console.log('Notification received:', msg);
    });
  }
})

export default db;
