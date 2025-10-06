// pages/api/shareDesign.ts
import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    const { designId, userId, accessLevel, invitedEmail } = req.body;
    const db = await openDb();

    await db.run(
      `INSERT INTO shared_designs (designId, userId, accessLevel, invitedEmail)
       VALUES (?, ?, ?, ?)`,
      [designId, userId, accessLevel, invitedEmail]
    );

    res.status(200).json({ message: '✅ Design shared successfully.' });
  } catch (err) {
    console.error('🚨 Share error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
