import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Missing reflection ID' });
    }

    const db = await openDb();

    await db.run(
      `UPDATE reflections SET resolved = 1 WHERE id = ?`,
      [id]
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('🚨 Resolve error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
