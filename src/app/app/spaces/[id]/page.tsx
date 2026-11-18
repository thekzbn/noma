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

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="pt-10 border-t border-[#E2E8F0] mt-10">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-[#061E47] tracking-tight">{title}</h2>
        {description && <p className="text-sm text-[#718096] mt-1">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function MemberRow({ member }: { member: Space["members"][0] }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-4">
      <div>
        <p className="text-base font-medium text-[#061E47]">{member.name}</p>
        <p className="text-xs text-[#718096]">{member.email}</p>
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
          <p className="text-[#4A5568] text-sm mb-6">This space does not exist or you do not have permission to view it.</p>
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
      <div className="pb-8 border-b border-[#E2E8F0]">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap mb-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#061E47] tracking-tight">
                {space.name}
              </h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EBF2FC] text-[#1F4591]">
                {spaceTypeLabel(space.type)}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E8F5EE] text-[#2D7D4E]">
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
              Open public campaign view ↗
            </Link>
          )}
        </div>

        {/* Financial Core Summary */}
        <div className="mt-8 pt-8 border-t border-[#E2E8F0]">
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

          <ProgressBar value={pct} size="md" />

          {/* Key Parameters */}
          <div className="flex flex-wrap gap-x-8 gap-y-2 mt-4 text-sm text-[#4A5568]">
            {space.targetDate && (
              <div>
                <span className="text-[#718096]">Target date: </span>
                <span className="font-medium text-[#061E47]">{space.targetDate}</span>
              </div>
            )}
            {space.endDate && (
              <div>
                <span className="text-[#718096]">Campaign concludes: </span>
                <span className="font-medium text-[#061E47]">{space.endDate}</span>
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

      {/* Rules */}
      {space.rules.length > 0 && (
        <Section title="Rules of this space" description="Conditions agreed upon by members for saving and withdrawing.">
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
      <Section title="Members & permissions" description="People who belong to this space and what they are authorised to do.">
        <div className="divide-y divide-[#E2E8F0]">
          {space.members.map((member) => (
            <MemberRow key={member.id} member={member} />
          ))}
        </div>
      </Section>

      {/* Payout requests */}
      {space.payoutRequests.length > 0 && (
        <Section title="Payout requests" description="Withdrawal requests waiting for approval or recently processed.">
          <div className="divide-y divide-[#E2E8F0]">
            {space.payoutRequests.map((req) => {
              const hasApproved =
                req.approvalsReceived.includes(myMember?.name ?? "") ||
                req.approvalsReceived.includes(myMember?.id ?? "") ||
                req.approvalsReceived.includes("member-me");

              return (
                <div key={req.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[#061E47]">
                        {formatCurrency(req.amount, req.currency)}
                      </span>
                      <span
                        className={[
                          "text-xs px-2 py-0.5 rounded-full font-medium capitalize",
                          req.status === "approved"
                            ? "bg-[#E8F5EE] text-[#2D7D4E]"
                            : req.status === "rejected"
                            ? "bg-[#FFECE8] text-[#FF6347]"
                            : "bg-[#FFF3CD] text-[#856404]",
                        ].join(" ")}
                      >
                        {req.status}
                      </span>
                    </div>
                    <p className="text-sm text-[#4A5568] mt-1">{req.reason}</p>
                    <p className="text-xs text-[#718096] mt-0.5">
                      Requested by {req.requestedBy} for {req.destination}
                    </p>
                    {req.approvalsRequired > 0 && (
                      <p className="text-xs text-[#1F4591] mt-1">
                        {req.approvalsReceived.length} of {req.approvalsRequired} approvals confirmed
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 sm:shrink-0">
                    {req.status === "pending" && canApprovePayout && (
                      <>
                        {hasApproved ? (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E8F5EE] text-[#2D7D4E]">
                            Approved by you
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

      {/* Ledger & Activity */}
      <Section title="Activity ledger" description="Chronological record of every contribution and disbursement.">
        {sortedTx.length === 0 ? (
          <p className="text-sm text-[#718096]">No activity recorded yet.</p>
        ) : (
          <div className="divide-y divide-[#E2E8F0]">
            {sortedTx.map((tx) => (
              <div
                key={tx.id}
                className="py-3.5 flex items-center justify-between gap-4 text-sm"
              >
                <div>
                  <div className="font-medium text-[#061E47]">
                    {tx.type === "contribution" ? "Contribution" : "Payout"}
                    {tx.memberName ? ` by ${tx.memberName}` : ""}
                  </div>
                  {tx.note && <div className="text-xs text-[#718096] mt-0.5">{tx.note}</div>}
                  <div className="text-xs text-[#CBD5E0] font-mono mt-0.5">{tx.reference}</div>
                </div>
                <div className="text-right shrink-0">
                  <div
                    className={[
                      "font-semibold",
                      tx.type === "contribution" ? "text-[#3CB371]" : "text-[#061E47]",
                    ].join(" ")}
                  >
                    {tx.type === "contribution" ? "+" : "-"}
                    {formatCurrency(tx.amount, tx.currency)}
                  </div>
                  <div className={`text-xs capitalize font-medium ${txStatusClass(tx.status)}`}>
                    {statusLabel(tx.status)}
                  </div>
                  <div className="text-xs text-[#718096]">{tx.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </AppShell>
  );
}
