"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSpaces, useApp } from "@/lib/store";
import { formatCurrency, type Transaction } from "@/lib/demo-data";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type Step = "amount" | "review" | "processing" | "confirmed" | "failed";

export default function ContributePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { spaces, updateSpace } = useSpaces();
  const { showToast } = useApp();

  const space = spaces.find((s) => s.id === id);

  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [method, setMethod] = useState<"bank" | "card">("bank");
  const [reference, setReference] = useState("");

  if (!space) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto py-16 text-center">
          <p className="text-[#061E47] mb-4">Space not found.</p>
          <Link
            href="/app"
            className="text-[#2B6AD0] hover:underline text-sm font-medium"
          >
            Back to spaces
          </Link>
        </div>
      </AppShell>
    );
  }

  const currentSpace = space;
  const remaining = currentSpace.targetAmount - currentSpace.savedAmount;
  const parsedAmount = parseFloat(amount);

  function validateAmount(): boolean {
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setAmountError(
        `Enter an amount greater than ${formatCurrency(0, currentSpace.currency)}.`
      );
      return false;
    }
    if (parsedAmount > remaining + 0.001) {
      setAmountError(
        `The most you can contribute right now is ${formatCurrency(
          remaining,
          currentSpace.currency
        )}.`
      );
      return false;
    }
    setAmountError("");
    return true;
  }

  function handleAmountSubmit() {
    if (!validateAmount()) return;
    setStep("review");
  }

  function handleConfirm() {
    setStep("processing");
    setTimeout(() => {
      const ref =
        "NMA-" + Math.random().toString(36).slice(2, 9).toUpperCase();
      setReference(ref);

      const newTransaction: Transaction = {
        id: "txn-" + Date.now(),
        type: "contribution",
        amount: parsedAmount,
        currency: currentSpace.currency,
        date: new Date().toISOString().slice(0, 10),
        note: "Direct contribution (demo)",
        status: "completed",
        memberName: "You",
        reference: ref,
      };

      updateSpace({
        ...currentSpace,
        savedAmount: currentSpace.savedAmount + parsedAmount,
        transactions: [...currentSpace.transactions, newTransaction],
      });

      showToast(
        `${formatCurrency(parsedAmount, currentSpace.currency)} added to ${currentSpace.name}.`,
        "success"
      );
      setStep("confirmed");
    }, 1200);
  }

  return (
    <AppShell>
      <div className="max-w-lg mx-auto py-6">
        {/* Back link */}
        {(step === "amount" || step === "review") && (
          <Link
            href={`/app/spaces/${id}`}
            className="text-sm font-medium text-[#2B6AD0] hover:text-[#1F4591] mb-6 inline-flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded"
          >
            ← {space.name}
          </Link>
        )}

        {/* STEP: Amount */}
        {step === "amount" && (
          <div>
            <h1 className="text-2xl font-bold text-[#061E47] tracking-tight mb-1.5">
              Add to {space.name}
            </h1>
            <p className="text-sm text-[#4A5568] mb-8">
              {formatCurrency(space.savedAmount, space.currency)} saved of{" "}
              {formatCurrency(space.targetAmount, space.currency)}
            </p>

            <div className="mb-6">
              <Input
                label={`Amount (${space.currency})`}
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setAmountError("");
                }}
                error={amountError}
                hint={
                  remaining > 0
                    ? `Up to ${formatCurrency(remaining, space.currency)} remaining to goal`
                    : "Goal already reached."
                }
              />
            </div>

            <fieldset className="mb-8 border-none p-0">
              <legend className="text-sm font-medium text-[#061E47] mb-3">
                Payment method
              </legend>
              <div className="flex flex-col gap-3">
                {(["bank", "card"] as const).map((m) => (
                  <label
                    key={m}
                    className={[
                      "flex items-center gap-3.5 p-3.5 rounded-lg border cursor-pointer select-none transition-colors",
                      "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#2B6AD0] has-[:focus-visible]:ring-offset-1",
                      method === m
                        ? "border-[#2B6AD0] bg-[#EBF2FC]"
                        : "border-[#CBD5E0] hover:border-[#68A4F1] bg-white",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="method"
                      value={m}
                      checked={method === m}
                      onChange={() => setMethod(m)}
                      className="accent-[#2B6AD0] h-4 w-4"
                    />
                    <span className="text-sm font-medium text-[#061E47]">
                      {m === "bank" ? "Bank transfer" : "Debit or credit card"}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleAmountSubmit}
            >
              Review contribution
            </Button>
          </div>
        )}

        {/* STEP: Review */}
        {step === "review" && (
          <div>
            <h1 className="text-2xl font-bold text-[#061E47] tracking-tight mb-6">
              Review contribution
            </h1>

            <dl className="divide-y divide-[#E2E8F0] mb-8">
              {[
                ["Space", space.name],
                ["Amount", formatCurrency(parsedAmount, space.currency)],
                [
                  "Method",
                  method === "bank" ? "Bank transfer" : "Debit or credit card",
                ],
                ["Transaction fee", formatCurrency(0, space.currency)],
              ].map(([lbl, val]) => (
                <div
                  key={lbl}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <dt className="text-[#4A5568]">{lbl}</dt>
                  <dd className="font-semibold text-[#061E47]">{val}</dd>
                </div>
              ))}
            </dl>

            <p className="text-xs text-[#856404] bg-[#FFF8E6] border border-[#F6D860] rounded-lg px-3 py-2 mb-8 leading-relaxed">
              Demo only — no real payment will be made. This records a simulated contribution.
            </p>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep("amount")}>
                Back
              </Button>
              <Button variant="primary" fullWidth onClick={handleConfirm}>
                Record simulated contribution
              </Button>
            </div>
          </div>
        )}

        {/* STEP: Processing */}
        {step === "processing" && (
          <div className="text-center py-16" role="status" aria-live="polite">
            <div className="w-10 h-10 border-4 border-[#E2E8F0] border-t-[#2B6AD0] rounded-full animate-spin mx-auto mb-6" aria-hidden="true" />
            <p className="text-base font-semibold text-[#061E47]">
              Processing contribution
            </p>
          </div>
        )}

        {/* STEP: Confirmed */}
        {step === "confirmed" && (
          <div className="py-8" role="status" aria-live="polite">
            <div
              className="w-12 h-12 rounded-full bg-[#E8F5EE] text-[#1E7A45] flex items-center justify-center font-bold text-xl mb-6"
              aria-hidden="true"
            >
              ✓
            </div>
            <h1 className="text-2xl font-bold text-[#061E47] tracking-tight mb-2">
              Contribution recorded
            </h1>
            <p className="text-sm text-[#4A5568] mb-1">
              {formatCurrency(parsedAmount, space.currency)} has been credited to{" "}
              {space.name} in this demo session.
            </p>
            <p className="text-xs text-[#718096] mb-8">
              In production, this would trigger a real payment.
            </p>

            <dl className="divide-y divide-[#E2E8F0] mb-8">
              {[
                ["Reference", reference],
                ["Amount", formatCurrency(parsedAmount, space.currency)],
                ["Space", space.name],
              ].map(([lbl, val]) => (
                <div
                  key={lbl}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <dt className="text-[#4A5568]">{lbl}</dt>
                  <dd className="font-mono text-xs text-[#061E47]">{val}</dd>
                </div>
              ))}
            </dl>

            <Button
              variant="primary"
              onClick={() => router.push(`/app/spaces/${id}`)}
            >
              Back to space
            </Button>
          </div>
        )}

        {/* STEP: Failed */}
        {step === "failed" && (
          <div className="py-8" role="alert">
            <div
              className="w-12 h-12 rounded-full bg-[#FFECE8] text-[#C0392B] flex items-center justify-center font-bold text-xl mb-6"
              aria-hidden="true"
            >
              ✕
            </div>
            <h1 className="text-2xl font-bold text-[#061E47] tracking-tight mb-2">
              Payment unsuccessful
            </h1>
            <p className="text-sm text-[#4A5568] mb-8 leading-relaxed">
              Your payment could not be processed. No money has been deducted.
              Please try again or use a different payment method.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep("review")}>
                Try again
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push(`/app/spaces/${id}`)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
