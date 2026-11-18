"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatCurrency, SUPPORTED_CURRENCIES } from "@/lib/demo-data";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useDefaultCurrency } from "@/lib/store";

interface SavingsPlannerProps {
  initialCurrency?: string;
  className?: string;
}

export function SavingsPlanner({
  initialCurrency,
  className = "",
}: SavingsPlannerProps) {
  const { defaultCurrency } = useDefaultCurrency();
  const [goalType, setGoalType] = useState<"group" | "personal">("group");
  const [currency, setCurrency] = useState<string>(initialCurrency || defaultCurrency || "NGN");
  const [prevInitialCurrency, setPrevInitialCurrency] = useState<string | undefined>(initialCurrency);
  const [targetAmount, setTargetAmount] = useState<number>(() =>
    (initialCurrency || defaultCurrency || "NGN") === "NGN" ? 1200000 : 3000
  );
  const [membersCount, setMembersCount] = useState<number>(6);
  const [durationMonths, setDurationMonths] = useState<number>(6);
  const [frequency, setFrequency] = useState<"monthly" | "biweekly" | "weekly">("monthly");

  if (initialCurrency && initialCurrency !== prevInitialCurrency) {
    setPrevInitialCurrency(initialCurrency);
    setCurrency(initialCurrency);
  }

  const cyclesPerMonth = frequency === "weekly" ? 4 : frequency === "biweekly" ? 2 : 1;
  const totalCycles = durationMonths * cyclesPerMonth;

  // Calculation for personal vs group
  const calculation = useMemo(() => {
    const people = goalType === "group" ? Math.max(1, membersCount) : 1;
    const cycles = Math.max(1, totalCycles);

    if (goalType === "group") {
      const amountPerPersonPerCycle = Math.round(targetAmount / (people * cycles));
      const poolCollectedPerCycle = amountPerPersonPerCycle * people;
      const totalPerPerson = amountPerPersonPerCycle * cycles;

      return {
        amountPerPersonPerCycle,
        poolCollectedPerCycle,
        totalPerPerson,
        people,
        cycles,
      };
    } else {
      const amountPerCycle = Math.round(targetAmount / cycles);
      return {
        amountPerPersonPerCycle: amountPerCycle,
        poolCollectedPerCycle: amountPerCycle,
        totalPerPerson: targetAmount,
        people: 1,
        cycles,
      };
    }
  }, [goalType, targetAmount, membersCount, totalCycles]);

  function handleCurrencyChange(newCurr: string) {
    setCurrency(newCurr);
    if (newCurr === "NGN" && targetAmount < 50000) {
      setTargetAmount(1200000);
    } else if (newCurr !== "NGN" && targetAmount > 50000) {
      setTargetAmount(3000);
    }
  }

  const createSpaceUrl = `/app/spaces/new?type=${
    goalType === "group" ? "community" : "personal"
  }&target=${targetAmount}&currency=${currency}&name=${encodeURIComponent(
    goalType === "group" ? "Group Circle" : "Savings Goal"
  )}`;

  return (
    <div
      className={`rounded-2xl border border-[#CBD5E0] bg-[#FEFEFE] p-6 sm:p-8 shadow-sm ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#E2E8F0]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#061E47] tracking-normal">
            Savings and Ajo Planner
          </h2>
          <p className="text-sm text-[#4A5568] mt-1 leading-relaxed">
            Simulate group contribution quotas, individual targets, and timeline pacing.
          </p>
        </div>

        {/* Currency Switcher: Naira first, Dollar second, then Pound, Euro */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F7F9FC] border border-[#E2E8F0] rounded-lg self-start sm:self-auto">
          {SUPPORTED_CURRENCIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => handleCurrencyChange(c.code)}
              className={[
                "px-2.5 py-1 text-xs font-semibold rounded-md transition-colors",
                currency === c.code
                  ? "bg-[#1F4591] text-white shadow-xs"
                  : "text-[#4A5568] hover:text-[#061E47]",
              ].join(" ")}
            >
              {c.code}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Mode Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#718096] block mb-2">
              Savings Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGoalType("group")}
                className={[
                  "p-3.5 rounded-xl border text-left transition-all",
                  goalType === "group"
                    ? "border-[#2B6AD0] bg-[#EBF2FC]/60 ring-2 ring-[#2B6AD0]/20"
                    : "border-[#CBD5E0] hover:border-[#68A4F1] bg-white",
                ].join(" ")}
              >
                <div className="font-semibold text-sm text-[#061E47]">Group / Ajo</div>
                <div className="text-xs text-[#718096] mt-0.5">Family, friends, or rotation</div>
              </button>

              <button
                type="button"
                onClick={() => setGoalType("personal")}
                className={[
                  "p-3.5 rounded-xl border text-left transition-all",
                  goalType === "personal"
                    ? "border-[#2B6AD0] bg-[#EBF2FC]/60 ring-2 ring-[#2B6AD0]/20"
                    : "border-[#CBD5E0] hover:border-[#68A4F1] bg-white",
                ].join(" ")}
              >
                <div className="font-semibold text-sm text-[#061E47]">Personal Goal</div>
                <div className="text-xs text-[#718096] mt-0.5">Save on your own schedule</div>
              </button>
            </div>
          </div>

          {/* Target Amount */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="target-input" className="text-xs font-bold uppercase tracking-wider text-[#718096]">
                Target Amount ({currency})
              </label>
              <span className="text-base font-bold text-[#061E47]">
                {formatCurrency(targetAmount, currency)}
              </span>
            </div>
            <input
              id="target-input"
              type="number"
              min="100"
              step="100"
              value={targetAmount}
              onChange={(e) => setTargetAmount(Math.max(1, Number(e.target.value)))}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E0] text-[#061E47] text-sm focus:outline-none focus:ring-2 focus:ring-[#2B6AD0]"
            />
          </div>

          {/* Members count (Group only) */}
          {goalType === "group" && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="members-range" className="text-xs font-bold uppercase tracking-wider text-[#718096]">
                  Members in Circle
                </label>
                <span className="text-sm font-bold text-[#061E47]">
                  {membersCount} {membersCount === 1 ? "person" : "people"}
                </span>
              </div>
              <input
                id="members-range"
                type="range"
                min="2"
                max="20"
                value={membersCount}
                onChange={(e) => setMembersCount(Number(e.target.value))}
                className="w-full accent-[#2B6AD0]"
              />
              <div className="flex justify-between text-[11px] text-[#A0AEC0] mt-1">
                <span>2 people</span>
                <span>10 people</span>
                <span>20 people</span>
              </div>
            </div>
          )}

          {/* Timeline & Frequency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="duration-select" className="text-xs font-bold uppercase tracking-wider text-[#718096] block mb-1.5">
                Duration
              </label>
              <select
                id="duration-select"
                value={durationMonths}
                onChange={(e) => setDurationMonths(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E0] text-sm text-[#061E47] bg-white focus:outline-none focus:ring-2 focus:ring-[#2B6AD0]"
              >
                <option value={3}>3 months</option>
                <option value={6}>6 months</option>
                <option value={10}>10 months</option>
                <option value={12}>12 months (1 yr)</option>
                <option value={24}>24 months (2 yrs)</option>
              </select>
            </div>

            <div>
              <label htmlFor="freq-select" className="text-xs font-bold uppercase tracking-wider text-[#718096] block mb-1.5">
                Cycle Frequency
              </label>
              <select
                id="freq-select"
                value={frequency}
                onChange={(e) =>
                  setFrequency(
                    e.target.value as "monthly" | "biweekly" | "weekly"
                  )
                }
                className="w-full px-3 py-2 rounded-lg border border-[#CBD5E0] text-sm text-[#061E47] bg-white focus:outline-none focus:ring-2 focus:ring-[#2B6AD0]"
              >
                <option value="monthly">Monthly</option>
                <option value="biweekly">Bi-weekly (Every 2 wks)</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-[#F7F9FC] border border-[#E2E8F0] rounded-xl p-6">
          <div>
            <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
              {goalType === "group" ? "Plan Breakdown" : "Your Monthly Target"}
            </span>

            <div className="mt-3">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#061E47] tracking-tight">
                {formatCurrency(calculation.amountPerPersonPerCycle, currency)}
              </div>
              <p className="text-xs text-[#718096] mt-1 font-medium">
                {goalType === "group"
                  ? `per member / ${frequency === "monthly" ? "month" : frequency === "biweekly" ? "2 weeks" : "week"}`
                  : `required each ${frequency === "monthly" ? "month" : frequency === "biweekly" ? "two weeks" : "week"}`}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-[#E2E8F0] flex flex-col gap-3.5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[#4A5568]">Total group pool:</span>
                <span className="font-semibold text-[#061E47]">
                  {formatCurrency(targetAmount, currency)}
                </span>
              </div>

              {goalType === "group" && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-[#4A5568]">Pool collected each cycle:</span>
                    <span className="font-semibold text-[#061E47]">
                      {formatCurrency(calculation.poolCollectedPerCycle, currency)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#4A5568]">Total cycles:</span>
                    <span className="font-semibold text-[#061E47]">
                      {calculation.cycles} cycles ({durationMonths} months)
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#4A5568]">Each member&apos;s total input:</span>
                    <span className="font-semibold text-[#061E47]">
                      {formatCurrency(calculation.totalPerPerson, currency)}
                    </span>
                  </div>
                </>
              )}

              {goalType === "personal" && (
                <div className="flex justify-between items-center">
                  <span className="text-[#4A5568]">Total payments over {durationMonths} months:</span>
                  <span className="font-semibold text-[#061E47]">
                    {calculation.cycles} deposits
                  </span>
                </div>
              )}
            </div>

            {/* Projection visual */}
            <div className="mt-6">
              <div className="flex justify-between text-xs text-[#718096] mb-1">
                <span>Progress projection</span>
                <span>100% at month {durationMonths}</span>
              </div>
              <ProgressBar
                value={100}
                showLabel={false}
                size="sm"
                ariaLabel={`Projection: 100% of ${formatCurrency(targetAmount, currency)} achieved in ${durationMonths} months`}
              />
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#E2E8F0]">
            <Link
              href={createSpaceUrl}
              className="w-full inline-flex items-center justify-center gap-2 h-12 px-5 rounded-lg bg-[#2B6AD0] text-white font-medium hover:bg-[#1F4591] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B6AD0]"
            >
              Create space with this plan →
            </Link>
            <p className="text-[11px] text-[#A0AEC0] text-center mt-2">
              Sets up a space with these amounts, cycles, and currency automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
