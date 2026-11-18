"use client";

import { useApp } from "@/lib/store";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  formatCurrency,
  progressPercent,
  spaceTypeLabel,
  type Space,
} from "@/lib/demo-data";

function SpaceRow({ space }: { space: Space }) {
  const pct = progressPercent(space.savedAmount, space.targetAmount);
  return (
    <Link
      href={`/app/spaces/${space.id}`}
      className="group block py-6 px-4 -mx-4 rounded-xl hover:bg-[#F7F9FC] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0]"
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-6 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="font-semibold text-[#061E47] text-lg group-hover:text-[#2B6AD0] transition-colors">
              {space.name}
            </h3>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#EBF2FC] text-[#1F4591]">
              {spaceTypeLabel(space.type)}
            </span>
          </div>
          <p className="text-sm text-[#4A5568] mt-1 line-clamp-1">
            {space.purpose}
          </p>
        </div>

        <div className="sm:text-right shrink-0">
          <div className="text-xl font-bold text-[#061E47] tracking-tight">
            {formatCurrency(space.savedAmount, space.currency)}
          </div>
          <div className="text-xs text-[#718096] font-medium">
            of {formatCurrency(space.targetAmount, space.currency)} ({pct}%)
          </div>
        </div>
      </div>

      <ProgressBar value={pct} showLabel={false} size="sm" />
    </Link>
  );
}

export default function AppHomePage() {
  const { state } = useApp();
  const router = useRouter();
  const { user, spaces } = state;

  if (!user) {
    return (
      <AppShell>
        <div className="py-20 text-center max-w-sm mx-auto">
          <h1 className="text-2xl font-semibold text-[#061E47] mb-3">Sign in to your account</h1>
          <p className="text-[#4A5568] text-sm mb-6">Access your savings spaces, records, and permissions.</p>
          <Button variant="primary" fullWidth onClick={() => router.push("/sign-in")}>
            Sign in
          </Button>
        </div>
      </AppShell>
    );
  }

  const mySpaces = spaces.filter((s) => s.type !== "campaign");
  const campaigns = spaces.filter((s) => s.type === "campaign");

  const totalsByCurrency = mySpaces.reduce<Record<string, number>>((acc, s) => {
    acc[s.currency] = (acc[s.currency] ?? 0) + s.savedAmount;
    return acc;
  }, {});

  const currencyList = Object.entries(totalsByCurrency);
  const totalSummaryString =
    currencyList.length > 0
      ? currencyList
          .map(([curr, amt]) => formatCurrency(amt, curr))
          .join(" · ")
      : "£0";

  return (
    <AppShell>
      {/* Header section with financial overview */}
      <div className="pb-8 border-b border-[#E2E8F0] mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#061E47] tracking-tight">
              Your savings spaces
            </h1>
            <p className="text-sm text-[#4A5568] mt-1.5">
              {totalSummaryString} total saved across {mySpaces.length}{" "}
              {mySpaces.length === 1 ? "space" : "spaces"}
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => router.push("/app/spaces/new")}
          >
            Create space
          </Button>
        </div>
      </div>

      {/* Savings spaces list */}
      {mySpaces.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-[#CBD5E0] rounded-xl px-4">
          <h2 className="text-lg font-semibold text-[#061E47] mb-2">No active savings spaces</h2>
          <p className="text-sm text-[#718096] mb-6 max-w-sm mx-auto">
            Create a space for what matters: a holiday, emergency savings, or an Ajo circle.
          </p>
          <Button variant="primary" onClick={() => router.push("/app/spaces/new")}>
            Create your first space
          </Button>
        </div>
      ) : (
        <section>
          <div className="divide-y divide-[#E2E8F0]">
            {mySpaces.map((space) => (
              <SpaceRow key={space.id} space={space} />
            ))}
          </div>
        </section>
      )}

      {/* Campaigns section */}
      {campaigns.length > 0 && (
        <section className="mt-16 pt-10 border-t border-[#E2E8F0]">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div>
              <h2 className="text-xl font-semibold text-[#061E47]">Public campaigns</h2>
              <p className="text-sm text-[#718096] mt-0.5">
                Fundraising initiatives collecting contributions from anyone.
              </p>
            </div>
          </div>
          <div className="divide-y divide-[#E2E8F0] mt-4">
            {campaigns.map((space) => (
              <SpaceRow key={space.id} space={space} />
            ))}
          </div>
        </section>
      )}
    </AppShell>
  );
}
