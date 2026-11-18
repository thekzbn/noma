"use client";

import Link from "next/link";
import { PublicNav } from "@/components/layout/PublicNav";
import { ToastContainer } from "@/components/ui/Toast";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FEFEFE]">
      <PublicNav />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-3xl mx-auto px-5 pt-20 pb-16">
          <h1
            className="text-[2.75rem] leading-[1.12] font-semibold tracking-tight text-[#061E47] mb-6"
            style={{ maxWidth: "28ch" }}
          >
            Save for what actually matters: alone or together.
          </h1>
          <p
            className="text-[1.125rem] text-[#4A5568] leading-relaxed mb-10"
            style={{ maxWidth: "54ch" }}
          >
            Noma gives every goal its own home: its purpose, its people, its
            rules, and its records. Whether you are saving on your own, with
            family, or running a rotating community fund, everything stays together in one space.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/sign-up"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-[#2B6AD0] text-white font-medium hover:bg-[#1F4591] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B6AD0]"
            >
              Create your first space
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center px-6 py-3 rounded-lg border border-[#CBD5E0] text-[#1F4591] font-medium hover:bg-[#F7F9FC] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B6AD0]"
            >
              How it works
            </Link>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-[#E2E8F0]" />

        {/* Three ways to save */}
        <section className="max-w-3xl mx-auto px-5 py-16">
          <h2 className="text-xl font-semibold text-[#061E47] mb-10">
            Three ways people use Noma
          </h2>

          <div className="flex flex-col gap-10">
            {/* Personal */}
            <div>
              <h3 className="text-base font-semibold text-[#1F4591] mb-2">
                Saving by yourself
              </h3>
              <p
                className="text-[#4A5568] leading-relaxed"
                style={{ maxWidth: "60ch" }}
              >
                Set a goal (such as a laptop, house deposit, or emergency buffer) with a
                target amount and target date. If you wish, invite an accountability partner
                to view your progress. They see what you share; they cannot touch your money.
              </p>
              <Link
                href="/sign-up"
                className="inline-block mt-4 text-sm font-medium text-[#2B6AD0] hover:text-[#1F4591] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded"
              >
                Start a personal space
              </Link>
            </div>

            <div className="border-t border-[#E2E8F0]" />

            {/* Shared */}
            <div>
              <h3 className="text-base font-semibold text-[#1F4591] mb-2">
                Saving with family or friends
              </h3>
              <p
                className="text-[#4A5568] leading-relaxed"
                style={{ maxWidth: "60ch" }}
              >
                Create a shared space with a common goal. Each member contributes
                on their schedule, tracks their individual balance, and understands the agreed rules.
                Withdrawals follow the explicit conditions you agree upon as a group.
              </p>
              <Link
                href="/sign-up"
                className="inline-block mt-4 text-sm font-medium text-[#2B6AD0] hover:text-[#1F4591] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded"
              >
                Create a shared space
              </Link>
            </div>

            <div className="border-t border-[#E2E8F0]" />

            {/* Community */}
            <div>
              <h3 className="text-base font-semibold text-[#1F4591] mb-2">
                Saving as a community
              </h3>
              <p
                className="text-[#4A5568] leading-relaxed"
                style={{ maxWidth: "60ch" }}
              >
                Organise an Ajo, Esusu, or rotating group with clear cycles.
                Establish cycle amounts, rotation schedules, and quorum requirements.
                Every contribution is audited in real time, and payouts release only when
                the required approvals are recorded.
              </p>
              <Link
                href="/sign-up"
                className="inline-block mt-4 text-sm font-medium text-[#2B6AD0] hover:text-[#1F4591] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded"
              >
                Set up a community space
              </Link>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-[#E2E8F0]" />

        {/* Campaign callout */}
        <section className="max-w-3xl mx-auto px-5 py-16">
          <h2 className="text-xl font-semibold text-[#061E47] mb-4">
            Raising contributions from the public
          </h2>
          <p
            className="text-[#4A5568] leading-relaxed mb-6"
            style={{ maxWidth: "58ch" }}
          >
            Create a fundraising campaign with a public page. Donors can contribute
            directly without registering first. Contributions display as anonymous by default,
            or donors can choose to show their name. Every contribution receives an immediate digital receipt.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/campaign/campaign-1"
              className="inline-flex items-center px-5 py-2.5 rounded-lg border border-[#CBD5E0] text-[#1F4591] text-sm font-medium hover:bg-[#F7F9FC] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B6AD0]"
            >
              See a live campaign
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#2B6AD0] text-white text-sm font-medium hover:bg-[#1F4591] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B6AD0]"
            >
              Start a campaign
            </Link>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-[#E2E8F0]" />

        {/* Trust note */}
        <section className="max-w-3xl mx-auto px-5 py-14">
          <h2 className="text-xl font-semibold text-[#061E47] mb-4">
            Permissions are yours to give
          </h2>
          <p
            className="text-[#4A5568] leading-relaxed"
            style={{ maxWidth: "58ch" }}
          >
            Being someone&apos;s partner, parent, or colleague never grants automatic access
            to their savings. Every permission is explicit and revocable. What someone can see,
            contribute, or approve is set directly by the space owner.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0]">
        <div className="max-w-3xl mx-auto px-5 py-8 flex flex-wrap items-center justify-between gap-4">
          <span className="text-base font-bold text-[#1F4591]">noma.</span>
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
