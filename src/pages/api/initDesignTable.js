

/**
 * Why This Schema Works
id: auto-incremented primary key

name: design title (e.g. “Ceremony - 001”)

author: creator’s name

savedAt: ISO timestamp for archival clarity

data: serialized DualTemplate JSON blob (via serializeDualTemplate())
 */
import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
  const db = await openDb();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS designs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      author TEXT,
      savedAt TEXT,
      data TEXT
    )
  `);

  res.status(200).json({ message: '✅ Table "designs" initialized successfully.' });
}
