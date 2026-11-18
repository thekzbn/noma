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
  formatDate,
  progressPercent,
  spaceTypeLabel,
  type Transaction,
  type Space,
} from "@/lib/demo-data";

const DEMO_MEMBER_EMAILS = new Set([
  "adaeze@demo.example",
  "emeka@demo.example",
  "ngozi@demo.example",
  "folake@demo.example",
  "babs@demo.example",
  "ifeoma@demo.example",
  "giving@demo.example",
]);

function txStatusBadge(s: Transaction["status"]) {
  if (s === "completed")
    return (
      <span className="text-[#1E7A45] font-medium" aria-label="Status: Completed">
        ✓ Completed
      </span>
    );
  if (s === "failed")
    return (
      <span className="text-[#C0392B] font-medium" aria-label="Status: Failed">
        ✕ Failed
      </span>
    );
  if (s === "pending")
    return (
      <span className="text-[#2B6AD0] font-medium" aria-label="Status: Pending">
        Pending
      </span>
    );
  return (
    <span className="text-[#718096] font-medium" aria-label="Status: Expired">
      — Expired
    </span>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-[#061E47] tracking-tight">{title}</h2>
        {description && <p className="text-sm text-[#718096] mt-1">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function MemberRow({ member }: { member: Space["members"][0] }) {
  const isDemo = DEMO_MEMBER_EMAILS.has(member.email);
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-4">
      <div>
        <p className="text-base font-medium text-[#061E47]">{member.name}</p>
        <p className={`text-xs mt-0.5 ${isDemo ? "text-[#A0AEC0] font-mono" : "text-[#718096]"}`}>
          {member.email}
          {isDemo && (
            <span className="ml-1.5 not-italic font-sans text-[#A0AEC0]">(demo)</span>
          )}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-wrap sm:justify-end">
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#F7F9FC] text-[#4A5568] capitalize">
          {member.role}
        </span>
        {member.permissions.canContribute && (
          <span className="text-xs bg-[#EBF2FC] text-[#1F4591] px-2 py-0.5 rounded-full font-medium">
            can contribute
          </span>
        )}
        {member.permissions.canApprovePayouts && (
          <span className="text-xs bg-[#EBF2FC] text-[#1F4591] px-2 py-0.5 rounded-full font-medium">
            can approve payouts
          </span>
        )}
        {member.permissions.canInvite && (
          <span className="text-xs bg-[#EBF2FC] text-[#1F4591] px-2 py-0.5 rounded-full font-medium">
            can invite
          </span>
        )}
        {member.permissions.canView && !member.permissions.canContribute && (
          <span className="text-xs bg-[#F7F9FC] text-[#718096] px-2 py-0.5 rounded-full">
            view only
          </span>
        )}
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
  const { state, approvePayout, rejectPayout, showToast } = useApp();
  const { user } = useAuth();

  const space = state.spaces.find((s) => s.id === id);

  if (!user) {
    return (
      <AppShell>
        <div className="py-20 text-center max-w-sm mx-auto">
          <h1 className="text-2xl font-semibold text-[#061E47] mb-3">Sign in required</h1>
          <p className="text-[#4A5568] text-sm mb-6">Sign in to view this savings space.</p>
          <Button variant="primary" fullWidth onClick={() => router.push("/sign-in")}>
            Sign in
          </Button>
        </div>
      </AppShell>
    );
  }

  if (!space) {
    return (
      <AppShell>
        <div className="py-20 text-center max-w-sm mx-auto">
          <h1 className="text-2xl font-semibold text-[#061E47] mb-2">Space not found</h1>
          <p className="text-[#4A5568] text-sm mb-6">
            This space does not exist or you do not have permission to view it.
          </p>
          <Link href="/app" className="text-[#2B6AD0] font-medium hover:underline text-sm">
            Back to your spaces
          </Link>
        </div>
      </AppShell>
    );
  }

  const pct = progressPercent(space.savedAmount, space.targetAmount);
  const myMember = space.members.find(
    (m) =>
      (user?.email && m.email.toLowerCase() === user.email.toLowerCase()) ||
      (user?.id && m.id === user.id) ||
      m.id === "member-me"
  );
  const canContribute = myMember?.permissions.canContribute ?? false;
  const canRequestPayout = myMember?.permissions.canRequestPayouts ?? false;
  const canInvite = myMember?.permissions.canInvite ?? false;
  const canApprovePayout = myMember?.permissions.canApprovePayouts ?? false;

  const sortedTx = [...space.transactions].sort((a, b) =>
    a.date < b.date ? 1 : -1
  );

  // Pending approvals first, then the rest
  const pendingPayouts = space.payoutRequests.filter((p) => p.status === "pending");
  const otherPayouts = space.payoutRequests.filter((p) => p.status !== "pending");

  return (
    <AppShell>
      {/* Navigation back */}
      <Link
        href="/app"
        className="text-sm font-medium text-[#2B6AD0] hover:text-[#1F4591] mb-6 inline-flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded"
      >
        ← All spaces
      </Link>

      {/* Main Space Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap mb-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#061E47] tracking-tight">
                {space.name}
              </h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EBF2FC] text-[#1F4591]">
                {spaceTypeLabel(space.type)}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E8F5EE] text-[#1E7A45] capitalize">
                {space.status}
              </span>
            </div>
            <p className="text-base text-[#4A5568] leading-relaxed max-w-2xl">
              {space.purpose}
            </p>
          </div>

          {space.isPublic && (
            <Link
              href={`/campaign/${space.id}`}
              className="text-xs font-medium text-[#2B6AD0] hover:underline shrink-0"
            >
              Open public campaign view →
            </Link>
          )}
        </div>

        {/* Financial Core Summary */}
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-[#061E47] tracking-tight">
                {formatCurrency(space.savedAmount, space.currency)}
              </span>
              <span className="text-base font-medium text-[#718096]">
                saved of {formatCurrency(space.targetAmount, space.currency)}
              </span>
            </div>
            <div className="text-sm font-semibold text-[#1F4591]">
              {pct}% towards goal
            </div>
          </div>

          <ProgressBar
            value={pct}
            showLabel={false}
            size="md"
            ariaLabel={`${space.name}: ${pct}% of ${formatCurrency(space.targetAmount, space.currency)} saved`}
          />

          {/* Key Parameters */}
          <div className="flex flex-wrap gap-x-8 gap-y-2 mt-4 text-sm text-[#4A5568]">
            {space.targetDate && (
              <div>
                <span className="text-[#718096]">Target date: </span>
                <span className="font-medium text-[#061E47]">{formatDate(space.targetDate)}</span>
              </div>
            )}
            {space.endDate && (
              <div>
                <span className="text-[#718096]">Campaign concludes: </span>
                <span className="font-medium text-[#061E47]">{formatDate(space.endDate)}</span>
              </div>
            )}
            {space.type === "community" && space.contributionCycle && (
              <div>
                <span className="text-[#718096]">Cycle payment: </span>
                <span className="font-medium text-[#061E47]">
                  {formatCurrency(space.cycleAmount ?? 0, space.currency)} ({space.contributionCycle})
                </span>
              </div>
            )}
            {space.governanceThreshold && (
              <div>
                <span className="text-[#718096]">Governance rule: </span>
                <span className="font-medium text-[#061E47]">
                  {space.governanceThreshold} member approvals required
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Primary and Secondary Actions */}
        <div className="flex flex-wrap items-center gap-3 mt-8">
          {canContribute && (
            <Button
              variant="primary"
              size="md"
              onClick={() => router.push(`/app/spaces/${id}/contribute`)}
            >
              Add money
            </Button>
          )}
          {canRequestPayout && (
            <Button
              variant="secondary"
              size="md"
              onClick={() => router.push(`/app/spaces/${id}/payout`)}
            >
              Request payout
            </Button>
          )}
          {canInvite && (
            <Button
              variant="ghost"
              size="md"
              onClick={() => router.push(`/app/spaces/${id}/invite`)}
            >
              Invite someone
            </Button>
          )}
          <Button
            variant="ghost"
            size="md"
            onClick={() => router.push(`/app/spaces/${id}/permissions`)}
          >
            Permissions
          </Button>
        </div>
      </div>

      {/* Pending payout approvals — elevated */}
      {pendingPayouts.length > 0 && (
        <Section
          title="Pending approvals"
          description="Payout requests waiting for member votes."
        >
          <div className="flex flex-col gap-4">
            {pendingPayouts.map((req) => {
              const hasApproved =
                req.approvalsReceived.includes(myMember?.name ?? "") ||
                req.approvalsReceived.includes(myMember?.id ?? "") ||
                req.approvalsReceived.includes("member-me");

              return (
                <div
                  key={req.id}
                  className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[#061E47]">
                        {formatCurrency(req.amount, req.currency)}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-[#FFF3CD] text-[#856404]">
                        Pending
                      </span>
                    </div>
                    <p className="text-sm text-[#4A5568] mt-1">{req.reason}</p>
                    <p className="text-xs text-[#718096] mt-0.5">
                      Requested by {req.requestedBy} · to {req.destination} · {formatDate(req.requestedAt)}
                    </p>
                    {req.approvalsRequired > 0 && (
                      <p className="text-xs text-[#1F4591] mt-1">
                        {req.approvalsReceived.length} of {req.approvalsRequired} approvals confirmed
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 sm:shrink-0">
                    {canApprovePayout && (
                      <>
                        {hasApproved ? (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E8F5EE] text-[#1E7A45]">
                            ✓ Approved by you
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                approvePayout(space.id, req.id, myMember?.name ?? "You");
                                showToast("Payout request approved.", "success");
                              }}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                rejectPayout(space.id, req.id);
                                showToast("Payout request rejected.", "info");
                              }}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Rules */}
      {space.rules.length > 0 && (
        <Section
          title="Rules of this space"
          description="Conditions agreed upon by members for saving and withdrawing."
        >
          <ul className="flex flex-col gap-2.5">
            {space.rules.map((rule, idx) => (
              <li key={idx} className="text-sm text-[#061E47] flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2B6AD0] mt-2 shrink-0" />
                <span className="leading-relaxed">{rule}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Members & Permissions */}
      <Section
        title="Members & permissions"
        description="People who belong to this space and what they are authorised to do."
      >
        <div className="flex flex-col">
          {space.members.map((member) => (
            <MemberRow key={member.id} member={member} />
          ))}
        </div>
      </Section>

      {/* Other payout requests (non-pending) */}
      {otherPayouts.length > 0 && (
        <Section
          title="Payout history"
          description="Previously processed payout requests."
        >
          <div className="flex flex-col gap-4">
            {otherPayouts.map((req) => (
              <div key={req.id} className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[#061E47]">
                      {formatCurrency(req.amount, req.currency)}
                    </span>
                    <span
                      className={[
                        "text-xs px-2 py-0.5 rounded-full font-medium capitalize",
                        req.status === "approved"
                          ? "bg-[#E8F5EE] text-[#1E7A45]"
                          : req.status === "rejected"
                          ? "bg-[#FFECE8] text-[#C0392B]"
                          : "bg-[#F7F9FC] text-[#718096]",
                      ].join(" ")}
                    >
                      {req.status === "approved" ? "✓ Approved" : req.status === "rejected" ? "✕ Rejected" : req.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#4A5568] mt-1">{req.reason}</p>
                  <p className="text-xs text-[#718096] mt-0.5">
                    Requested by {req.requestedBy} · to {req.destination} · {formatDate(req.requestedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Ledger & Activity */}
      <Section
        title="Activity ledger"
        description="Chronological record of every contribution and disbursement."
      >
        {sortedTx.length === 0 ? (
          <p className="text-sm text-[#718096]">
            No activity recorded yet.{" "}
            {canContribute && (
              <Link
                href={`/app/spaces/${id}/contribute`}
                className="text-[#2B6AD0] hover:underline font-medium"
              >
                Add the first contribution.
              </Link>
            )}
          </p>
        ) : (
          <div className="flex flex-col">
            {sortedTx.map((tx) => (
              <div
                key={tx.id}
                className="py-3 flex items-center justify-between gap-4 text-sm"
              >
                <div>
                  <div className="font-medium text-[#061E47]">
                    {tx.type === "contribution" ? "Contribution" : tx.type === "payout" ? "Payout" : "Donation"}
                    {tx.memberName ? ` by ${tx.memberName}` : ""}
                  </div>
                  {tx.note && <div className="text-xs text-[#718096] mt-0.5">{tx.note}</div>}
                  <div className="text-xs text-[#CBD5E0] font-mono mt-0.5">{tx.reference}</div>
                </div>
                <div className="text-right shrink-0">
                  <div
                    className={[
                      "font-semibold",
                      tx.type === "contribution" ? "text-[#1E7A45]" : "text-[#061E47]",
                    ].join(" ")}
                  >
                    {tx.type === "contribution" ? "+" : "-"}
                    {formatCurrency(tx.amount, tx.currency)}
                  </div>
                  <div className="text-xs mt-0.5">{txStatusBadge(tx.status)}</div>
                  <div className="text-xs text-[#718096]">{formatDate(tx.date)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </AppShell>
  );
}
