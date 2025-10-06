import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    const { designId } = req.query;

    if (!designId) {
      return res.status(400).json({ message: 'Missing designId' });
    }

    const db = await openDb();

    const reflections = await db.all(
      `SELECT * FROM reflections WHERE designId = ? ORDER BY createdAt DESC`,
      [designId]
    );

    res.status(200).json(reflections);
  } catch (err) {
    console.error('🚨 Fetch error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
