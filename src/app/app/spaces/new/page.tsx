"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { useApp, generateSpaceId, useAuth } from "@/lib/store";
import type { Space, SpaceType } from "@/lib/demo-data";
import { formatDate } from "@/lib/demo-data";

// ---- Step 1: Type selection ----

const SPACE_TYPES: { value: SpaceType; label: string; desc: string }[] = [
  {
    value: "personal",
    label: "Personal savings",
    desc: "Save towards a goal by yourself, with optional accountability access.",
  },
  {
    value: "shared",
    label: "Shared savings",
    desc: "Save together with family, friends, or colleagues towards a common goal.",
  },
  {
    value: "community",
    label: "Community savings (Ajo / Esusu)",
    desc: "A rotating pooled fund or group circle with agreed member quotas and payout approvals.",
  },
  {
    value: "accountability",
    label: "Accountability savings",
    desc: "A personal goal with supporters you choose to keep you on track.",
  },
  {
    value: "campaign",
    label: "Fundraising campaign",
    desc: "Raise contributions from the public. Anyone can contribute without registering first.",
  },
];

interface FormData {
  name: string;
  purpose: string;
  targetAmount: string;
  currency: string;
  targetDate: string;
  rules: string;
  contributionCycle: string;
  cycleAmount: string;
  governanceThreshold: string;
  beneficiary: string;
  endDate: string;
}

const EMPTY_FORM: FormData = {
  name: "",
  purpose: "",
  targetAmount: "",
  currency: "NGN",
  targetDate: "",
  rules: "",
  contributionCycle: "monthly",
  cycleAmount: "",
  governanceThreshold: "2",
  beneficiary: "",
  endDate: "",
};

type Step = "type" | "details" | "confirm";

function NewSpaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addSpace, showToast, state } = useApp();
  const { user } = useAuth();

  const typeParam = searchParams.get("type") as SpaceType | null;
  const targetParam = searchParams.get("target");
  const currencyParam = searchParams.get("currency");
  const nameParam = searchParams.get("name");

  const initialType: SpaceType =
    typeParam && SPACE_TYPES.some((t) => t.value === typeParam)
      ? typeParam
      : (state.onboardingSelectedTypes?.[0] as SpaceType) || "personal";

  const [step, setStep] = useState<Step>("type");
  const [spaceType, setSpaceType] = useState<SpaceType>(initialType);
  const [form, setForm] = useState<FormData>(() => ({
    ...EMPTY_FORM,
    currency: currencyParam || state.defaultCurrency || EMPTY_FORM.currency,
    targetAmount: targetParam || EMPTY_FORM.targetAmount,
    name: nameParam || EMPTY_FORM.name,
  }));
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <AppShell>
        <div className="py-20 text-center max-w-sm mx-auto">
          <h1 className="text-2xl font-semibold text-[#061E47] mb-3">Sign in required</h1>
          <p className="text-[#4A5568] text-sm mb-6">You need to sign in to create a savings space.</p>
          <Button variant="primary" fullWidth onClick={() => router.push("/sign-in?redirect=/app/spaces/new")}>
            Sign in
          </Button>
        </div>
      </AppShell>
    );
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  }

  function validateDetails(): boolean {
    const errs: Partial<FormData> = {};
    if (!form.name.trim()) errs.name = "Give this space a name.";
    if (!form.purpose.trim()) errs.purpose = "Describe the purpose of this space.";
    if (!form.targetAmount || isNaN(Number(form.targetAmount)) || Number(form.targetAmount) <= 0)
      errs.targetAmount = "Enter a valid target amount.";
    if (spaceType === "community" && (!form.cycleAmount || Number(form.cycleAmount) <= 0))
      errs.cycleAmount = "Enter a contribution amount per cycle.";
    if (spaceType === "campaign" && !form.beneficiary.trim())
      errs.beneficiary = "Name the beneficiary.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleTypeNext() {
    if (!spaceType) return;
    setStep("details");
  }

  function handleDetailsNext() {
    if (validateDetails()) setStep("confirm");
  }

  async function handleCreate() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const id = generateSpaceId();
    const rulesArr = form.rules
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    const newSpace: Space = {
      id,
      name: form.name.trim(),
      type: spaceType!,
      purpose: form.purpose.trim(),
      targetAmount: Number(form.targetAmount),
      savedAmount: 0,
      currency: form.currency,
      targetDate: form.targetDate || undefined,
      createdAt: new Date().toISOString().slice(0, 10),
      status: "active",
      rules: rulesArr,
      members: [
        {
          id: "member-me",
          name: user?.name ?? "Space Owner",
          email: user?.email ?? "owner@noma.app",
          role: "owner",
          joinedAt: new Date().toISOString().slice(0, 10),
          permissions: {
            canView: true,
            canContribute: true,
            canInvite: true,
            canApprovePayouts: true,
            canRequestPayouts: true,
          },
        },
      ],
      transactions: [],
      payoutRequests: [],
      ...(spaceType === "community" && {
        contributionCycle: form.contributionCycle as Space["contributionCycle"],
        cycleAmount: Number(form.cycleAmount),
        governanceThreshold: Number(form.governanceThreshold),
      }),
      ...(spaceType === "campaign" && {
        beneficiary: form.beneficiary.trim(),
        endDate: form.targetDate || form.endDate || undefined,
        isPublic: true,
        donors: [],
      }),
    };

    addSpace(newSpace);
    showToast(`"${newSpace.name}" created successfully.`, "success");
    router.push(`/app/spaces/${id}`);
  }

  const stepIndex = step === "type" ? 0 : step === "details" ? 1 : 2;

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() =>
            step === "type"
              ? router.back()
              : setStep(step === "confirm" ? "details" : "type")
          }
          className="text-sm font-medium text-[#2B6AD0] hover:text-[#1F4591] mb-4 flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded"
        >
          ← Back
        </button>

        {/* Progress */}
        <div
          className="flex gap-2 mb-6"
          role="progressbar"
          aria-label={`Step ${stepIndex + 1} of 3: ${["Type", "Details", "Confirm"][stepIndex]}`}
          aria-valuenow={stepIndex + 1}
          aria-valuemin={1}
          aria-valuemax={3}
        >
          {["Type", "Details", "Confirm"].map((label, i) => (
            <div key={label} className="flex-1">
              <div
                className={[
                  "h-1.5 rounded-full mb-1 transition-colors",
                  i <= stepIndex ? "bg-[#2B6AD0]" : "bg-[#E2E8F0]",
                ].join(" ")}
              />
              <span className="text-xs font-medium text-[#718096]">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step: Type */}
      {step === "type" && (
        <div className="max-w-lg">
          <h1 className="text-2xl font-semibold text-[#061E47] mb-2 tracking-tight">
            What kind of space?
          </h1>
          <p className="text-[#4A5568] mb-7 text-sm">
            Choose the type that fits your goal.
          </p>
          <fieldset>
            <legend className="sr-only">Space type</legend>
            <div className="flex flex-col gap-2.5">
              {SPACE_TYPES.map((t) => (
                <label
                  key={t.value}
                  className={[
                    "flex items-start gap-3 px-4 py-4 rounded-lg border cursor-pointer transition-colors",
                    "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#2B6AD0] has-[:focus-visible]:ring-offset-1",
                    spaceType === t.value
                      ? "border-[#2B6AD0] bg-[#EBF2FC]"
                      : "border-[#E2E8F0] hover:border-[#68A4F1] bg-white",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="space-type"
                    value={t.value}
                    checked={spaceType === t.value}
                    onChange={() => setSpaceType(t.value)}
                    className="sr-only"
                  />
                  <span
                    className={[
                      "w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors",
                      spaceType === t.value
                        ? "border-[#2B6AD0] bg-[#2B6AD0]"
                        : "border-[#CBD5E0] bg-white",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    {spaceType === t.value && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#061E47]">{t.label}</p>
                    <p className="text-xs text-[#718096] mt-0.5">{t.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="mt-7">
            <Button
              variant="primary"
              onClick={handleTypeNext}
              disabled={!spaceType}
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step: Details */}
      {step === "details" && (
        <div className="max-w-md">
          <h1 className="text-2xl font-semibold text-[#061E47] mb-7 tracking-tight">
            Set up the space
          </h1>
          <div className="flex flex-col gap-5">
            <Input
              label="Space name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              placeholder={
                spaceType === "campaign"
                  ? "e.g. Rebuild Oyo school library"
                  : spaceType === "community"
                  ? "e.g. Lagos Mainland Ajo circle"
                  : "e.g. New laptop fund"
              }
            />
            <Textarea
              label="Purpose"
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              error={errors.purpose}
              placeholder="What is this space for?"
            />

            {spaceType === "campaign" && (
              <Input
                label="Beneficiary"
                name="beneficiary"
                value={form.beneficiary}
                onChange={handleChange}
                error={errors.beneficiary}
                hint="Who will receive or benefit from these funds?"
                placeholder="e.g. Government Secondary School, Oyo"
              />
            )}

            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  label="Target amount"
                  name="targetAmount"
                  type="number"
                  min="1"
                  value={form.targetAmount}
                  onChange={handleChange}
                  error={errors.targetAmount}
                  placeholder="500000"
                />
              </div>
              <div className="w-36">
                <Select
                  label="Currency"
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  options={[
                    { value: "NGN", label: "NGN (₦)" },
                    { value: "USD", label: "USD ($)" },
                    { value: "GBP", label: "GBP (£)" },
                    { value: "EUR", label: "EUR (€)" },
                  ]}
                />
              </div>
            </div>

            {spaceType !== "community" && (
              <Input
                label={spaceType === "campaign" ? "End date" : "Target date (optional)"}
                name="targetDate"
                type="date"
                value={form.targetDate}
                onChange={handleChange}
              />
            )}

            {spaceType === "community" && (
              <>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      label="Contribution per cycle"
                      name="cycleAmount"
                      type="number"
                      min="1"
                      value={form.cycleAmount}
                      onChange={handleChange}
                      error={errors.cycleAmount}
                      placeholder="50000"
                    />
                  </div>
                  <div className="w-36">
                    <Select
                      label="Cycle"
                      name="contributionCycle"
                      value={form.contributionCycle}
                      onChange={handleChange}
                      options={[
                        { value: "weekly", label: "Weekly" },
                        { value: "biweekly", label: "Biweekly" },
                        { value: "monthly", label: "Monthly" },
                      ]}
                    />
                  </div>
                </div>
                <Input
                  label="Approvals required for payouts"
                  name="governanceThreshold"
                  type="number"
                  min="1"
                  value={form.governanceThreshold}
                  onChange={handleChange}
                  hint="How many members must approve a payout request?"
                />
              </>
            )}

            <Textarea
              label="Rules (optional)"
              name="rules"
              value={form.rules}
              onChange={handleChange}
              placeholder={
                spaceType === "community"
                  ? "Contributions due on the 1st of every month\nPayout order agreed at group formation\nLate contribution incurs a ₦1,000 penalty"
                  : "Each member contributes regularly\nWithdrawals require agreement"
              }
              hint="One rule per line. Members see these when they join."
            />

            <Button variant="primary" onClick={handleDetailsNext}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step: Confirm */}
      {step === "confirm" && (
        <div className="max-w-md">
          <h1 className="text-2xl font-semibold text-[#061E47] mb-2 tracking-tight">
            Confirm your space
          </h1>
          <p className="text-sm text-[#718096] mb-7">
            Check the details before creating.
          </p>

          <dl className="flex flex-col gap-4 mb-8">
            {[
              { label: "Name", value: form.name },
              {
                label: "Type",
                value: SPACE_TYPES.find((t) => t.value === spaceType)?.label,
              },
              { label: "Purpose", value: form.purpose },
              {
                label: "Target",
                value: `${form.currency} ${Number(form.targetAmount).toLocaleString()}`,
              },
              ...(form.targetDate
                ? [{
                    label: spaceType === "campaign" ? "End date" : "Target date",
                    value: formatDate(form.targetDate),
                  }]
                : []),
              ...(spaceType === "community"
                ? [
                    {
                      label: "Contribution",
                      value: `${form.currency} ${Number(form.cycleAmount).toLocaleString()} / ${form.contributionCycle}`,
                    },
                    {
                      label: "Approvals required",
                      value: `${form.governanceThreshold} members`,
                    },
                  ]
                : []),
              ...(spaceType === "campaign"
                ? [{ label: "Beneficiary", value: form.beneficiary }]
                : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-4 text-sm">
                <dt className="text-[#718096] w-36 shrink-0">{label}</dt>
                <dd className="text-[#061E47] font-semibold">{value}</dd>
              </div>
            ))}
          </dl>

          {form.rules && (
            <div className="mb-8">
              <p className="text-sm text-[#718096] mb-2 font-medium">Rules</p>
              <ul className="flex flex-col gap-1.5">
                {form.rules
                  .split("\n")
                  .filter(Boolean)
                  .map((r) => (
                    <li key={r} className="text-sm text-[#061E47] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2B6AD0] shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep("details")}>
              Edit
            </Button>
            <Button variant="primary" onClick={handleCreate} loading={loading}>
              Create space
            </Button>
          </div>
        </div>
      )}
    </AppShell>
  );
}

export default function NewSpacePage() {
  return (
    <Suspense>
      <NewSpaceContent />
    </Suspense>
  );
}
