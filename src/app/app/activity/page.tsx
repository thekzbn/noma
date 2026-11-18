"use client";

import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/lib/store";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate, type Transaction } from "@/lib/demo-data";
import { useRouter } from "next/navigation";

function txStatusBadge(status: Transaction["status"]): React.ReactNode {
  if (status === "completed")
    return <span className="text-[#1E7A45] font-medium">✓ Completed</span>;
  if (status === "failed")
    return <span className="text-[#C0392B] font-medium">✕ Failed</span>;
  if (status === "pending")
    return <span className="text-[#2B6AD0] font-medium">Pending</span>;
  return <span className="text-[#718096] font-medium">— Expired</span>;
}

export default function ActivityPage() {
  const { state } = useApp();
  const { spaces, user } = state;
  const router = useRouter();

  if (!user) {
    return (
      <AppShell>
        <div className="py-20 text-center max-w-sm mx-auto">
          <h1 className="text-2xl font-semibold text-[#061E47] mb-3">Sign in required</h1>
          <p className="text-[#4A5568] text-sm mb-6">Sign in to view transaction history and ledgers.</p>
          <Button variant="primary" fullWidth onClick={() => router.push("/sign-in")}>
            Sign in
          </Button>
        </div>
      </AppShell>
    );
  }

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
      <div className="pb-10 mb-10">
        <h1 className="text-3xl font-bold text-[#061E47] tracking-tight">
          Activity ledger
        </h1>
        <p className="text-sm text-[#718096] mt-1.5">
          All verified contributions and payouts across your savings spaces.
        </p>
      </div>

      {allTx.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-[#CBD5E0] rounded-xl px-4">
          <p className="text-[#4A5568] text-base font-medium mb-1">No transaction records yet</p>
          <p className="text-sm text-[#718096] mb-6">
            Activity will appear here once you contribute to a space.
          </p>
          <Button variant="primary" onClick={() => router.push("/app")}>
            Go to your spaces
          </Button>
        </div>
      ) : (
        <div className="flex flex-col">
          {allTx.map((tx) => (
            <div key={tx.id} className="py-5 border-b border-[#F0F4F8] last:border-0">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-base text-[#061E47] font-semibold capitalize leading-snug">
                    {tx.type}{tx.memberName ? ` – ${tx.memberName}` : ""}
                  </p>
                  <p className="text-sm text-[#718096] mt-0.5">
                    <Link
                      href={`/app/spaces/${tx.spaceId}`}
                      className="hover:text-[#1F4591] transition-colors"
                    >
                      {tx.spaceName}
                    </Link>
                    {tx.note ? ` · ${tx.note}` : ""}
                  </p>
                  <p className="text-xs text-[#A0AEC0] font-mono mt-1">
                    {tx.reference} &middot; {formatDate(tx.date)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={[
                      "text-base font-bold",
                      tx.type === "contribution" ? "text-[#1E7A45]" : "text-[#061E47]",
                    ].join(" ")}
                  >
                    {tx.type === "contribution" ? "+" : "-"}
                    {formatCurrency(tx.amount, tx.currency)}
                  </span>
                  <p className="text-xs mt-0.5">{txStatusBadge(tx.status)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
