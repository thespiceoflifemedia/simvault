import { pool } from "@workspace/db";

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS notification_templates (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        label TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        subject TEXT NOT NULL DEFAULT '',
        body TEXT NOT NULL DEFAULT '',
        active_email BOOLEAN NOT NULL DEFAULT false,
        active_sms BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS legal_documents (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL DEFAULT '',
        active BOOLEAN NOT NULL DEFAULT true,
        require_acceptance BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS forms (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        type TEXT NOT NULL DEFAULT 'intake',
        active BOOLEAN NOT NULL DEFAULT true,
        questions JSONB NOT NULL DEFAULT '[]',
        linked_to TEXT,
        submission_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS form_submissions (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        form_id INTEGER NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
        customer_name TEXT NOT NULL DEFAULT '',
        customer_email TEXT NOT NULL DEFAULT '',
        responses JSONB NOT NULL DEFAULT '{}',
        submitted_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await client.query("COMMIT");
    console.log("Migration complete: created notification_templates, legal_documents, forms, form_submissions");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
