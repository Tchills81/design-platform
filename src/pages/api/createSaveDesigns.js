import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    const db = await openDb();

    // Step 1: Create save_designs table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS save_designs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        author TEXT,
        savedAt TEXT,
        data TEXT,
        thumbnailUrl TEXT,
        userId TEXT
      );
    `);

    res.status(200).json({ message: '✅ save_designs table created successfully.' });
  } catch (err) {
    console.error('🚨 Failed to create save_designs table:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
