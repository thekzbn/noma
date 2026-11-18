"use client";

import Link from "next/link";
import { PublicNav } from "@/components/layout/PublicNav";
import { SavingsPlanner } from "@/components/planner/SavingsPlanner";
import { ToastContainer } from "@/components/ui/Toast";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FEFEFE]">
      <PublicNav />

      <main id="main-content" className="flex-1">
        {/* Hero Section with Product Proof */}
        <section className="border-b border-[#E2E8F0] bg-gradient-to-b from-[#F7F9FC] via-[#FEFEFE] to-[#FEFEFE] pt-14 pb-20 px-5">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Pitch */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF2FC] text-[#1F4591] text-xs font-semibold mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#2B6AD0] animate-pulse" />
                  Collective Savings &amp; Ajo Infrastructure
                </div>

                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#061E47] leading-[1.12] mb-6">
                  Shared money needs agreed rules, visible ledgers, and collective trust.
                </h1>

                <p className="text-lg text-[#4A5568] leading-relaxed mb-8 max-w-xl">
                  Noma gives every goal its own dedicated space: its members, custom governance, transparent contributions, and payout quorums. Run an Ajo circle, coordinate family trips, or save privately without spreadsheets.
                </p>

                <div className="flex flex-wrap items-center gap-3.5">
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-[#2B6AD0] text-white font-semibold hover:bg-[#1F4591] transition-colors shadow-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B6AD0]"
                  >
                    Create a savings space
                  </Link>
                  <Link
                    href="/planner"
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg border border-[#CBD5E0] text-[#061E47] font-semibold hover:bg-[#F7F9FC] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B6AD0]"
                  >
                    Open savings planner
                  </Link>
                </div>

                {/* Micro trust indicators */}
                <div className="flex flex-wrap items-center gap-6 mt-8 pt-8 border-t border-[#E2E8F0] text-xs font-medium text-[#718096]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#1E7A45] font-bold">✓</span>
                    <span>No mixed funds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#1E7A45] font-bold">✓</span>
                    <span>Quorum approvals for payouts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#1E7A45] font-bold">✓</span>
                    <span>Full chronological ledger</span>
                  </div>
                </div>
              </div>

              {/* Product Proof Widget: A live interactive-looking Noma space */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-[#CBD5E0] bg-white p-6 shadow-md shadow-blue-900/5">
                  <div className="flex items-center justify-between pb-4 border-b border-[#F0F4F8]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#1F4591] text-white font-bold flex items-center justify-center text-sm">
                        ₦
                      </div>
                      <div>
                        <div className="font-bold text-[#061E47] text-base leading-tight">
                          Lagos Mainland Circle
                        </div>
                        <div className="text-xs text-[#718096]">
                          Community Ajo &middot; 6 members
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E8F5EE] text-[#1E7A45]">
                      Active Cycle 2
                    </span>
                  </div>

                  {/* Financial Status */}
                  <div className="py-4 border-b border-[#F0F4F8]">
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-2xl font-black text-[#061E47]">
                        ₦2,400,000
                      </span>
                      <span className="text-xs font-bold text-[#1F4591]">
                        of ₦6,000,000 (40%)
                      </span>
                    </div>
                    <ProgressBar
                      value={40}
                      showLabel={false}
                      size="sm"
                      ariaLabel="Demo space progress: 40% saved"
                    />
                    <div className="flex justify-between text-[11px] text-[#718096] mt-2">
                      <span>Cycle amount: ₦200,000/mo</span>
                      <span>Next payout: Folake A.</span>
                    </div>
                  </div>

                  {/* Governance Snapshot */}
                  <div className="py-3 px-3.5 my-3 rounded-lg bg-[#F7F9FC] border border-[#E2E8F0] flex items-center justify-between text-xs">
                    <span className="text-[#4A5568]">Governance rule:</span>
                    <span className="font-semibold text-[#061E47]">
                      Requires 2 of 6 approvals
                    </span>
                  </div>

                  {/* Sample ledger entries */}
                  <div className="space-y-2 mt-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#A0AEC0]">
                      Recent Verified Activity
                    </span>
                    <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#F7F9FC]">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A45]" />
                        <span className="font-medium text-[#061E47]">Adaeze Okafor</span>
                      </div>
                      <span className="font-semibold text-[#1E7A45]">+₦200,000</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#F7F9FC]">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1E7A45]" />
                        <span className="font-medium text-[#061E47]">Babatunde Eze</span>
                      </div>
                      <span className="font-semibold text-[#1E7A45]">+₦200,000</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2B6AD0]" />
                        <span className="font-medium text-[#061E47]">Cycle 2 Payout Request</span>
                      </div>
                      <span className="text-[11px] font-medium text-[#856404] bg-[#FFF3CD] px-1.5 py-0.5 rounded">
                        1/2 approvals
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Savings & Ajo Planner Section */}
        <section className="max-w-5xl mx-auto px-5 py-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2B6AD0]">
              Plan Before You Form
            </span>
            <h2 className="text-3xl font-extrabold text-[#061E47] tracking-tight mt-1 mb-3">
              Calculate cycles, quotas, and targets
            </h2>
            <p className="text-[#4A5568] text-base leading-relaxed">
              Test your contribution frequency, target pacing, or rotating Ajo circle rounds in real time.
            </p>
          </div>

          <SavingsPlanner initialCurrency="NGN" />
        </section>

        {/* Four Dedicated Use Cases */}
        <section className="bg-[#F7F9FC] border-y border-[#E2E8F0] py-20 px-5">
          <div className="max-w-5xl mx-auto">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2B6AD0]">
                Purpose-Built Spaces
              </span>
              <h2 className="text-3xl font-bold text-[#061E47] tracking-tight mt-1 mb-3">
                How people save on Noma
              </h2>
              <p className="text-[#4A5568] text-base leading-relaxed">
                Money for different purposes deserves distinct rules. Select the model that matches how you save.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Community Ajo/Esusu */}
              <div className="bg-white rounded-xl p-7 border border-[#CBD5E0] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-lg bg-[#EBF2FC] text-[#1F4591] font-bold flex items-center justify-center text-lg">
                      👥
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF2FC] text-[#1F4591]">
                      Rotating &amp; Quorum
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#061E47] mb-2">
                    Rotating Ajo &amp; Esusu Groups
                  </h3>
                  <p className="text-sm text-[#4A5568] leading-relaxed mb-4">
                    Organise rotating collective savings with defined cycles. Establish rotation turns, contribution schedules, and approval quorums. Payouts disburse only when recorded member thresholds agree.
                  </p>
                  <ul className="text-xs text-[#718096] flex flex-col gap-2 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="text-[#1E7A45] font-bold">✓</span>
                      <span>Configurable approval threshold (e.g. 2 of 5 members)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#1E7A45] font-bold">✓</span>
                      <span>Cycle quotas and automated deadline tracking</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/sign-up"
                  className="text-sm font-semibold text-[#2B6AD0] hover:text-[#1F4591] inline-flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded"
                >
                  Set up an Ajo space →
                </Link>
              </div>

              {/* Family & Friends Shared */}
              <div className="bg-white rounded-xl p-7 border border-[#CBD5E0] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-lg bg-[#EBF2FC] text-[#1F4591] font-bold flex items-center justify-center text-lg">
                      ✈️
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF2FC] text-[#1F4591]">
                      Common Goal
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#061E47] mb-2">
                    Family &amp; Friends Shared Spaces
                  </h3>
                  <p className="text-sm text-[#4A5568] leading-relaxed mb-4">
                    Pool funds together for shared rent, vacations to Lagos or abroad, weddings, or joint family projects. Everyone sees their balance, and nobody can unilaterally withdraw funds.
                  </p>
                  <ul className="text-xs text-[#718096] flex flex-col gap-2 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="text-[#1E7A45] font-bold">✓</span>
                      <span>Everyone tracks their own contribution share</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#1E7A45] font-bold">✓</span>
                      <span>Withdrawals require explicit group consent</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/sign-up"
                  className="text-sm font-semibold text-[#2B6AD0] hover:text-[#1F4591] inline-flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded"
                >
                  Create a shared space →
                </Link>
              </div>

              {/* Personal Savings */}
              <div className="bg-white rounded-xl p-7 border border-[#CBD5E0] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-lg bg-[#EBF2FC] text-[#1F4591] font-bold flex items-center justify-center text-lg">
                      🎯
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF2FC] text-[#1F4591]">
                      Solo or Partner
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#061E47] mb-2">
                    Personal Savings with Accountability
                  </h3>
                  <p className="text-sm text-[#4A5568] leading-relaxed mb-4">
                    Save for a new laptop, emergency buffer, or tuition. If you choose, invite a mentor or partner as a viewer — they keep you honest without ever touching your money.
                  </p>
                  <ul className="text-xs text-[#718096] flex flex-col gap-2 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="text-[#1E7A45] font-bold">✓</span>
                      <span>Target dates and automated pacing targets</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#1E7A45] font-bold">✓</span>
                      <span>View-only permissions for accountability partners</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/sign-up"
                  className="text-sm font-semibold text-[#2B6AD0] hover:text-[#1F4591] inline-flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded"
                >
                  Start a personal space →
                </Link>
              </div>

              {/* Public Campaigns */}
              <div className="bg-white rounded-xl p-7 border border-[#CBD5E0] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-lg bg-[#EBF2FC] text-[#1F4591] font-bold flex items-center justify-center text-lg">
                      📢
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF2FC] text-[#1F4591]">
                      Open Giving
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#061E47] mb-2">
                    Public Fundraising Campaigns
                  </h3>
                  <p className="text-sm text-[#4A5568] leading-relaxed mb-4">
                    Fund school restorations, medical fundraisers, or community projects. Donors contribute directly via card or transfer with zero sign-up friction and immediate digital receipts.
                  </p>
                  <ul className="text-xs text-[#718096] flex flex-col gap-2 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="text-[#1E7A45] font-bold">✓</span>
                      <span>Anonymous donation toggle by default</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#1E7A45] font-bold">✓</span>
                      <span>Shareable public link with live verified progress</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/campaign/campaign-1"
                  className="text-sm font-semibold text-[#2B6AD0] hover:text-[#1F4591] inline-flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded"
                >
                  Explore demo campaign →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Permissions Principle Section */}
        <section className="max-w-5xl mx-auto px-5 py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2B6AD0]">
                Security Architecture
              </span>
              <h2 className="text-3xl font-extrabold text-[#061E47] tracking-tight mt-1 mb-4">
                Explicit permissions. No automatic authority.
              </h2>
              <p className="text-[#4A5568] leading-relaxed mb-6">
                Being someone&apos;s spouse, parent, sibling, or business partner never grants automatic control over their savings on Noma.
              </p>
              <div className="space-y-4 text-sm text-[#4A5568]">
                <div className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#E8F5EE] text-[#1E7A45] font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    ✓
                  </span>
                  <div>
                    <strong className="text-[#061E47] font-semibold">Granular role delegation:</strong>{" "}
                    Space owners explicitly grant permissions to view, deposit, invite others, or vote on payouts.
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#E8F5EE] text-[#1E7A45] font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    ✓
                  </span>
                  <div>
                    <strong className="text-[#061E47] font-semibold">Pre-join verification:</strong>{" "}
                    When you share an invite link, the invitee inspects the exact rights they will hold before agreeing to join.
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#E8F5EE] text-[#1E7A45] font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                    ✓
                  </span>
                  <div>
                    <strong className="text-[#061E47] font-semibold">Multi-currency native:</strong>{" "}
                    Create spaces denominated in Nigerian Naira (₦), British Pounds (£), US Dollars ($), or Euros (€).
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-6 bg-[#F7F9FC] border border-[#CBD5E0] rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-[#061E47] mb-4">
                Transparent Invitation Preview
              </h3>
              <p className="text-xs text-[#718096] mb-6">
                What a member sees before accepting access to your space:
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-[#E2E8F0]">
                  <span className="text-sm font-medium text-[#061E47]">View goal and ledger</span>
                  <span className="text-xs font-bold text-[#1E7A45]">Granted</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-[#E2E8F0]">
                  <span className="text-sm font-medium text-[#061E47]">Deposit contributions</span>
                  <span className="text-xs font-bold text-[#1E7A45]">Granted</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-[#E2E8F0]">
                  <span className="text-sm font-medium text-[#061E47]">Approve or reject payouts</span>
                  <span className="text-xs font-bold text-[#1F4591] bg-[#EBF2FC] px-2 py-0.5 rounded">
                    Requires Vote
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-[#E2E8F0]">
                  <span className="text-sm font-medium text-[#061E47]">Direct withdrawal rights</span>
                  <span className="text-xs font-bold text-[#718096]">None</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Bar */}
        <section className="border-t border-[#E2E8F0] bg-[#1F4591] text-white py-16 px-5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold tracking-tight mb-4">
              Start coordinating your shared finances today
            </h2>
            <p className="text-blue-100 text-base max-w-xl mx-auto mb-8">
              Create your first space in under two minutes. No hidden fees, no spreadsheets, and complete transparency.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center px-6 py-3.5 rounded-lg bg-white text-[#1F4591] font-bold hover:bg-blue-50 transition-colors shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Create your first space
              </Link>
              <Link
                href="/planner"
                className="inline-flex items-center px-6 py-3.5 rounded-lg border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Try the planner
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white">
        <div className="max-w-5xl mx-auto px-5 py-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-[#1F4591] text-white font-bold flex items-center justify-center text-xs">
              n
            </span>
            <span className="text-base font-bold text-[#1F4591]">noma.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[#718096]">
            <Link href="/planner" className="hover:text-[#1F4591] transition-colors">
              Savings Planner
            </Link>
            <Link href="/how-it-works" className="hover:text-[#1F4591] transition-colors">
              How it works
            </Link>
            <Link href="/campaign/campaign-1" className="hover:text-[#1F4591] transition-colors">
              Campaigns
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
