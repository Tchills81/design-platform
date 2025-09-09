import { openDb } from '../../../lib/db';



export default async function handler(req, res) {
    const db = await openDb();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS card_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT,
      front_template TEXT NOT NULL,  -- JSON string
      back_template TEXT NOT NULL,   -- JSON string
      thumbnail_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  //console.log('✅ card_templates table created');
  res.status(200).json({ message: '✅ Table "dual_templates" initialized successfully.' });
}


