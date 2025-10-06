/**
 * Why This Schema Works
id: auto-incremented primary key

name: design title (e.g. “Ceremony - 001”)

author: creator’s name

templateId: design blueprint ID (e.g. “reflective-001”)

tone: emotional tone (e.g. “reflective”, “festive”)

size: format size (e.g. “postcard”, “portrait-postcard”)

type: design category (e.g. “seasonal”, “gift”)

theme: seasonal theme (e.g. “christmas”, “birthday”)

previewMode: rendering mode (e.g. “printable”, “interactive”)

savedAt: ISO timestamp for archival clarity

data: serialized DualTemplate JSON blob (via serializeDualTemplate())

thumbnailUrl: preview image for quick visual reference

userId: session-linked identity (e.g. email or UUID)
 */

import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
  const db = await openDb();

  await db.exec(`
    DROP TABLE IF EXISTS save_designs;

    CREATE TABLE save_designs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      author TEXT NOT NULL,
      templateId TEXT,
      tone TEXT,
      size TEXT,
      type TEXT,
      theme TEXT,
      previewMode TEXT,
      savedAt TEXT NOT NULL,
      data TEXT NOT NULL,
      thumbnailUrl TEXT,
      userId TEXT NOT NULL
    );
  `);

  res.status(200).json({ message: '✅ Table "save_designs" initialized with ceremonial clarity.' });
}
