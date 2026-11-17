"use client";

import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/lib/store";
import Link from "next/link";
import { formatCurrency, statusLabel, type Transaction } from "@/lib/demo-data";

function txStatusClass(status: Transaction["status"]): string {
  if (status === "completed") return "text-[#3CB371]";
  if (status === "failed") return "text-[#FF6347]";
  if (status === "pending") return "text-[#2B6AD0]";
  return "text-[#718096]";
}

export default function ActivityPage() {
  const { state } = useApp();
  const { spaces, user } = state;

  if (!user) {
    return (
      <AppShell>
        <p className="text-[#4A5568]">
          <Link href="/sign-in" className="text-[#2B6AD0]">Sign in</Link> to view your activity.
        </p>
      </AppShell>
    );
  }

  // Gather all transactions across all spaces, most recent first
  type TxWithSpace = Transaction & { spaceName: string; spaceId: string };
  const allTx: TxWithSpace[] = spaces
    .flatMap((s) =>
      s.transactions.map((tx) => ({
        ...tx,
        spaceName: s.name,
        spaceId: s.id,
      }))
    )
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold text-[#061E47] tracking-tight mb-2">Activity</h1>
      <p className="text-sm text-[#718096] mb-8">
        All contributions and payouts across your spaces.{" "}
        <span className="demo-badge">Demo data</span>
      </p>

      {allTx.length === 0 ? (
        <p className="text-[#4A5568] py-10 text-center">No activity yet.</p>
      ) : (
        <div className="divide-y divide-[#E2E8F0]">
          {allTx.map((tx) => (
            <div key={tx.id} className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link
                    href={`/app/spaces/${tx.spaceId}`}
                    className="text-xs font-medium text-[#2B6AD0] hover:text-[#1F4591] mb-0.5 block"
                  >
                    {tx.spaceName}
                  </Link>
                  <p className="text-sm text-[#061E47] font-medium capitalize">
                    {tx.type}
                    {tx.memberName ? ` — ${tx.memberName}` : ""}
                  </p>
                  {tx.note && (
                    <p className="text-xs text-[#718096] mt-0.5">{tx.note}</p>
                  )}
                  <p className="text-xs text-[#718096] mt-0.5">{tx.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-[#061E47]">
                    {formatCurrency(tx.amount, tx.currency)}
                  </p>
                  <p className={`text-xs font-medium ${txStatusClass(tx.status)}`}>
                    {statusLabel(tx.status)}
                  </p>
                  <p className="text-xs text-[#718096] mt-0.5">{tx.reference}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
