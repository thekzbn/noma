"use client";

import Link from "next/link";
import { PublicNav } from "@/components/layout/PublicNav";
import { ToastContainer } from "@/components/ui/Toast";

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FEFEFE]">
      <PublicNav />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto px-5 py-16">
        <h1 className="text-3xl font-semibold text-[#061E47] mb-4 tracking-tight">
          How noma. works
        </h1>
        <p className="text-[#4A5568] text-lg mb-12" style={{ maxWidth: "54ch" }}>
          Every savings goal lives in its own dedicated space. The space holds the target, the rules, the contributors, and the full audit trail.
        </p>

        {/* Step list: sequential */}
        <ol className="flex flex-col gap-10" aria-label="Steps">
          {[
            {
              n: "1",
              title: "Create a space for your goal",
              body: "Give the space a clear name, choose the target amount, select the category (personal, shared, community, or public campaign), and write the rules. The space serves as the complete home for that goal.",
            },
            {
              n: "2",
              title: "Invite contributors with explicit permissions",
              body: "When saving with others, send an invitation link. Each recipient reviews and accepts their specific permissions (viewing, contributing, or approving) before joining. Nobody receives rights without your agreement.",
            },
            {
              n: "3",
              title: "Contribute according to your plan",
              body: "Make deposits following your agreed timetable. Every contribution is verified and logged with an audit reference and status. The space balance updates immediately once confirmed.",
            },
            {
              n: "4",
              title: "Request and authorise payouts",
              body: "When funds need to be disbursed, submit a payout request. For shared and community spaces, the payout executes only after the required number of member approvals is confirmed.",
            },
            {
              n: "5",
              title: "Inspect your ledger at any time",
              body: "Every contribution, payout request, vote, and distribution is permanently recorded in the space ledger. Everyone with access can view the complete, transparent history.",
            },
          ].map((step) => (
            <li key={step.n} className="flex gap-5">
              <span
                className="shrink-0 w-7 h-7 rounded-full border-2 border-[#1F4591] text-[#1F4591] flex items-center justify-center text-xs font-semibold mt-0.5"
                aria-hidden="true"
              >
                {step.n}
              </span>
              <div>
                <h2 className="font-semibold text-[#061E47] mb-1.5">{step.title}</h2>
                <p className="text-[#4A5568] leading-relaxed" style={{ maxWidth: "56ch" }}>
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16">
          <Link
            href="/sign-up"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-[#2B6AD0] text-white font-medium hover:bg-[#1F4591] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0]"
          >
            Create your first space
          </Link>
        </div>
      </main>

      <footer className="border-t border-[#E2E8F0]">
        <div className="max-w-3xl mx-auto px-5 py-8 flex flex-wrap items-center justify-between gap-4">
          <span className="text-base font-bold text-[#1F4591]">noma.</span>
          <div className="flex items-center gap-6 text-sm text-[#718096]">
            <Link href="/" className="hover:text-[#1F4591] transition-colors">
              Home
            </Link>
            <Link href="/sign-in" className="hover:text-[#1F4591] transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
}
