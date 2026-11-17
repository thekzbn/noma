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
      className="block py-5 hover:bg-[#F7F9FC] -mx-5 px-5 transition-colors rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0]"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <span className="text-xs font-medium text-[#718096] block mb-0.5">
            {spaceTypeLabel(space.type)}
          </span>
          <h3 className="font-semibold text-[#061E47] text-base">{space.name}</h3>
          <p className="text-sm text-[#4A5568] mt-0.5 line-clamp-1">{space.purpose}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="font-semibold text-[#061E47] text-base">
            {formatCurrency(space.savedAmount, space.currency)}
          </div>
          <div className="text-xs text-[#718096]">
            of {formatCurrency(space.targetAmount, space.currency)}
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

  // Redirect to sign-in if not authenticated
  if (!user) {
    return (
      <AppShell>
        <div className="py-16 text-center">
          <p className="text-[#4A5568] mb-4">Sign in to view your spaces.</p>
          <Button variant="primary" onClick={() => router.push("/sign-in")}>
            Sign in
          </Button>
        </div>
      </AppShell>
    );
  }

  const mySpaces = spaces.filter((s) => s.type !== "campaign");
  const campaigns = spaces.filter((s) => s.type === "campaign");

  return (
    <AppShell>
      <div className="flex items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-semibold text-[#061E47] tracking-tight">
            Your spaces
          </h1>
          <p className="text-sm text-[#718096] mt-1">
            <span className="demo-badge">Demo</span>
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push("/app/spaces/new")}
        >
          New space
        </Button>
      </div>

      {/* Savings spaces */}
      {mySpaces.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-[#CBD5E0] rounded-xl">
          <p className="text-[#4A5568] mb-2 font-medium">No spaces yet</p>
          <p className="text-sm text-[#718096] mb-6" style={{ maxWidth: "36ch", margin: "0 auto 1.5rem" }}>
            Create a space for a goal — a holiday fund, a group savings circle,
            or anything else that matters.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="primary" onClick={() => router.push("/app/spaces/new")}>
              Create a space
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push("/invite/inv-abc123")}
            >
              Join with an invite
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="divide-y divide-[#E2E8F0]">
            {mySpaces.map((space) => (
              <SpaceRow key={space.id} space={space} />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push("/app/spaces/new")}
            >
              Create another space
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/invite/inv-abc123")}
            >
              Join with an invite
            </Button>
          </div>
        </div>
      )}

      {/* Campaigns section */}
      {campaigns.length > 0 && (
        <section className="mt-14">
          <h2 className="text-base font-semibold text-[#061E47] mb-1">Campaigns</h2>
          <p className="text-sm text-[#718096] mb-5">
            Fundraising campaigns you&apos;re running.
          </p>
          <div className="divide-y divide-[#E2E8F0]">
            {campaigns.map((space) => (
              <SpaceRow key={space.id} space={space} />
            ))}
          </div>
        </section>
      )}
    </AppShell>
  );
}
