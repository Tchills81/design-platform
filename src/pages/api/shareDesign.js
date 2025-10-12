import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { designId, invitedEmail, accessLevel, userId } = req.body;

  if (!designId || !invitedEmail || !accessLevel || !userId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const db = await openDb();

    await db.run(`
      INSERT INTO shareDesign (designId, invitedEmail, accessLevel, invitedBy)
      VALUES (?, ?, ?, ?)
    `, [designId, invitedEmail, accessLevel, userId]);

    return res.status(200).json({ message: 'Invitation recorded successfully' });
  } catch (err) {
    console.error('🚨 ShareDesign error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
