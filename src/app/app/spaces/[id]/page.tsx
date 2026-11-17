"use client";

import { use } from "react";
import { useApp, useAuth } from "@/lib/store";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  formatCurrency,
  progressPercent,
  spaceTypeLabel,
  statusLabel,
  type Transaction,
  type Space,
} from "@/lib/demo-data";

function txStatusClass(s: Transaction["status"]) {
  if (s === "completed") return "text-[#3CB371]";
  if (s === "failed") return "text-[#FF6347]";
  if (s === "pending") return "text-[#2B6AD0]";
  return "text-[#718096]";
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="pt-8 border-t border-[#E2E8F0]">
      <h2 className="text-base font-semibold text-[#061E47] mb-4">{title}</h2>
      {children}
    </section>
  );
}

function MemberRow({ member }: { member: Space["members"][0] }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-[#061E47]">{member.name}</p>
        <p className="text-xs text-[#718096]">{member.email}</p>
      </div>
      <div className="text-right">
        <span className="text-xs font-medium text-[#4A5568] capitalize">{member.role}</span>
        <div className="flex gap-1.5 mt-1 flex-wrap justify-end">
          {member.permissions.canContribute && (
            <span className="text-xs bg-[#EBF2FC] text-[#1F4591] px-2 py-0.5 rounded-full">contributes</span>
          )}
          {member.permissions.canApprovePayouts && (
            <span className="text-xs bg-[#EBF2FC] text-[#1F4591] px-2 py-0.5 rounded-full">approves payouts</span>
          )}
          {member.permissions.canView && !member.permissions.canContribute && (
            <span className="text-xs bg-[#F7F9FC] text-[#718096] px-2 py-0.5 rounded-full">view only</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SpaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { state } = useApp();
  const { user } = useAuth();
  const space = state.spaces.find((s) => s.id === id);

  if (!user) {
    return (
      <AppShell>
        <p className="text-[#4A5568]">
          <Link href="/sign-in" className="text-[#2B6AD0]">Sign in</Link> to view spaces.
        </p>
      </AppShell>
    );
  }

  if (!space) {
    return (
      <AppShell>
        <p className="text-[#4A5568] mb-4">This space doesn&apos;t exist or you don&apos;t have access.</p>
        <Link href="/app" className="text-[#2B6AD0] text-sm">Back to spaces</Link>
      </AppShell>
    );
  }

  const pct = progressPercent(space.savedAmount, space.targetAmount);
  const myMember = space.members.find((m) => m.id === "member-me");
  const canContribute = myMember?.permissions.canContribute ?? false;
  const canRequestPayout = myMember?.permissions.canRequestPayouts ?? false;
  const canInvite = myMember?.permissions.canInvite ?? false;

  const sortedTx = [...space.transactions].sort((a, b) =>
    a.date < b.date ? 1 : -1
  );

  return (
    <AppShell>
      {/* Back */}
      <Link
        href="/app"
        className="text-sm text-[#2B6AD0] hover:text-[#1F4591] mb-6 flex items-center gap-1 w-fit focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded"
      >
        ← Spaces
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-[#718096] block mb-1">
              {spaceTypeLabel(space.type)}
            </span>
            <h1 className="text-2xl font-semibold text-[#061E47] tracking-tight">
              {space.name}
            </h1>
            {space.isPublic && (
              <div className="mt-2">
                <Link
                  href={`/campaign/${space.id}`}
                  className="text-xs text-[#2B6AD0] hover:text-[#1F4591]"
                >
                  View public campaign page
                </Link>
              </div>
            )}
          </div>
          <span className={[
            "text-xs font-medium px-2.5 py-1 rounded-full shrink-0",
            space.status === "active"
              ? "bg-[#E8F5EE] text-[#2D7D4E]"
              : space.status === "completed"
              ? "bg-[#EBF2FC] text-[#1F4591]"
              : "bg-[#F7F9FC] text-[#718096]",
          ].join(" ")}>
            {space.status}
          </span>
        </div>
      </div>

      {/* Goal & progress */}
      <div className="mb-8">
        <p className="text-[#4A5568] text-sm leading-relaxed mb-5" style={{ maxWidth: "58ch" }}>
          {space.purpose}
        </p>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-3xl font-semibold text-[#061E47] tracking-tight">
            {formatCurrency(space.savedAmount, space.currency)}
          </span>
          <span className="text-sm text-[#718096] mb-1">
            saved of {formatCurrency(space.targetAmount, space.currency)}
          </span>
        </div>
        <ProgressBar value={pct} />
        <div className="flex gap-6 mt-3 text-sm text-[#718096]">
          {space.targetDate && (
            <span>Target date: {space.targetDate}</span>
          )}
          {space.endDate && <span>Ends: {space.endDate}</span>}
          {space.type === "community" && space.contributionCycle && (
            <span>
              {formatCurrency(space.cycleAmount ?? 0, space.currency)} /{" "}
              {space.contributionCycle}
            </span>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-2">
        {canContribute && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push(`/app/spaces/${id}/contribute`)}
          >
            Contribute
          </Button>
        )}
        {canRequestPayout && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push(`/app/spaces/${id}/payout`)}
          >
            Request payout
          </Button>
        )}
        {canInvite && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/app/spaces/${id}/invite`)}
          >
            Invite people
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/app/spaces/${id}/permissions`)}
        >
          Permissions
        </Button>
      </div>

      {/* Rules */}
      {space.rules.length > 0 && (
        <Section title="Rules">
          <ul className="flex flex-col gap-1.5">
            {space.rules.map((rule) => (
              <li key={rule} className="text-sm text-[#4A5568] flex gap-2">
                <span className="text-[#CBD5E0] mt-0.5">—</span>
                {rule}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Members */}
      <Section title={`Members (${space.members.length})`}>
        <div className="divide-y divide-[#E2E8F0]">
          {space.members.map((m) => (
            <MemberRow key={m.id} member={m} />
          ))}
        </div>
      </Section>

      {/* Governance — community / shared */}
      {space.type === "community" && space.payoutRequests.length > 0 && (
        <Section title="Payout requests">
          <div className="flex flex-col gap-4">
            {space.payoutRequests.map((pr) => (
              <div key={pr.id} className="py-4 border-b border-[#E2E8F0]">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <p className="text-sm font-medium text-[#061E47]">
                      {formatCurrency(pr.amount, pr.currency)} to {pr.requestedBy}
                    </p>
                    <p className="text-xs text-[#718096]">{pr.reason}</p>
                    <p className="text-xs text-[#718096] mt-0.5">
                      Requested {pr.requestedAt}
                    </p>
                  </div>
                  <span
                    className={[
                      "text-xs font-medium px-2.5 py-1 rounded-full shrink-0",
                      pr.status === "pending"
                        ? "bg-[#FFF3CD] text-[#856404]"
                        : pr.status === "approved"
                        ? "bg-[#E8F5EE] text-[#2D7D4E]"
                        : "bg-[#F7F9FC] text-[#718096]",
                    ].join(" ")}
                  >
                    {pr.status}
                  </span>
                </div>
                <p className="text-xs text-[#4A5568]">
                  {pr.approvalsReceived.length} of {pr.approvalsRequired} approvals received
                </p>
                {pr.status === "pending" && canContribute && (
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        // Demo: show approved state
                      }}
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Donor list (campaigns) */}
      {space.type === "campaign" && space.donors && space.donors.length > 0 && (
        <Section title="Contributions">
          <div className="divide-y divide-[#E2E8F0]">
            {space.donors.map((d) => (
              <div key={d.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-[#061E47]">{d.displayName}</p>
                  <p className="text-xs text-[#718096]">{d.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#061E47]">
                    {formatCurrency(d.amount, d.currency)}
                  </p>
                  <p className={`text-xs font-medium ${txStatusClass(d.status)}`}>
                    {statusLabel(d.status)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Activity ledger */}
      {sortedTx.length > 0 && (
        <Section title="Activity ledger">
          <div className="divide-y divide-[#E2E8F0]">
            {sortedTx.map((tx) => (
              <div key={tx.id} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-[#061E47] font-medium capitalize">
                    {tx.type}
                    {tx.memberName ? ` — ${tx.memberName}` : ""}
                  </p>
                  {tx.note && (
                    <p className="text-xs text-[#718096] mt-0.5">{tx.note}</p>
                  )}
                  <p className="text-xs text-[#718096] mt-0.5">{tx.date}</p>
                  <p className="text-xs text-[#CBD5E0]">{tx.reference}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-[#061E47]">
                    {formatCurrency(tx.amount, tx.currency)}
                  </p>
                  <p className={`text-xs font-medium ${txStatusClass(tx.status)}`}>
                    {statusLabel(tx.status)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {sortedTx.length === 0 && (
        <Section title="Activity ledger">
          <p className="text-sm text-[#718096]">No transactions yet.</p>
        </Section>
      )}
    </AppShell>
  );
}
