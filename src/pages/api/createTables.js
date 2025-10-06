import { openDb } from '../../../lib/db';

export default async function createTables(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const db = await openDb();

    await db.run(`
      CREATE TABLE IF NOT EXISTS shared_designs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        designId INTEGER NOT NULL,
        userId TEXT NOT NULL,
        accessLevel TEXT CHECK(accessLevel IN ('view', 'comment', 'edit')) NOT NULL,
        invitedEmail TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS reflections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        designId INTEGER NOT NULL,
        elementId TEXT,
        message TEXT NOT NULL,
        tone TEXT CHECK(tone IN ('celebration', 'concern', 'suggestion', 'question')),
        resolved INTEGER DEFAULT 0,
        createdBy TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    res.status(200).json({ message: '✅ Tables created successfully.' });
  } catch (err) {
    console.error('🚨 Migration error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
