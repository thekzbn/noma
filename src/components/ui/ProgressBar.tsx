interface ProgressBarProps {
  value: number; // 0–100
  label?: string;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function ProgressBar({
  value,
  label,
  showLabel = true,
  size = "md",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const height = size === "sm" ? "h-1.5" : "h-2.5";

  return (
    <div>
      {(label || showLabel) && (
        <div className="flex justify-between text-xs text-[#4A5568] mb-1.5">
          {label && <span>{label}</span>}
          {showLabel && <span>{clamped}%</span>}
        </div>
      )}
      <div
        className={`w-full ${height} bg-[#E2E8F0] rounded-full overflow-hidden`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`${height} rounded-full transition-all duration-500`}
          style={{
            width: `${clamped}%`,
            backgroundColor:
              clamped >= 100
                ? "#3CB371"
                : clamped >= 75
                ? "#2B6AD0"
                : "#68A4F1",
          }}
        />
      </div>
    </div>
  );
}
