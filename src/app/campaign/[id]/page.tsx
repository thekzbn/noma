"use client";

import { use } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { DEMO_CAMPAIGN, formatCurrency, progressPercent } from "@/lib/demo-data";
import { PublicNav } from "@/components/layout/PublicNav";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";

export default function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { state } = useApp();

  const space =
    state.spaces.find((s) => s.id === id) ??
    (id === DEMO_CAMPAIGN.id ? DEMO_CAMPAIGN : null);

  if (!space || space.type !== "campaign") {
    return (
      <div className="flex flex-col min-h-screen bg-[#FEFEFE]">
        <PublicNav />
        <main id="main-content" className="max-w-md mx-auto px-5 py-20 text-center flex-1">
          <h1 className="text-2xl font-semibold text-[#061E47] mb-3">
            Campaign not found
          </h1>
          <p className="text-sm text-[#4A5568] mb-8">
            This campaign link may have expired or the campaign has concluded.
          </p>
          <Link href="/" className="text-[#2B6AD0] hover:underline text-sm font-medium">
            Back to home
          </Link>
        </main>
      </div>
    );
  }

  const pct = progressPercent(space.savedAmount, space.targetAmount);

  return (
    <div className="flex flex-col min-h-screen bg-[#FEFEFE]">
      <PublicNav />
      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="bg-[#F7F9FC] border-b border-[#E2E8F0] py-14 px-5">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#061E47] tracking-tight mb-4">
              {space.name}
            </h1>
            <p className="text-base text-[#4A5568] leading-relaxed mb-8">
              {space.purpose}
            </p>

            {/* Financial Progress Hub */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                <span className="text-3xl sm:text-4xl font-bold text-[#061E47] tracking-tight">
                  {formatCurrency(space.savedAmount, space.currency)}
                </span>
                <span className="text-sm font-semibold text-[#1F4591]">
                  target of {formatCurrency(space.targetAmount, space.currency)} ({pct}%)
                </span>
              </div>
              <ProgressBar value={pct} size="md" />
              <div className="flex flex-wrap gap-6 mt-3 text-xs text-[#718096]">
                <span>{space.donors?.length ?? 0} total contributions</span>
                {space.endDate && <span>Campaign concludes: {space.endDate}</span>}
              </div>
            </div>

            <Link href={`/campaign/${id}/contribute`}>
              <Button variant="primary" size="lg">
                Contribute to this campaign
              </Button>
            </Link>
          </div>
        </section>

        {/* Details & Ledger */}
        <section className="max-w-2xl mx-auto px-5 py-12">
          {space.beneficiary && (
            <div className="mb-10">
              <h2 className="text-base font-semibold text-[#061E47] mb-2">
                Beneficiary
              </h2>
              <p className="text-sm text-[#4A5568] leading-relaxed">
                {space.beneficiary}
              </p>
            </div>
          )}

          <div className="mb-10 pt-8 border-t border-[#E2E8F0]">
            <h2 className="text-base font-semibold text-[#061E47] mb-2">
              Organised by
            </h2>
            <p className="text-sm text-[#4A5568]">{space.members[0]?.name}</p>
          </div>

          {/* Donors list */}
          {space.donors && space.donors.length > 0 && (
            <div className="pt-8 border-t border-[#E2E8F0]">
              <h2 className="text-base font-semibold text-[#061E47] mb-1">
                Contributions
              </h2>
              <p className="text-xs text-[#718096] mb-5">
                Contributions are anonymous by default unless the contributor chose to display their name.
              </p>
              <div className="divide-y divide-[#E2E8F0]">
                {space.donors.map((donor) => (
                  <div
                    key={donor.id}
                    className="flex items-center justify-between py-3.5 text-sm"
                  >
                    <div>
                      <span className="font-medium text-[#061E47]">
                        {donor.displayName}
                      </span>
                      <span className="block text-xs text-[#718096] mt-0.5">
                        {donor.date}
                      </span>
                    </div>
                    <span className="font-semibold text-[#2D7D4E]">
                      +{formatCurrency(donor.amount, donor.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-[#E2E8F0] text-center">
            <Link href={`/campaign/${id}/contribute`}>
              <Button variant="primary" size="lg">
                Contribute to this campaign
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#E2E8F0]">
        <div className="max-w-2xl mx-auto px-5 py-8 flex flex-wrap items-center justify-between gap-4">
          <span className="text-base font-bold text-[#1F4591]">noma.</span>
          <div className="flex items-center gap-6 text-sm text-[#718096]">
            <Link href="/" className="hover:text-[#1F4591] transition-colors">
              Home
            </Link>
            <Link href="/sign-up" className="hover:text-[#1F4591] transition-colors">
              Create an account
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
