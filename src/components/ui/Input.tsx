import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id, className = "", ...props },
  ref
) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-[#061E47]"
      >
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        {...props}
        className={[
          "w-full px-3.5 py-2.5 rounded-lg border text-[#061E47] bg-white",
          "placeholder:text-[#718096] text-sm",
          "transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-[#2B6AD0] focus:border-[#2B6AD0]",
          error
            ? "border-[#FF6347]"
            : "border-[#CBD5E0] hover:border-[#68A4F1]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />
      {hint && !error && (
        <p className="text-xs text-[#718096]">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-[#FF6347]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, hint, id, className = "", ...props }, ref) {
    const textareaId = id || label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={textareaId}
          className="text-sm font-medium text-[#061E47]"
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          rows={4}
          {...props}
          className={[
            "w-full px-3.5 py-2.5 rounded-lg border text-[#061E47] bg-white",
            "placeholder:text-[#718096] text-sm resize-none",
            "transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-[#2B6AD0] focus:border-[#2B6AD0]",
            error
              ? "border-[#FF6347]"
              : "border-[#CBD5E0] hover:border-[#68A4F1]",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        />
        {hint && !error && (
          <p className="text-xs text-[#718096]">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-[#FF6347]" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { label, error, hint, id, options, className = "", ...props },
    ref
  ) {
    const selectId = id || label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-[#061E47]"
        >
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          {...props}
          className={[
            "w-full px-3.5 py-2.5 rounded-lg border text-[#061E47] bg-white",
            "text-sm appearance-none cursor-pointer",
            "transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-[#2B6AD0] focus:border-[#2B6AD0]",
            error
              ? "border-[#FF6347]"
              : "border-[#CBD5E0] hover:border-[#68A4F1]",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {hint && !error && (
          <p className="text-xs text-[#718096]">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-[#FF6347]" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
