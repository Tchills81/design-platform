import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
  const db = await openDb();

  try {
    await db.exec('DELETE FROM card_templates');
    res.status(200).json({ message: '✅ Table "card_templates" cleared successfully.' });
  } catch (error) {
    console.error('❌ Error clearing table:', error);
    res.status(500).json({ error: 'Failed to clear card_templates table' });
  }
}
