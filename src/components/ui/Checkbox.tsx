import React, { useId } from "react";

interface CheckboxProps {
  id?: string;
  name?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export function Checkbox({
  id: customId,
  name,
  checked,
  onChange,
  disabled = false,
  label,
  description,
  badge,
  className = "",
}: CheckboxProps) {
  const autoId = useId();
  const id = customId || autoId;

  return (
    <label
      htmlFor={id}
      className={[
        "flex items-start gap-3 select-none transition-colors",
        disabled ? "cursor-default opacity-75" : "cursor-pointer group",
        className,
      ].join(" ")}
    >
      <div className="relative flex items-center justify-center mt-0.5 shrink-0">
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={(e) => {
            if (!disabled) {
              onChange(e.target.checked);
            }
          }}
          disabled={disabled}
          className="peer sr-only"
        />
        <div
          className={[
            "w-5 h-5 rounded-[5px] border flex items-center justify-center transition-all duration-150",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-[#2B6AD0] peer-focus-visible:ring-offset-2",
            disabled && checked
              ? "bg-[#CBD5E0] border-[#CBD5E0] text-[#718096]"
              : disabled
              ? "bg-[#F7F9FC] border-[#CBD5E0]"
              : checked
              ? "bg-[#2B6AD0] border-[#2B6AD0] text-white shadow-sm"
              : "bg-white border-[#CBD5E0] group-hover:border-[#2B6AD0]",
          ].join(" ")}
          aria-hidden="true"
        >
          {checked && (
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3.5 8.5 6.5 11.5 12.5 4.5" />
            </svg>
          )}
        </div>
      </div>

      <div className="min-w-0">
        <div className="text-sm font-medium text-[#061E47] flex items-center gap-2 leading-tight">
          <span>{label}</span>
          {badge}
        </div>
        {description && (
          <p className="text-xs text-[#718096] mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </label>
  );
}
