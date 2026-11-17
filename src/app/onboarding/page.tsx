"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/store";

const STEPS = [
  {
    id: "type",
    heading: "What matters to you right now?",
    body: "Noma works for different kinds of saving. Tell us what's on your mind — it helps us show you the right things first.",
    choices: [
      { value: "personal", label: "A personal goal — just me saving" },
      { value: "shared", label: "A shared goal — with family or friends" },
      { value: "community", label: "A community fund — Ajo, Esusu, or similar" },
      { value: "campaign", label: "Raising money from others — a fundraising campaign" },
    ],
  },
  {
    id: "privacy",
    heading: "Your spaces, your permissions",
    body: null,
    points: [
      "Every space belongs to the person who creates it.",
      "Inviting someone to a space shows them exactly what permissions you're granting — before they accept.",
      "Being a family member or partner does not automatically give anyone access.",
      "You can change or remove access at any time.",
      "Public campaign contributions are anonymous by default. Noma still records what's needed for payment processing and receipts.",
    ],
  },
  {
    id: "ready",
    heading: "You're ready",
    body: "Create your first savings space whenever you like. Everything — the goal, the people, the records — stays together in the space.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState("");
  const currentStep = STEPS[step];

  function next() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      completeOnboarding();
      router.push("/app");
    }
  }

  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  const canContinue = currentStep.id !== "type" || choice !== "";

  return (
    <div className="min-h-screen bg-[#FEFEFE] flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="flex gap-1.5 mb-10" aria-label="Onboarding progress">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={[
                "h-1 flex-1 rounded-full transition-colors",
                i <= step ? "bg-[#2B6AD0]" : "bg-[#E2E8F0]",
              ].join(" ")}
            />
          ))}
        </div>

        <h1 className="text-2xl font-semibold text-[#061E47] mb-4 tracking-tight">
          {currentStep.heading}
        </h1>

        {/* Step content */}
        {currentStep.id === "type" && (
          <div>
            <p className="text-[#4A5568] mb-6 leading-relaxed">{currentStep.body}</p>
            <fieldset>
              <legend className="sr-only">Choose what you want to save for</legend>
              <div className="flex flex-col gap-2">
                {currentStep.choices?.map((opt) => (
                  <label
                    key={opt.value}
                    className={[
                      "flex items-center gap-3 px-4 py-3.5 rounded-lg border cursor-pointer transition-colors",
                      choice === opt.value
                        ? "border-[#2B6AD0] bg-[#EBF2FC]"
                        : "border-[#E2E8F0] hover:border-[#68A4F1]",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="save-type"
                      value={opt.value}
                      checked={choice === opt.value}
                      onChange={() => setChoice(opt.value)}
                      className="sr-only"
                    />
                    <span
                      className={[
                        "w-4 h-4 rounded-full border-2 shrink-0",
                        choice === opt.value
                          ? "border-[#2B6AD0] bg-[#2B6AD0]"
                          : "border-[#CBD5E0]",
                      ].join(" ")}
                    />
                    <span className="text-sm text-[#061E47]">{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        )}

        {currentStep.id === "privacy" && (
          <ul className="flex flex-col gap-3 mt-2">
            {currentStep.points?.map((point) => (
              <li key={point} className="flex gap-3 text-[#4A5568] text-sm leading-relaxed">
                <span className="text-[#3CB371] mt-0.5 shrink-0" aria-hidden="true">✓</span>
                {point}
              </li>
            ))}
          </ul>
        )}

        {currentStep.id === "ready" && (
          <p className="text-[#4A5568] leading-relaxed mt-2">{currentStep.body}</p>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-10">
          {step > 0 && (
            <Button variant="ghost" onClick={back}>
              Back
            </Button>
          )}
          <Button
            variant="primary"
            onClick={next}
            disabled={!canContinue}
            fullWidth={step === 0}
          >
            {step < STEPS.length - 1 ? "Continue" : "Go to my spaces"}
          </Button>
        </div>
      </div>
    </div>
  );
}
