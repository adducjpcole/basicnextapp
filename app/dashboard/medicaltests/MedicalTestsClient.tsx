"use client";

import { useState, useTransition } from "react";
import Modal from "@/components/Modal";
import { Field, TextAreaField, SelectField, FormActions } from "@/components/FormFields";
import { createMedicalTest, updateMedicalTest, deleteMedicalTest } from "@/lib/actions";
import { downloadMedicalTestsExcel } from "./DownloadMedicalTestsExcel";
import DownloadMedicalTestsPdf from "./DownloadMedicalTestsPdf";

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

interface Uom { id: number; name: string; }
interface TestCategory { id: number; name: string; }

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  );
}

export default function MedicalTestsClient({
  tests, uoms, categories,
}: {
  tests: MedicalTest[];
  uoms: Uom[];
  categories: TestCategory[];
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<MedicalTest | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const uomOptions = uoms.map((u) => ({ value: u.id, label: u.name }));
  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  function openCreate() { setFormError(null); setShowCreate(true); }
  function openEdit(test: MedicalTest) { setFormError(null); setEditing(test); }
  function openDelete(id: number) { setDeleteError(null); setDeletingId(id); }

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createMedicalTest(formData);
      if (result?.error) { setFormError(result.error); return; }
      setShowCreate(false);
    });
  }

  function handleUpdate(formData: FormData) {
    startTransition(async () => {
      const result = await updateMedicalTest(formData);
      if (result?.error) { setFormError(result.error); return; }
      setEditing(null);
    });
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      const result = await deleteMedicalTest(id);
      if (result?.error) { setDeleteError(result.error); return; }
      setDeletingId(null);
    });
  }

  const TestForm = ({ test, action, onClose, submitLabel }: {
    test?: MedicalTest;
    action: (f: FormData) => void;
    onClose: () => void;
    submitLabel: string;
  }) => (
    <form action={action}>
      {test && <input type="hidden" name="id" value={test.id} />}
      <Field label="Test Name" name="name" required defaultValue={test?.name} placeholder="e.g. Fasting Blood Glucose" />
      <TextAreaField label="Description" name="description" defaultValue={test?.description ?? ""} placeholder="Optional description" />
      <SelectField label="Unit of Measure" name="iduom" required defaultValue={test?.iduom} options={uomOptions} />
      <SelectField label="Category" name="idcategory" required defaultValue={test?.idcategory} options={categoryOptions} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Normal Min" name="normalmin" type="number" step="0.01" defaultValue={test?.normalmin?.toString() ?? ""} placeholder="e.g. 70" />
        <Field label="Normal Max" name="normalmax" type="number" step="0.01" defaultValue={test?.normalmax?.toString() ?? ""} placeholder="e.g. 99" />
      </div>
      <FormActions onClose={onClose} submitLabel={isPending ? "Saving…" : submitLabel} />
    </form>
  );

  return (
    <>
      <div className="flex items-end justify-between mb-8 border-b border-neutral-200 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">Module 03</p>
          <h1 className="text-2xl font-semibold text-neutral-800">Medical Tests</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadMedicalTestsExcel(tests)}
            className="text-xs font-semibold uppercase tracking-widest bg-green-600 hover:bg-green-700 active:scale-95 text-white px-4 py-2 transition-all"
          >
            Download Excel
          </button>
          <DownloadMedicalTestsPdf tests={tests} />
          <button
            onClick={openCreate}
            className="text-xs font-semibold uppercase tracking-widest bg-blue-500 hover:bg-blue-600 active:scale-95 text-white px-4 py-2 transition-all"
          >
            + Add Test
          </button>
        </div>
      </div>

      <div className="bg-white border border-neutral-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-neutral-400 w-12">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-neutral-400">Test Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-neutral-400">Category</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-neutral-400">Unit</th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-widest text-neutral-400">Min</th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-widest text-neutral-400">Max</th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-widest text-neutral-400 w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-neutral-300 text-sm italic">No records found.</td>
              </tr>
            ) : (
              tests.map((test) => (
                <tr key={test.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs text-neutral-300">{String(test.id).padStart(2, "0")}</td>
                  <td className="px-6 py-4 font-medium text-neutral-800">{test.name}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold uppercase tracking-widest text-blue-400 border border-blue-200 px-2 py-0.5">
                      {test.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-400 text-sm">{test.unit}</td>
                  <td className="px-6 py-4 text-right font-mono text-xs text-neutral-500">{test.normalmin ?? "—"}</td>
                  <td className="px-6 py-4 text-right font-mono text-xs text-neutral-500">{test.normalmax ?? "—"}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(test)} className="text-xs font-semibold uppercase tracking-widest text-neutral-400 hover:text-neutral-700 transition-colors">Edit</button>
                      <button onClick={() => openDelete(test.id)} className="text-xs font-semibold uppercase tracking-widest text-neutral-300 hover:text-blue-500 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="px-6 py-3 text-xs font-mono text-neutral-300">
          {tests.length} record{tests.length !== 1 ? "s" : ""}
        </div>
      </div>

      {showCreate && (
        <Modal title="Add Medical Test" onClose={() => setShowCreate(false)}>
          {formError && <ErrorBanner message={formError} />}
          <TestForm action={handleCreate} onClose={() => setShowCreate(false)} submitLabel="Save" />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Medical Test" onClose={() => setEditing(null)}>
          {formError && <ErrorBanner message={formError} />}
          <TestForm test={editing} action={handleUpdate} onClose={() => setEditing(null)} submitLabel="Update" />
        </Modal>
      )}

      {deletingId !== null && (
        <Modal title="Confirm Delete" onClose={() => setDeletingId(null)}>
          {deleteError && <ErrorBanner message={deleteError} />}
          <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
            This medical test will be permanently removed. This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setDeletingId(null)} className="text-xs font-semibold uppercase tracking-widest text-neutral-400 hover:text-neutral-700 px-4 py-2 transition-colors">Cancel</button>
            <button onClick={() => handleDelete(deletingId)} disabled={isPending} className="px-4 py-2 text-xs font-semibold uppercase tracking-widest bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-40 transition-all">
              {isPending ? "Deleting…" : "Delete"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
