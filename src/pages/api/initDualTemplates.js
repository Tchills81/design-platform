import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
  const db = await openDb();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS dual_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      author TEXT,
      savedAt TEXT,
      data TEXT
    )
  `);

  res.status(200).json({ message: '✅ Table "dual_templates" initialized successfully.' });
}
