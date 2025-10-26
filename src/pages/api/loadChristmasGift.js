import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    const db = await openDb();
    const rows = await db.all(`SELECT * FROM template_registry`);

    res.status(200).json(rows);
  } catch (err) {
    console.error('🚨 Load error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
