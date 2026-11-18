"use client";

import { PublicNav } from "@/components/layout/PublicNav";
import { SavingsPlanner } from "@/components/planner/SavingsPlanner";
import Link from "next/link";
import { ToastContainer } from "@/components/ui/Toast";

export default function PlannerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FEFEFE]">
      <PublicNav />

      <main id="main-content" className="flex-1 max-w-4xl mx-auto px-5 py-12 w-full">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm font-medium text-[#2B6AD0] hover:text-[#1F4591] mb-4 inline-flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded"
          >
            ← Back to home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#061E47] tracking-tight mb-3">
            Group &amp; Personal Savings Planner
          </h1>
          <p className="text-base text-[#4A5568] max-w-2xl leading-relaxed">
            Figure out exactly what each member owes, how rotating Ajo pots work, and how fast you will reach your milestone. No guesswork.
          </p>
        </div>

        <SavingsPlanner initialCurrency="NGN" className="mb-16" />

        {/* Informative Guidance */}
        <section className="border-t border-[#E2E8F0] pt-12">
          <h2 className="text-xl font-bold text-[#061E47] mb-6">
            How Noma handles group coordination
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0]">
              <div className="w-8 h-8 rounded-lg bg-[#EBF2FC] text-[#1F4591] font-bold flex items-center justify-center text-sm mb-3">
                1
              </div>
              <h3 className="font-semibold text-[#061E47] mb-1.5">No mixed funds</h3>
              <p className="text-sm text-[#4A5568] leading-relaxed">
                Every space maintains its own isolated ledger. Money deposited for Lagos holiday will never mingle with your laptop fund.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0]">
              <div className="w-8 h-8 rounded-lg bg-[#EBF2FC] text-[#1F4591] font-bold flex items-center justify-center text-sm mb-3">
                2
              </div>
              <h3 className="font-semibold text-[#061E47] mb-1.5">Agreed governance</h3>
              <p className="text-sm text-[#4A5568] leading-relaxed">
                Payouts cannot leave without the quorum you choose. For community spaces, 2 or more approvals can be mandated before release.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#F7F9FC] border border-[#E2E8F0]">
              <div className="w-8 h-8 rounded-lg bg-[#EBF2FC] text-[#1F4591] font-bold flex items-center justify-center text-sm mb-3">
                3
              </div>
              <h3 className="font-semibold text-[#061E47] mb-1.5">Audited in real time</h3>
              <p className="text-sm text-[#4A5568] leading-relaxed">
                Every member sees who contributed, when they paid, and where money went. No awkward spreadsheets or manual WhatsApp tallying.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#E2E8F0] mt-16">
        <div className="max-w-4xl mx-auto px-5 py-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-[#1F4591] text-white font-bold flex items-center justify-center text-xs">
              n
            </span>
            <span className="text-base font-bold text-[#1F4591]">noma.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[#718096]">
            <Link href="/how-it-works" className="hover:text-[#1F4591] transition-colors">
              How it works
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
