import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const db = await openDb();
    await db.exec(`DELETE FROM save_designs`);
    res.status(200).json({ message: '🧹 Cleared dual_templates table' });
  } catch (err) {
    console.error('🚨 Clear error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
