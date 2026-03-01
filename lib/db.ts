import { Pool, PoolClient, QueryResultRow, QueryResult } from 'pg';

const globalForPool = global as unknown as { pool: Pool };

export const pool =
  globalForPool.pool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    max: 5,
  });

if (process.env.NODE_ENV !== 'production')
  globalForPool.pool = pool;

// ----------------------------
// Reusable query function
// Using 'unknown' or a generic T instead of 'any'
// ----------------------------
export const query = <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> => pool.query<T>(text, params);

// ----------------------------
// Optional helper: get a client for transactions
// ----------------------------
export const getClient = async () => {
  const client = await pool.connect();
  return {
    client,
    release: () => client.release(),
    query: <T extends QueryResultRow = QueryResultRow>(
      text: string,
      params?: unknown[]
    ) => client.query<T>(text, params),
  };
};

// ----------------------------
// Optional helper: simple transaction wrapper
// ----------------------------
export const transaction = async <T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};