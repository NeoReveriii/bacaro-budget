import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function ensurePasswordResetSchema() {
  const reg = await sql`SELECT to_regclass('public.password_resets') AS reg`;
  const exists = Boolean(reg?.[0]?.reg);

  if (!exists) {
    await sql`
      CREATE TABLE IF NOT EXISTS password_resets (
        reset_id SERIAL PRIMARY KEY,
        account_id INTEGER NOT NULL REFERENCES accounts(acc_id) ON DELETE CASCADE,
        reset_token TEXT NOT NULL UNIQUE,
        token_hash TEXT NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        used_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        ip_address TEXT,
        user_agent TEXT
      );

      CREATE INDEX idx_password_resets_token_hash ON password_resets(token_hash);
      CREATE INDEX idx_password_resets_account_id ON password_resets(account_id);
      CREATE INDEX idx_password_resets_expires_at ON password_resets(expires_at);
    `;
  }
}

export async function ensureAccountsSchema() {
  // Check if password reset attempt tracking column exists
  const columnCheck = await sql`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'accounts' AND column_name = 'last_password_reset_at'
    ) AS exists
  `;

  if (!columnCheck[0].exists) {
    await sql`
      ALTER TABLE accounts ADD COLUMN last_password_reset_at TIMESTAMPTZ,
      ADD COLUMN password_reset_attempts INT DEFAULT 0,
      ADD COLUMN password_reset_locked_until TIMESTAMPTZ
    `;
  }
}