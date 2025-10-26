import { openDb } from '../../../lib/db';

export default async function createTables(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const db = await openDb();

  // 🔥 Drop and recreate template_registry
await db.exec(`DROP TABLE IF EXISTS template_registry`);
console.log('🧹 Dropped existing template_registry table');

await db.exec(`
  CREATE TABLE template_registry (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    author TEXT,
    templateId TEXT UNIQUE,
    tone TEXT,
    size TEXT,
    type TEXT CHECK(type IN (
      'social', 'print', 'presentation', 'video', 'card', 'announcement', 'promo',
      'greeting', 'invite', 'flyer', 'poster'
    )),
    subtype TEXT,
    theme TEXT,
    previewMode TEXT CHECK(previewMode IN ('grid', 'carousel', 'fullscreen', 'thumbnail', 'card')),
    savedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    data TEXT
  )
`);

console.log('✅ Recreated template_registry table with expanded type support');


    // Optional: recreate other tables if needed
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

    res.status(200).json({ message: '✅ Tables dropped and recreated successfully.' });
  } catch (err) {
    console.error('🚨 Migration error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
