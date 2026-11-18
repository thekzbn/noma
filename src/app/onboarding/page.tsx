"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/store";

const STEPS = [
  {
    id: "type",
    heading: "What matters to you right now?",
    body: "Noma supports different ways to save. Choose everything that applies so we can arrange your spaces around what you need.",
    choices: [
      { value: "personal", label: "A personal goal: saving on my own" },
      { value: "shared", label: "A shared goal: saving with family, friends, or a partner" },
      { value: "community", label: "A community fund: an Ajo, Esusu, or rotating group" },
      { value: "campaign", label: "A public campaign: collecting contributions for a project" },
    ],
  },
  {
    id: "privacy",
    heading: "Your spaces, your permissions",
    body: null,
    points: [
      "Every space belongs to the person who creates it.",
      "When you invite someone, they see the exact permissions you have granted before accepting.",
      "Being a partner, family member, or friend never grants automatic access to your money.",
      "Permissions can be revised or revoked at any time.",
      "Public campaign donations display as anonymous by default. Contributor details are recorded only for receipts and audit trails.",
    ],
  },
  {
    id: "ready",
    heading: "You are ready",
    body: "Create your first savings space whenever you wish. Your goal, your rules, your contributors, and your transaction records stay together in one dedicated space.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["personal"]);
  const currentStep = STEPS[step];

  function toggleType(val: string) {
    setSelectedTypes((prev) =>
      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
    );
  }

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

  const canContinue = currentStep.id !== "type" || selectedTypes.length > 0;

  return (
    <div className="min-h-screen bg-[#FEFEFE] flex flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="mb-8 text-center sm:text-left">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-[#1F4591] hover:opacity-85 transition-opacity"
          >
            noma.
          </Link>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-8" aria-label="Onboarding progress">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={[
                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                i <= step ? "bg-[#2B6AD0]" : "bg-[#E2E8F0]",
              ].join(" ")}
            />
          ))}
        </div>

        {/* Animated step container */}
        <div
          key={step}
          className="transition-all duration-300 ease-out"
          style={{
            animation: "stepFadeIn 280ms cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          <h1 className="text-2xl font-semibold text-[#061E47] mb-3 tracking-tight">
            {currentStep.heading}
          </h1>

          {currentStep.id === "type" && (
            <div>
              <p className="text-[#4A5568] mb-6 leading-relaxed text-sm">
                {currentStep.body}
              </p>
              <fieldset>
                <legend className="sr-only">Select what matters to you</legend>
                <div className="flex flex-col gap-2.5">
                  {currentStep.choices?.map((opt) => {
                    const isChecked = selectedTypes.includes(opt.value);
                    return (
                      <label
                        key={opt.value}
                        className={[
                          "flex items-start gap-3.5 px-4 py-3.5 rounded-lg border cursor-pointer transition-all duration-150",
                          isChecked
                            ? "border-[#2B6AD0] bg-[#EBF2FC]/70 shadow-sm"
                            : "border-[#E2E8F0] hover:border-[#68A4F1] bg-[#FEFEFE]",
                        ].join(" ")}
                      >
                        <input
                          type="checkbox"
                          name="save-priority"
                          value={opt.value}
                          checked={isChecked}
                          onChange={() => toggleType(opt.value)}
                          className="sr-only"
                        />
                        <span
                          className={[
                            "w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                            isChecked
                              ? "border-[#2B6AD0] bg-[#2B6AD0] text-white"
                              : "border-[#CBD5E0] bg-white",
                          ].join(" ")}
                          aria-hidden="true"
                        >
                          {isChecked && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                        <span className="text-sm font-medium text-[#061E47] leading-snug">
                          {opt.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          )}

          {currentStep.id === "privacy" && (
            <ul className="flex flex-col gap-3.5 mt-2">
              {currentStep.points?.map((point, i) => (
                <li key={i} className="flex gap-3 text-[#4A5568] text-sm leading-relaxed">
                  <span className="text-[#3CB371] font-bold mt-0.5 shrink-0" aria-hidden="true">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}

          {currentStep.id === "ready" && (
            <p className="text-[#4A5568] leading-relaxed mt-2 text-base">
              {currentStep.body}
            </p>
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
    </div>
  );
}
