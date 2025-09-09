import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const db = await openDb();
    const { name, author, data, thumbnailUrl, userId } = req.body;

    if (!name || !author || !data || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const savedAt = new Date().toISOString();

    await db.run(
      `INSERT INTO save_designs (name, author, savedAt, data, thumbnailUrl, userId)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, author, savedAt, data, thumbnailUrl ?? '', userId]
    );

    res.status(200).json({ message: '✅ Design saved successfully' });
  } catch (err) {
    console.error('🚨 Save error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
