import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
  const db = await openDb();

  if (req.method === 'GET') {
    try {
      const templates = await db.all('SELECT * FROM card_templates ORDER BY created_at DESC');
      res.status(200).json(templates);
    } catch (error) {
      console.error('❌ Failed to fetch templates:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
