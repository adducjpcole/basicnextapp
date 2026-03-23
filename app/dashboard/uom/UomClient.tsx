'use client';

import { useState, useTransition } from 'react';
import Modal from '@/components/Modal';
import { Field, TextAreaField, FormActions } from '@/components/FormFields';
import { createUom, updateUom, deleteUom } from '@/lib/actions';

interface Uom {
  id: number;
  name: string;
  description: string | null;
}

export default function UomClient({ uoms }: { uoms: Uom[] }) {
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Uom | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await createUom(formData);
      setShowCreate(false);
    });
  }

  function handleUpdate(formData: FormData) {
    startTransition(async () => {
      await updateUom(formData);
      setEditing(null);
    });
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      await deleteUom(id);
      setDeletingId(null);
    });
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex items-end justify-between mb-8 border-b border-neutral-200 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">
            Module 01
          </p>
          <h1 className="text-2xl font-semibold text-neutral-800">
            Units of Measure
          </h1>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="text-xs font-semibold uppercase tracking-widest bg-blue-500 hover:bg-blue-600 active:scale-95 text-white px-4 py-2 transition-all"
        >
          + Add Unit
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-neutral-400 w-16">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-neutral-400 w-36">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-neutral-400">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-widest text-neutral-400 w-28">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {uoms.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-neutral-300 text-sm italic"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              uoms.map((uom) => (
                <tr
                  key={uom.id}
                  className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors group"
                >
                  <td className="px-6 py-4 font-mono text-xs text-neutral-300">
                    {String(uom.id).padStart(2, '0')}
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-800">
                    {uom.name}
                  </td>
                  <td className="px-6 py-4 text-neutral-400 text-sm">
                    {uom.description ?? '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditing(uom)}
                        className="text-xs font-semibold uppercase tracking-widest text-neutral-400 hover:text-neutral-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingId(uom.id)}
                        className="text-xs font-semibold uppercase tracking-widest text-neutral-300 hover:text-blue-500 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="px-6 py-3 text-xs font-mono text-neutral-300">
          {uoms.length} record{uoms.length !== 1 ? 's' : ''}
        </div>
      </div>

      {showCreate && (
        <Modal title="Add Unit of Measure" onClose={() => setShowCreate(false)}>
          <form action={handleCreate}>
            <Field label="Name" name="name" required placeholder="e.g. mg/dL" />
            <TextAreaField
              label="Description"
              name="description"
              placeholder="Optional description"
            />
            <FormActions
              onClose={() => setShowCreate(false)}
              submitLabel={isPending ? 'Saving…' : 'Save'}
            />
          </form>
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Unit of Measure" onClose={() => setEditing(null)}>
          <form action={handleUpdate}>
            <input type="hidden" name="id" value={editing.id} />
            <Field
              label="Name"
              name="name"
              required
              defaultValue={editing.name}
            />
            <TextAreaField
              label="Description"
              name="description"
              defaultValue={editing.description ?? ''}
            />
            <FormActions
              onClose={() => setEditing(null)}
              submitLabel={isPending ? 'Saving…' : 'Update'}
            />
          </form>
        </Modal>
      )}

      {deletingId !== null && (
        <Modal title="Confirm Delete" onClose={() => setDeletingId(null)}>
          <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
            This unit will be permanently removed. This will fail if it is
            currently referenced by a medical test.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeletingId(null)}
              className="text-xs font-semibold uppercase tracking-widest text-neutral-400 hover:text-neutral-700 px-4 py-2 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(deletingId)}
              disabled={isPending}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-widest bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-40 transition-all"
            >
              {isPending ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
