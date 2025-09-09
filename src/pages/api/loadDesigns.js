import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
  const db = await openDb();
  const designs = await db.all('SELECT * FROM designs ORDER BY savedAt DESC');
  res.status(200).json(designs);
}
