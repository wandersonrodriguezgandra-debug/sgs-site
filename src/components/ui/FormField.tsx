import type { ChangeEvent } from 'react'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'number'
  placeholder?: string
  required?: boolean
  error?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  options?: { label: string; value: string }[]
  rows?: number
  maxLength?: number
  autoComplete?: string
}

export default function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  error,
  value,
  onChange,
  options,
  rows = 4,
  maxLength,
  autoComplete,
}: FormFieldProps) {
  const errorId = `${name}-error`
  const inputId = `field-${name}`

  const baseClasses =
    'w-full rounded-lg border bg-white px-4 py-3 text-sm text-sgs-text-primary placeholder-sgs-text-tertiary transition-colors focus:outline-none focus:ring-2 focus:ring-sgs-accent focus:border-sgs-accent'
  const errorClasses = error
    ? 'border-sgs-danger focus:ring-sgs-danger focus:border-sgs-danger'
    : 'border-sgs-border hover:border-sgs-accent-light'

  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          maxLength={maxLength}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`${baseClasses} ${errorClasses} resize-y min-h-[100px]`}
        />
      )
    }

    if (type === 'select') {
      return (
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`${baseClasses} ${errorClasses} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10`}
        >
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )
    }

    return (
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`${baseClasses} ${errorClasses}`}
      />
    )
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-sgs-text-primary">
        {label}
        {required && <span className="ml-1 text-sgs-danger">*</span>}
      </label>
      {renderInput()}
      {error && (
        <p id={errorId} role="alert" className="text-sm text-sgs-danger">
          {error}
        </p>
      )}
    </div>
  )
}
