"use server";

import { revalidatePath } from "next/cache";
import { pool, query } from "@/lib/db";

export type ActionResult = { error?: string };

function parseDbError(err: unknown): string {
  if (err && typeof err === "object") {
    const pg = err as Record<string, string>;
    // Unique violation
    if (pg.code === "23505") {
      const detail = pg.detail ?? "";
      const match = detail.match(/\(([^)]+)\)=\(([^)]+)\)/);
      if (match) return `"${match[2]}" is already taken for ${match[1]}.`;
      return "A record with that value already exists.";
    }
    // Foreign key violation on delete
    if (pg.code === "23503") {
      return "Cannot delete: this record is still referenced by another table.";
    }
    // Value too long
    if (pg.code === "22001") {
      const detail = pg.detail ?? pg.message ?? "";
      return detail || "A value is too long for its field.";
    }
    // Not-null violation
    if (pg.code === "23502") {
      return `Field "${pg.column}" is required.`;
    }
    // Fallback: surface the raw Postgres message so nothing is silent
    if (pg.message) return pg.message;
  }
  return "An unexpected error occurred. Please try again.";
}

export async function getUserRoles(userId: string): Promise<string[]> {
  const { rows } = await query<{ roleId: string }>(
    'SELECT "roleId" FROM public.usersroles WHERE "userId" = $1',
    [userId]
  );
  return rows.map((row) => row.roleId);
}


// ─── UOM ────────────────────────────────────────────────────────────────────

export async function createUom(formData: FormData): Promise<ActionResult> {
  try {
    const name = (formData.get("name") as string).trim();
    const description = (formData.get("description") as string).trim() || null;
    await pool.query("INSERT INTO uom (name, description) VALUES ($1, $2)", [
      name,
      description,
    ]);
    revalidatePath("/uom");
    return {};
  } catch (err) {
    return { error: parseDbError(err) };
  }
}

export async function updateUom(formData: FormData): Promise<ActionResult> {
  try {
    const id = formData.get("id") as string;
    const name = (formData.get("name") as string).trim();
    const description = (formData.get("description") as string).trim() || null;
    await pool.query(
      "UPDATE uom SET name=$1, description=$2 WHERE id=$3",
      [name, description, id]
    );
    revalidatePath("/uom");
    return {};
  } catch (err) {
    return { error: parseDbError(err) };
  }
}

export async function deleteUom(id: number): Promise<ActionResult> {
  try {
    await pool.query("DELETE FROM uom WHERE id=$1", [id]);
    revalidatePath("/uom");
    return {};
  } catch (err) {
    return { error: parseDbError(err) };
  }
}

// ─── TEST CATEGORIES ─────────────────────────────────────────────────────────

export async function createTestCategory(formData: FormData): Promise<ActionResult> {
  try {
    const name = (formData.get("name") as string).trim();
    const description = (formData.get("description") as string).trim() || null;
    await pool.query(
      "INSERT INTO testcategories (name, description) VALUES ($1, $2)",
      [name, description]
    );
    revalidatePath("/testcategories");
    return {};
  } catch (err) {
    return { error: parseDbError(err) };
  }
}

export async function updateTestCategory(formData: FormData): Promise<ActionResult> {
  try {
    const id = formData.get("id") as string;
    const name = (formData.get("name") as string).trim();
    const description = (formData.get("description") as string).trim() || null;
    await pool.query(
      "UPDATE testcategories SET name=$1, description=$2 WHERE id=$3",
      [name, description, id]
    );
    revalidatePath("/testcategories");
    return {};
  } catch (err) {
    return { error: parseDbError(err) };
  }
}

export async function deleteTestCategory(id: number): Promise<ActionResult> {
  try {
    await pool.query("DELETE FROM testcategories WHERE id=$1", [id]);
    revalidatePath("/testcategories");
    return {};
  } catch (err) {
    return { error: parseDbError(err) };
  }
}

// ─── MEDICAL TESTS ───────────────────────────────────────────────────────────

export async function createMedicalTest(formData: FormData): Promise<ActionResult> {
  try {
    const name = (formData.get("name") as string).trim();
    const description = (formData.get("description") as string).trim() || null;
    const iduom = formData.get("iduom") as string;
    const idcategory = formData.get("idcategory") as string;
    const normalmin = formData.get("normalmin") as string;
    const normalmax = formData.get("normalmax") as string;
    await pool.query(
      `INSERT INTO medicaltests (name, description, iduom, idcategory, normalmin, normalmax)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        name,
        description,
        iduom,
        idcategory,
        normalmin ? parseFloat(normalmin) : null,
        normalmax ? parseFloat(normalmax) : null,
      ]
    );
    revalidatePath("/medicaltests");
    return {};
  } catch (err) {
    return { error: parseDbError(err) };
  }
}

export async function updateMedicalTest(formData: FormData): Promise<ActionResult> {
  try {
    const id = formData.get("id") as string;
    const name = (formData.get("name") as string).trim();
    const description = (formData.get("description") as string).trim() || null;
    const iduom = formData.get("iduom") as string;
    const idcategory = formData.get("idcategory") as string;
    const normalmin = formData.get("normalmin") as string;
    const normalmax = formData.get("normalmax") as string;
    await pool.query(
      `UPDATE medicaltests
       SET name=$1, description=$2, iduom=$3, idcategory=$4, normalmin=$5, normalmax=$6
       WHERE id=$7`,
      [
        name,
        description,
        iduom,
        idcategory,
        normalmin ? parseFloat(normalmin) : null,
        normalmax ? parseFloat(normalmax) : null,
        id,
      ]
    );
    revalidatePath("/medicaltests");
    return {};
  } catch (err) {
    return { error: parseDbError(err) };
  }
}

export async function deleteMedicalTest(id: number): Promise<ActionResult> {
  try {
    await pool.query("DELETE FROM medicaltests WHERE id=$1", [id]);
    revalidatePath("/medicaltests");
    return {};
  } catch (err) {
    return { error: parseDbError(err) };
  }
}
