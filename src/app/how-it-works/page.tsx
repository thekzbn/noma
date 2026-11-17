"use client";

import Link from "next/link";
import { PublicNav } from "@/components/layout/PublicNav";
import { ToastContainer } from "@/components/ui/Toast";

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FEFEFE]">
      <PublicNav />
      <main className="flex-1 max-w-3xl mx-auto px-5 py-16">
        <h1 className="text-3xl font-semibold text-[#061E47] mb-4 tracking-tight">
          How Noma works
        </h1>
        <p className="text-[#4A5568] text-lg mb-12" style={{ maxWidth: "54ch" }}>
          Every saving goal lives in its own space. The space holds everything
          related to that goal.
        </p>

        {/* Step list — genuinely sequential */}
        <ol className="flex flex-col gap-10" aria-label="Steps">
          {[
            {
              n: "1",
              title: "Create a space for a goal",
              body: "Name the goal, set a target amount, pick a type (personal, shared, community, or campaign), and add any rules. The space is the home for that goal from start to finish.",
            },
            {
              n: "2",
              title: "Invite the right people",
              body: "If you're saving with others, invite them by link. Each person sees and agrees to the permissions before they join — what they can view, contribute, or approve. No one gets access they haven't been given.",
            },
            {
              n: "3",
              title: "Contribute on your plan",
              body: "Make contributions according to the plan in the space. Each contribution is recorded with a status — pending, completed, or failed. The balance updates only after payment is confirmed.",
            },
            {
              n: "4",
              title: "Request and approve payouts",
              body: "When money is needed, a payout request is submitted. Depending on the space's rules, it may need approval from one or more members before it's executed. The request and every approval is logged.",
            },
            {
              n: "5",
              title: "Keep your records",
              body: "Every contribution, payout, and status change is in the space's activity ledger. You can review the full history at any time.",
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

        <div className="mt-14 pt-10 border-t border-[#E2E8F0]">
          <p className="text-[#4A5568] mb-6" style={{ maxWidth: "52ch" }}>
            Noma is a demo app. No real payments are processed, and no data
            persists between sessions.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/sign-up"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-[#2B6AD0] text-white font-medium hover:bg-[#1F4591] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B6AD0]"
            >
              Get started
            </Link>
            <Link
              href="/campaign/campaign-1"
              className="inline-flex items-center px-6 py-3 rounded-lg border border-[#CBD5E0] text-[#1F4591] font-medium hover:bg-[#F7F9FC] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B6AD0]"
            >
              See a campaign
            </Link>
          </div>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
