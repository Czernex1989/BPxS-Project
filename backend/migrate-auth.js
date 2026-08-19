require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function migrateAuth() {
  try {
    console.log("Rozpoczynam przygotowanie bazy pod logowanie...");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      ALTER TABLE clients
      ADD COLUMN IF NOT EXISTS user_id INTEGER
    `);

    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'clients_user_id_fkey'
        ) THEN
          ALTER TABLE clients
          ADD CONSTRAINT clients_user_id_fkey
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE;
        END IF;
      END
      $$
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS clients_user_id_index
      ON clients(user_id)
    `);

    console.log("Migracja zakończona pomyślnie.");
    console.log("Tabela users jest gotowa.");
    console.log("Kolumna user_id została dodana do klientów.");
  } catch (error) {
    console.error("Błąd migracji:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

migrateAuth();
