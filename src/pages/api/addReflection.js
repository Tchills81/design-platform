import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    const { designId, elementId, message, tone, createdBy } = req.body;

    if (!designId || !message || !tone || !createdBy) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const db = await openDb();

    await db.run(
      `INSERT INTO reflections (designId, elementId, message, tone, createdBy)
       VALUES (?, ?, ?, ?, ?)`,
      [designId, elementId || null, message, tone, createdBy]
    );

    res.status(200).json({ message: '✅ Reflection added.' });
  } catch (err) {
    console.error('🚨 Reflection error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
