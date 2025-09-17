import { openDb } from '../../../lib/db';

// Recreates: christmas_templates with expanded schema
export default async function handler(req, res) {
  const db = await openDb();

  try {
    // Step 1: Drop the existing table
    await db.exec(`DROP TABLE IF EXISTS christmas_templates`);

    // Step 2: Recreate with evolved schema
    await db.exec(`
      CREATE TABLE christmas_templates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        author TEXT,
        templateId TEXT,
        tone TEXT,
        size TEXT,
        type TEXT,
        theme TEXT,
        previewMode TEXT,
        savedAt TEXT,
        data TEXT
      )
    `);

    res.status(200).json({
      message: '🧹 Table "christmas_templates" dropped and recreated with expanded schema.'
    });
  } catch (err) {
    console.error('🚨 Table recreation error:', err);
    res.status(500).json({ message: 'Internal Server Error during table recreation.' });
  }
}
