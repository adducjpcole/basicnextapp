interface FieldProps {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  step?: string;
}

const inputClass =
  'w-full border-b border-neutral-200 bg-transparent px-0 py-2 text-sm text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:border-blue-400 transition-colors';

export function Field({
  label,
  name,
  defaultValue,
  required,
  placeholder,
  type = 'text',
  step,
}: FieldProps) {
  return (
    <div className="mb-5">
      <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">
        {label} {required && <span className="text-blue-400">*</span>}
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ''}
        required={required}
        placeholder={placeholder}
        step={step}
        className={inputClass}
      />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  name: string;
  defaultValue?: string | number;
  required?: boolean;
  options: { value: string | number; label: string }[];
}

export function SelectField({
  label,
  name,
  defaultValue,
  required,
  options,
}: SelectFieldProps) {
  return (
    <div className="mb-5">
      <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">
        {label} {required && <span className="text-blue-400">*</span>}
      </label>
      <select
        name={name}
        defaultValue={defaultValue ?? ''}
        required={required}
        className="w-full border-b border-neutral-200 bg-transparent px-0 py-2 text-sm text-neutral-800 focus:outline-none focus:border-blue-400 transition-colors appearance-none cursor-pointer"
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function TextAreaField({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <div className="mb-5">
      <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">
        {label}
      </label>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        rows={3}
        className="w-full border-b border-neutral-200 bg-transparent px-0 py-2 text-sm text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:border-blue-400 transition-colors resize-none"
      />
    </div>
  );
}

export function FormActions({
  onClose,
  submitLabel,
}: {
  onClose: () => void;
  submitLabel: string;
  submitColor?: 'blue' | 'green' | 'purple';
}) {
  return (
    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-100">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 text-xs font-semibold uppercase tracking-widest text-neutral-400 hover:text-neutral-700 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 text-xs font-semibold uppercase tracking-widest bg-blue-500 text-white hover:bg-blue-600 active:scale-95 transition-all"
      >
        {submitLabel}
      </button>
    </div>
  );
}
