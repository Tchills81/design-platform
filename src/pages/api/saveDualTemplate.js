import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, author, savedAt, data } = req.body;

  if (!name || !author || !savedAt || !data) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const db = await openDb();
    await db.run(
      `INSERT INTO dual_templates (name, author, savedAt, data) VALUES (?, ?, ?, ?)`,
      [name, author, savedAt, data]
    );
    res.status(200).json({ message: '🌱 DualTemplate saved successfully' });
  } catch (err) {
    console.error('🚨 Save error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
