"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { DEMO_CAMPAIGN, formatCurrency, type DonorEntry } from "@/lib/demo-data";
import { PublicNav } from "@/components/layout/PublicNav";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type Step =
  | "amount"
  | "identity"
  | "payment"
  | "review"
  | "processing"
  | "confirmed"
  | "pending"
  | "failed";

export default function CampaignContributePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { state, updateSpace } = useApp();

  const space =
    state.spaces.find((s) => s.id === id) ??
    (id === DEMO_CAMPAIGN.id ? DEMO_CAMPAIGN : null);

  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [identity, setIdentity] = useState<"anonymous" | "named">("anonymous");
  const [displayName, setDisplayName] = useState("");
  const [nameError, setNameError] = useState("");
  const [contributorEmail, setContributorEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank" | "wallet">("card");
  const [reference, setReference] = useState("");

  if (!space || space.type !== "campaign") {
    return (
      <div className="flex flex-col min-h-screen bg-[#FEFEFE]">
        <PublicNav />
        <main id="main-content" className="max-w-md mx-auto px-5 py-20 text-center flex-1">
          <h1 className="text-2xl font-semibold text-[#061E47] mb-3">
            Campaign not found
          </h1>
          <Link href="/" className="text-[#2B6AD0] hover:underline text-sm font-medium">
            Back to home
          </Link>
        </main>
      </div>
    );
  }

  const currentSpace = space;
  const parsedAmount = parseFloat(amount);
  const quickAmounts = currentSpace.currency === "NGN" ? [5000, 10000, 25000, 50000] : [10, 25, 50, 100];

  function validateAmount(): boolean {
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setAmountError(`Enter an amount greater than ${formatCurrency(0, currentSpace.currency)}.`);
      return false;
    }
    setAmountError("");
    return true;
  }

  function validateIdentity(): boolean {
    if (identity === "named" && !displayName.trim()) {
      setNameError("Enter the name you would like to display.");
      return false;
    }
    setNameError("");
    return true;
  }

  function simulatePayment() {
    setStep("processing");
    setTimeout(() => {
      const ref = "NMA-CAM-" + Math.random().toString(36).slice(2, 9).toUpperCase();
      setReference(ref);

      const chosenName = identity === "anonymous" ? "Anonymous" : displayName.trim();
      const newDonor: DonorEntry = {
        id: "donor-" + Date.now(),
        displayName: chosenName,
        amount: parsedAmount,
        currency: currentSpace.currency,
        date: new Date().toISOString().slice(0, 10),
        status: "completed",
      };

      const updated = {
        ...currentSpace,
        savedAmount: currentSpace.savedAmount + parsedAmount,
        donors: [...(currentSpace.donors ?? []), newDonor],
      };
      updateSpace(updated);

      setStep("confirmed");
    }, 1200);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FEFEFE]">
      <div
        className="bg-[#FFF8E6] border-b border-[#F6D860] text-[#856404] text-xs text-center py-2 px-4"
        role="status"
      >
        Prototype simulation — no payment card will be charged.
      </div>
      <PublicNav />
      <main id="main-content" className="max-w-lg mx-auto px-5 py-12 flex-1 w-full">
        {/* Back Link */}
        {(step === "amount" || step === "identity" || step === "payment" || step === "review") && (
          <Link
            href={`/campaign/${id}`}
            className="text-sm font-medium text-[#2B6AD0] hover:text-[#1F4591] mb-6 inline-flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded"
          >
            ← {space.name}
          </Link>
        )}

        {/* STEP 1: Amount */}
        {step === "amount" && (
          <div>
            <h1 className="text-2xl font-bold text-[#061E47] tracking-tight mb-2">
              Contribute to {space.name}
            </h1>
            <p className="text-sm text-[#4A5568] mb-8 leading-relaxed">
              Every contribution directly supports {space.beneficiary || space.name}.
            </p>

            <div className="mb-4">
              <Input
                label={`Contribution amount (${space.currency})`}
                type="number"
                min="1"
                step="any"
                placeholder="0"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setAmountError("");
                }}
                error={amountError}
              />
            </div>

            <div className="flex gap-2 flex-wrap mb-8">
              {quickAmounts.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    setAmount(String(n));
                    setAmountError("");
                  }}
                  className={[
                    "px-4 py-2 rounded-full border text-sm font-medium cursor-pointer transition-colors",
                    parseFloat(amount) === n
                      ? "border-[#2B6AD0] bg-[#EBF2FC] text-[#1F4591]"
                      : "border-[#CBD5E0] bg-white text-[#4A5568] hover:border-[#68A4F1]",
                  ].join(" ")}
                >
                  {formatCurrency(n, space.currency)}
                </button>
              ))}
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => {
                if (validateAmount()) setStep("identity");
              }}
            >
              Continue
            </Button>
          </div>
        )}

        {/* STEP 2: Identity */}
        {step === "identity" && (
          <div>
            <h1 className="text-2xl font-bold text-[#061E47] tracking-tight mb-2">
              Public attribution
            </h1>
            <p className="text-sm text-[#4A5568] mb-8">
              Your contribution of {formatCurrency(parsedAmount, space.currency)} will be recorded in the campaign ledger.
            </p>

            <div className="flex flex-col gap-3 mb-6">
              {(["anonymous", "named"] as const).map((opt) => (
                <label
                  key={opt}
                  className={[
                    "flex items-start gap-3.5 p-3.5 rounded-lg border cursor-pointer select-none transition-colors",
                    "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#2B6AD0] has-[:focus-visible]:ring-offset-1",
                    identity === opt
                      ? "border-[#2B6AD0] bg-[#EBF2FC]"
                      : "border-[#CBD5E0] hover:border-[#68A4F1] bg-white",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="identity"
                    value={opt}
                    checked={identity === opt}
                    onChange={() => {
                      setIdentity(opt);
                      setNameError("");
                    }}
                    className="accent-[#2B6AD0] mt-1 h-4 w-4"
                  />
                  <div>
                    <div className="text-sm font-medium text-[#061E47]">
                      {opt === "anonymous" ? "Show as Anonymous" : "Show my name"}
                    </div>
                    <div className="text-xs text-[#718096] mt-0.5">
                      {opt === "anonymous"
                        ? "Your contribution appears publicly as Anonymous."
                        : "Your name will be shown publicly in the donor ledger."}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {identity === "named" && (
              <div className="mb-6">
                <Input
                  label="Name to display"
                  type="text"
                  placeholder="Your full name"
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    setNameError("");
                  }}
                  error={nameError}
                />
              </div>
            )}

            <div className="mb-8">
              <Input
                label="Email address for receipt (optional)"
                type="email"
                placeholder="you@example.com"
                value={contributorEmail}
                onChange={(e) => setContributorEmail(e.target.value)}
                hint="We will record a mock digital receipt."
              />
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep("amount")}>
                Back
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  if (validateIdentity()) setStep("payment");
                }}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Payment Method Selection */}
        {step === "payment" && (
          <div>
            <h1 className="text-2xl font-bold text-[#061E47] tracking-tight mb-2">
              Select payment method
            </h1>
            <p className="text-sm text-[#4A5568] mb-8">
              Choose how you want to simulate this contribution.
            </p>

            <fieldset className="mb-8 border-none p-0">
              <legend className="sr-only">Choose payment method</legend>
              <div className="flex flex-col gap-3">
                {[
                  {
                    id: "card",
                    title: "Debit or credit card",
                    desc: "Visa, Mastercard, Verve",
                  },
                  {
                    id: "bank",
                    title: "Instant bank transfer",
                    desc: "Simulated direct bank transfer",
                  },
                  {
                    id: "wallet",
                    title: "Apple Pay or Google Pay",
                    desc: "Simulated mobile wallet",
                  },
                ].map((m) => (
                  <label
                    key={m.id}
                    className={[
                      "flex items-start gap-3.5 p-3.5 rounded-lg border cursor-pointer select-none transition-colors",
                      "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#2B6AD0] has-[:focus-visible]:ring-offset-1",
                      paymentMethod === m.id
                        ? "border-[#2B6AD0] bg-[#EBF2FC]"
                        : "border-[#CBD5E0] hover:border-[#68A4F1] bg-white",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={m.id}
                      checked={paymentMethod === m.id}
                      onChange={() => setPaymentMethod(m.id as "card" | "bank" | "wallet")}
                      className="accent-[#2B6AD0] mt-1 h-4 w-4"
                    />
                    <div>
                      <span className="text-sm font-medium text-[#061E47] block">
                        {m.title}
                      </span>
                      <span className="text-xs text-[#718096] mt-0.5 block">
                        {m.desc}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep("identity")}>
                Back
              </Button>
              <Button variant="primary" fullWidth onClick={() => setStep("review")}>
                Review contribution
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Review */}
        {step === "review" && (
          <div>
            <h1 className="text-2xl font-bold text-[#061E47] tracking-tight mb-6">
              Review contribution
            </h1>
            <dl className="divide-y divide-[#E2E8F0] mb-6">
              {[
                ["Campaign", space.name],
                ["Contribution amount", formatCurrency(parsedAmount, space.currency)],
                ["Public identity", identity === "anonymous" ? "Anonymous" : displayName],
                [
                  "Payment method",
                  paymentMethod === "card"
                    ? "Debit or credit card"
                    : paymentMethod === "bank"
                    ? "Instant bank transfer"
                    : "Digital wallet",
                ],
                ["Processing fee", `${formatCurrency(0, space.currency)} (Covered by campaign)`],
              ].map(([lbl, val]) => (
                <div
                  key={lbl}
                  className="flex items-center justify-between py-3.5 text-sm"
                >
                  <dt className="text-[#4A5568]">{lbl}</dt>
                  <dd className="font-semibold text-[#061E47]">{val}</dd>
                </div>
              ))}
            </dl>
            <p className="text-xs text-[#856404] bg-[#FFF8E6] border border-[#F6D860] rounded-lg px-3 py-2 mb-8 leading-relaxed">
              Simulation notice: Clicking below will record this contribution in the demo ledger. No money is moved.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep("payment")}>
                Back
              </Button>
              <Button variant="primary" fullWidth onClick={simulatePayment}>
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
              Recording contribution
            </p>
          </div>
        )}

        {/* STEP: Confirmed */}
        {step === "confirmed" && (
          <div className="py-8" role="status" aria-live="polite">
            <div className="w-12 h-12 rounded-full bg-[#E8F5EE] text-[#1E7A45] flex items-center justify-center font-bold text-xl mb-6" aria-hidden="true">
              ✓
            </div>
            <h1 className="text-2xl font-bold text-[#061E47] tracking-tight mb-2">
              Contribution recorded
            </h1>
            <p className="text-sm text-[#4A5568] mb-8">
              Your contribution of {formatCurrency(parsedAmount, space.currency)} to {space.name} has been recorded in this demo session.
            </p>
            <dl className="divide-y divide-[#E2E8F0] mb-8">
              {[
                ["Reference code", reference],
                ["Public attribution", identity === "anonymous" ? "Anonymous" : displayName],
                ["Total contributed", formatCurrency(parsedAmount, space.currency)],
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
            <div className="flex gap-3 flex-wrap">
              <Link href={`/campaign/${id}`}>
                <Button variant="primary">Return to campaign</Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="secondary">Create a noma. account</Button>
              </Link>
            </div>
          </div>
        )}

        {/* STEP: Failed */}
        {step === "failed" && (
          <div className="py-8" role="alert">
            <div className="w-12 h-12 rounded-full bg-[#FFECE8] text-[#C0392B] flex items-center justify-center font-bold text-xl mb-6" aria-hidden="true">
              ✕
            </div>
            <h1 className="text-2xl font-bold text-[#061E47] tracking-tight mb-2">
              Payment unsuccessful
            </h1>
            <p className="text-sm text-[#4A5568] mb-8 leading-relaxed">
              The payment could not be completed. No money was taken from your account. Please check your payment details and try again.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep("payment")}>
                Try again
              </Button>
              <Link href={`/campaign/${id}`}>
                <Button variant="ghost">Cancel</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
