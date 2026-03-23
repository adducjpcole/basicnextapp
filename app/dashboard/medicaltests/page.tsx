import { pool } from '@/lib/db';
import MedicalTestsClient from './MedicalTestsClient';

interface MedicalTest {
  id: number;
  name: string;
  description: string | null;
  category: string;
  unit: string;
  iduom: number;
  idcategory: number;
  normalmin: number | null;
  normalmax: number | null;
}

interface Uom {
  id: number;
  name: string;
}

interface TestCategory {
  id: number;
  name: string;
}

async function getMedicalTests(): Promise<MedicalTest[]> {
  const result = await pool.query<MedicalTest>(`
    SELECT
      mt.id,
      mt.name,
      mt.description,
      tc.name  AS category,
      u.name   AS unit,
      mt.iduom,
      mt.idcategory,
      mt.normalmin,
      mt.normalmax
    FROM medicaltests mt
    JOIN testcategories tc ON mt.idcategory = tc.id
    JOIN uom u             ON mt.iduom      = u.id
    ORDER BY mt.id
  `);
  return result.rows;
}

async function getUoms(): Promise<Uom[]> {
  const result = await pool.query<Uom>(
    'SELECT id, name FROM uom ORDER BY name',
  );
  return result.rows;
}

async function getCategories(): Promise<TestCategory[]> {
  const result = await pool.query<TestCategory>(
    'SELECT id, name FROM testcategories ORDER BY name',
  );
  return result.rows;
}

export default async function MedicalTestsPage() {
  const [tests, uoms, categories] = await Promise.all([
    getMedicalTests(),
    getUoms(),
    getCategories(),
  ]);

  return (
    <MedicalTestsClient tests={tests} uoms={uoms} categories={categories} />
  );
}
