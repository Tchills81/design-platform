import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    const db = await openDb();

    // Step 1: Inspect current columns
    const columns = await db.all(`PRAGMA table_info(dual_templates);`);
    const hasUserId = columns.some(col => col.name === 'userId');

    if (hasUserId) {
      return res.status(200).json({ message: '✅ userId column already exists. No changes needed.' });
    }

    // Step 2: Alter table to add userId column
    await db.exec(`ALTER TABLE dual_templates ADD COLUMN userId TEXT;`);

    res.status(200).json({ message: '✅ userId column added successfully.' });
  } catch (err) {
    console.error('🚨 Failed to alter dual_templates table:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
