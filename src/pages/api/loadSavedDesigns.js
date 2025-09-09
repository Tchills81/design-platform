import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'Missing userId' });
  }

  try {
    const db = await openDb();
    const designs = await db.all(
      `SELECT * FROM save_designs WHERE userId = ? ORDER BY savedAt DESC`,
      [userId]
    );

    res.status(200).json(designs);
  } catch (err) {
    console.error('🚨 Load error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
