import { pool } from '@/lib/db';
import UomClient from './UomClient';

interface Uom {
  id: number;
  name: string;
  description: string | null;
}

async function getUoms(): Promise<Uom[]> {
  const result = await pool.query<Uom>(
    'SELECT id, name, description FROM uom ORDER BY id',
  );
  return result.rows;
}

export default async function UomPage() {
  const uoms = await getUoms();
  return <UomClient uoms={uoms} />;
}
