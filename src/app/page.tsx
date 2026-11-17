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
          <p className="text-sm font-medium text-[#2B6AD0] mb-5">
            A savings space is for a goal, not just a number.
          </p>
          <h1
            className="text-[2.75rem] leading-[1.1] font-semibold tracking-tight text-[#061E47] mb-6"
            style={{ maxWidth: "28ch" }}
          >
            Save for what actually matters — alone or together.
          </h1>
          <p
            className="text-[1.125rem] text-[#4A5568] leading-relaxed mb-10"
            style={{ maxWidth: "54ch" }}
          >
            Noma gives every goal its own space: its purpose, its people, its
            rules, and its records. Whether you&apos;re saving by yourself, with
            family, or running a community fund, everything stays together.
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
                Set a goal — a laptop, a deposit, a holiday fund — with a
                target, a date, and a plan. Optionally invite someone you trust
                to see your progress. They see what you show them; they don&apos;t
                control your money.
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
                Create a shared space with a common goal. Each person
                contributes on their schedule, tracks their own record, and
                understands the agreed rules. Withdrawals follow the rules you
                set together.
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
                Run an Ajo, Esusu, susu, or any rotating or pooled fund. Set
                contribution cycles, payout rotations, and governance rules.
                Every transaction is recorded. Payouts require the approvals
                your group sets.
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
            Raising money from the public?
          </h2>
          <p
            className="text-[#4A5568] leading-relaxed mb-6"
            style={{ maxWidth: "58ch" }}
          >
            Create a fundraising campaign with a public page. Donors can
            contribute without joining Noma. Contributions are anonymous by
            default — donors choose whether to show their name. Every donation
            is recorded and receipted.
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
            Being someone&apos;s partner, parent, or friend does not automatically
            grant access to their savings. Every permission is explicit and
            revocable. What someone can see, contribute, or approve is set by
            the person who owns the space.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0]">
        <div className="max-w-3xl mx-auto px-5 py-8 flex flex-wrap items-center justify-between gap-4">
          <span className="text-sm text-[#061E47] font-semibold">Noma</span>
          <div className="flex items-center gap-6 text-sm text-[#718096]">
            <span className="demo-badge">Demo — no data is saved</span>
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
}
