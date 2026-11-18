"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSpaces, useApp, useAuth } from "@/lib/store";
import { formatCurrency, type PayoutRequest } from "@/lib/demo-data";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type Step = "form" | "review" | "processing" | "pending" | "confirmed";

export default function PayoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { spaces, updateSpace } = useSpaces();
  const { showToast } = useApp();
  const { user } = useAuth();

  const space = spaces.find((s) => s.id === id);

  const [step, setStep] = useState<Step>("form");
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

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
  const parsedAmount = parseFloat(amount);
  const needsApproval =
    currentSpace.type === "community" ||
    currentSpace.type === "shared" ||
    (currentSpace.governanceThreshold ?? 0) > 1;

  // Subtract pending payouts to calculate available balance
  const pendingPayoutsTotal = currentSpace.payoutRequests
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);
  const availableBalance = Math.max(0, currentSpace.savedAmount - pendingPayoutsTotal);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      e.amount = `Enter an amount greater than ${formatCurrency(0, currentSpace.currency)}.`;
    } else if (parsedAmount > availableBalance + 0.001) {
      e.amount = `Available balance for withdrawal is ${formatCurrency(
        availableBalance,
        currentSpace.currency
      )}.`;
    }
    if (!destination.trim()) e.destination = "Enter a destination account or recipient name.";
    if (!reason.trim()) e.reason = "Explain why you are requesting this payout.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    setStep("review");
  }

  function handleConfirm() {
    setStep("processing");
    setTimeout(() => {
      const requesterName = user?.name || "You";
      const newPayout: PayoutRequest = {
        id: "payout-" + Date.now(),
        requestedBy: requesterName,
        requestedAt: new Date().toISOString().slice(0, 10),
        amount: parsedAmount,
        currency: currentSpace.currency,
        destination,
        reason,
        status: needsApproval ? "pending" : "approved",
        approvalsRequired: needsApproval ? (currentSpace.governanceThreshold ?? 2) : 0,
        approvalsReceived: needsApproval ? [requesterName] : [],
      };

      updateSpace({
        ...currentSpace,
        savedAmount: needsApproval
          ? currentSpace.savedAmount
          : currentSpace.savedAmount - parsedAmount,
        payoutRequests: [...currentSpace.payoutRequests, newPayout],
      });

      showToast(
        needsApproval
          ? "Payout request submitted for approval."
          : `${formatCurrency(parsedAmount, currentSpace.currency)} payout confirmed.`,
        "success"
      );

      setStep(needsApproval ? "pending" : "confirmed");
    }, 1200);
  }

  return (
    <AppShell>
      <div className="max-w-lg mx-auto py-6">
        {(step === "form" || step === "review") && (
          <Link
            href={`/app/spaces/${id}`}
            className="text-sm font-medium text-[#2B6AD0] hover:text-[#1F4591] mb-6 inline-flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded"
          >
            ← {space.name}
          </Link>
        )}

        {/* STEP: Form */}
        {step === "form" && (
          <div>
            <h1 className="text-2xl font-bold text-[#061E47] tracking-tight mb-1.5">
              Request a payout
            </h1>
            <p className="text-sm text-[#4A5568] mb-1">
              Available balance: {formatCurrency(availableBalance, space.currency)}
            </p>
            {pendingPayoutsTotal > 0 && (
              <p className="text-xs text-[#718096] mb-3">
                ({formatCurrency(pendingPayoutsTotal, space.currency)} currently reserved in pending payout requests)
              </p>
            )}
            {needsApproval && (
              <p className="text-xs text-[#1F4591] bg-[#EBF2FC] p-3 rounded-lg mb-6">
                This space requires {space.governanceThreshold ?? 2} member approvals before a payout is released.
              </p>
            )}
            {!needsApproval && <div className="mb-6" />}

            <div className="flex flex-col gap-5 mb-8">
              <Input
                label={`Amount (${space.currency})`}
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrors((prev) => ({ ...prev, amount: "" }));
                }}
                error={errors.amount}
              />
              <Input
                label="Destination"
                type="text"
                placeholder="Bank account name and reference"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  setErrors((prev) => ({ ...prev, destination: "" }));
                }}
                error={errors.destination}
                hint="Where the funds should be sent upon release"
              />
              <Input
                label="Reason"
                type="text"
                placeholder="Why are you requesting this payout?"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setErrors((prev) => ({ ...prev, reason: "" }));
                }}
                error={errors.reason}
              />
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleSubmit}
            >
              Review request
            </Button>
          </div>
        )}

        {/* STEP: Review */}
        {step === "review" && (
          <div>
            <h1 className="text-2xl font-bold text-[#061E47] tracking-tight mb-6">
              Review payout request
            </h1>

            <dl className="divide-y divide-[#E2E8F0] mb-8">
              {[
                ["Space", space.name],
                ["Amount", formatCurrency(parsedAmount, space.currency)],
                ["Destination", destination],
                ["Reason", reason],
                [
                  "Approvals needed",
                  needsApproval
                    ? `${space.governanceThreshold ?? 2} members`
                    : "None (direct release)",
                ],
              ].map(([lbl, val]) => (
                <div
                  key={lbl}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <dt className="text-[#4A5568]">{lbl}</dt>
                  <dd className="font-semibold text-[#061E47] text-right max-w-[60%]">
                    {val}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="text-xs text-[#718096] mb-8 leading-relaxed">
              Payouts are disbursed strictly according to the governance rules established for this space.
            </p>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep("form")}>
                Back
              </Button>
              <Button variant="primary" fullWidth onClick={handleConfirm}>
                Submit request
              </Button>
            </div>
          </div>
        )}

        {/* STEP: Processing */}
        {step === "processing" && (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-[#E2E8F0] border-t-[#2B6AD0] rounded-full animate-spin mx-auto mb-6" />
            <p className="text-base font-semibold text-[#061E47]">
              Submitting payout request
            </p>
          </div>
        )}

        {/* STEP: Pending */}
        {step === "pending" && (
          <div className="py-8">
            <div className="w-12 h-12 rounded-full bg-[#FFF8E6] text-[#856404] flex items-center justify-center font-bold text-xl mb-6">
              ⏱
            </div>
            <h1 className="text-2xl font-bold text-[#061E47] tracking-tight mb-2">
              Request submitted
            </h1>
            <p className="text-sm text-[#4A5568] mb-4 leading-relaxed">
              Your payout request for {formatCurrency(parsedAmount, space.currency)} is waiting for{" "}
              {space.governanceThreshold ?? 2} member approvals. It will be recorded in the space activity once approved.
            </p>
            <p className="text-xs text-[#718096] mb-8">
              Members with approval permissions have been notified to review this request.
            </p>
            <Button
              variant="primary"
              onClick={() => router.push(`/app/spaces/${id}`)}
            >
              Back to space
            </Button>
          </div>
        )}

        {/* STEP: Confirmed */}
        {step === "confirmed" && (
          <div className="py-8">
            <div className="w-12 h-12 rounded-full bg-[#E8F5EE] text-[#2D7D4E] flex items-center justify-center font-bold text-xl mb-6">
              ✓
            </div>
            <h1 className="text-2xl font-bold text-[#061E47] tracking-tight mb-2">
              Payout confirmed
            </h1>
            <p className="text-sm text-[#4A5568] mb-8 leading-relaxed">
              {formatCurrency(parsedAmount, space.currency)} will be sent to {destination}.
            </p>
            <Button
              variant="primary"
              onClick={() => router.push(`/app/spaces/${id}`)}
            >
              Back to space
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
