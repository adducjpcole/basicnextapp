import { pool } from '@/lib/db';
import TestCategoriesClient from './TestCategoriesClient';

interface TestCategory {
  id: number;
  name: string;
  description: string | null;
}

async function getCategories(): Promise<TestCategory[]> {
  const result = await pool.query<TestCategory>(
    'SELECT id, name, description FROM testcategories ORDER BY id',
  );
  return result.rows;
}

export default async function TestCategoriesPage() {
  const categories = await getCategories();
  return <TestCategoriesClient categories={categories} />;
}
