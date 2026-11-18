"use client";

import { useDefaultCurrency, useToasts } from "@/lib/store";
import { SUPPORTED_CURRENCIES } from "@/lib/demo-data";

interface CurrencySelectorProps {
  compact?: boolean;
  className?: string;
}

export function CurrencySelector({
  compact = false,
  className = "",
}: CurrencySelectorProps) {
  const { defaultCurrency, setDefaultCurrency } = useDefaultCurrency();
  const { showToast } = useToasts();

  function handleChange(code: string) {
    if (code === defaultCurrency) return;
    setDefaultCurrency(code);
    const item = SUPPORTED_CURRENCIES.find((c) => c.code === code);
    showToast(`Default currency changed to ${item?.name || code} (${item?.symbol || code}).`, "info");
  }

  if (compact) {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <label htmlFor="currency-select-compact" className="sr-only">
          Select currency
        </label>
        <select
          id="currency-select-compact"
          value={defaultCurrency}
          onChange={(e) => handleChange(e.target.value)}
          className="appearance-none bg-[#F7F9FC] border border-[#CBD5E0] text-[#061E47] text-xs font-semibold rounded-lg pl-2.5 pr-7 py-1.5 cursor-pointer hover:border-[#68A4F1] focus:outline-none focus:ring-2 focus:ring-[#2B6AD0] transition-colors"
          aria-label="Default currency"
        >
          {SUPPORTED_CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.symbol} {c.code}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 text-[#718096] text-[10px]" aria-hidden="true">
          ▼
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {SUPPORTED_CURRENCIES.map((c) => {
          const isSelected = defaultCurrency === c.code;
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => handleChange(c.code)}
              className={[
                "flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0]",
                isSelected
                  ? "border-[#2B6AD0] bg-[#EBF2FC] text-[#1F4591] ring-1 ring-[#2B6AD0]"
                  : "border-[#CBD5E0] bg-white text-[#4A5568] hover:border-[#68A4F1]",
              ].join(" ")}
            >
              <span className="w-7 h-7 rounded-md bg-white border border-[#CBD5E0] font-bold text-sm flex items-center justify-center shrink-0">
                {c.symbol}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[#061E47] leading-tight">
                  {c.code}
                </div>
                <div className="text-[11px] text-[#718096] truncate mt-0.5">
                  {c.name}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
