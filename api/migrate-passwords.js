// Run once: api/migrate-passwords.js
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcrypt';

const sql = neon(process.env.DATABASE_URL);

async function migratePasswords() {
  const accounts = await sql`SELECT acc_id, password FROM accounts`;

  for (const account of accounts) {
    // Only migrate SHA256 hashes (64 chars hex)
    if (account.password.length === 64 && /^[a-f0-9]+$/.test(account.password)) {
      const bcryptHash = bcrypt.hashSync(account.password, 10);
      await sql`UPDATE accounts SET password = ${bcryptHash} WHERE acc_id = ${account.acc_id}`;
      console.log(`Migrated account ${account.acc_id}`);
    }
  }

  console.log('Migration complete');
}

migratePasswords();