import { openDb } from '../../../lib/db';

export default async function createTables(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const db = await openDb();

    // Shared designs
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

    // Reflections
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

    // Share design invites
    await db.run(`
      CREATE TABLE IF NOT EXISTS shareDesign (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        designId INTEGER NOT NULL,
        invitedEmail TEXT NOT NULL,
        accessLevel TEXT CHECK(accessLevel IN ('view', 'comment', 'edit')) NOT NULL,
        invitedBy TEXT NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Christmas templates (example category)
    await db.exec(`
      CREATE TABLE IF NOT EXISTS christmas_templates (
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

    // General templates registry
    await db.exec(`
      CREATE TABLE IF NOT EXISTS template_registry (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        author TEXT,
        templateId TEXT,
        tone TEXT,
        size TEXT,
        type TEXT CHECK(type IN ('social', 'print', 'presentation', 'video', 'card')),
        theme TEXT,
        previewMode TEXT CHECK(previewMode IN ('grid', 'carousel', 'fullscreen', 'thumbnail')),
        savedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        data TEXT
      )
    `);

    res.status(200).json({ message: '✅ Tables created successfully.' });
  } catch (err) {
    console.error('🚨 Migration error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
