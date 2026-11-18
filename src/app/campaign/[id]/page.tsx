"use client";

import { use } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { DEMO_CAMPAIGN, formatCurrency, formatDate, progressPercent } from "@/lib/demo-data";
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
      <div
        className="bg-[#FFF8E6] border-b border-[#F6D860] text-[#856404] text-xs text-center py-2 px-4"
        role="status"
        aria-label="Demo notice"
      >
        Demo campaign — contributions and donors are simulated for prototype verification.
      </div>
      <PublicNav />
      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="bg-[#F7F9FC] border-b border-[#E2E8F0] py-14 px-5">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF2FC] text-[#1F4591]">
                Public Campaign
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-white border border-[#E2E8F0] text-[#718096]">
                Demo
              </span>
            </div>
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
              <ProgressBar
                value={pct}
                size="md"
                ariaLabel={`Campaign funding: ${pct}% of ${formatCurrency(space.targetAmount, space.currency)} reached`}
              />
              <div className="flex flex-wrap gap-6 mt-3 text-xs text-[#718096]">
                <span>{space.donors?.length ?? 0} total contributions</span>
                {space.endDate && <span>Campaign concludes: {formatDate(space.endDate)}</span>}
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

          <div className="mb-12 mt-12">
            <h2 className="text-base font-semibold text-[#061E47] mb-2">
              Organised by
            </h2>
            <p className="text-sm text-[#4A5568]">{space.members[0]?.name}</p>
          </div>

          {/* Donors list */}
          {space.donors && space.donors.length > 0 && (
            <div className="mt-12">
              <h2 className="text-base font-semibold text-[#061E47] mb-1">
                Contributions
              </h2>
              <p className="text-xs text-[#718096] mb-5">
                Contributions are anonymous by default unless the contributor chose to display their name.
              </p>
              <div className="flex flex-col">
                {space.donors.map((donor) => (
                  <div
                    key={donor.id}
                    className="flex items-center justify-between py-3 text-sm border-b border-[#F7F9FC] last:border-0"
                  >
                    <div>
                      <span className="font-medium text-[#061E47]">
                        {donor.displayName}
                      </span>
                      <span className="block text-xs text-[#718096] mt-0.5">
                        {formatDate(donor.date)}
                      </span>
                    </div>
                    <span className="font-semibold text-[#1E7A45]">
                      +{formatCurrency(donor.amount, donor.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 text-center">
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
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-[#1F4591] text-white font-bold flex items-center justify-center text-xs">
              n
            </span>
            <span className="text-base font-bold text-[#1F4591]">noma.</span>
          </div>
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
