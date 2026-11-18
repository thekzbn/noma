"use client";

import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/lib/store";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatCurrency, statusLabel, type Transaction } from "@/lib/demo-data";
import { useRouter } from "next/navigation";

function txStatusClass(status: Transaction["status"]): string {
  if (status === "completed") return "text-[#3CB371]";
  if (status === "failed") return "text-[#FF6347]";
  if (status === "pending") return "text-[#2B6AD0]";
  return "text-[#718096]";
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
      <div className="pb-8 border-b border-[#E2E8F0] mb-8">
        <h1 className="text-3xl font-bold text-[#061E47] tracking-tight">
          Activity ledger
        </h1>
        <p className="text-sm text-[#4A5568] mt-1.5">
          All verified contributions and payouts across your savings spaces.
        </p>
      </div>

      {allTx.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-[#CBD5E0] rounded-xl px-4">
          <p className="text-[#4A5568] text-base font-medium mb-1">No transaction records yet</p>
          <p className="text-sm text-[#718096]">Activity will appear here as soon as you contribute to a space.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#E2E8F0]">
          {allTx.map((tx) => (
            <div key={tx.id} className="py-4 hover:bg-[#F7F9FC] -mx-4 px-4 rounded-xl transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link
                    href={`/app/spaces/${tx.spaceId}`}
                    className="text-xs font-semibold text-[#2B6AD0] hover:underline mb-1 block"
                  >
                    {tx.spaceName}
                  </Link>
                  <p className="text-base text-[#061E47] font-medium capitalize">
                    {tx.type}
                    {tx.memberName ? ` (${tx.memberName})` : ""}
                  </p>
                  {tx.note && (
                    <p className="text-xs text-[#718096] mt-0.5">{tx.note}</p>
                  )}
                  <p className="text-xs text-[#A0AEC0] font-mono mt-1">
                    {tx.reference} · {tx.date}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={[
                      "text-base font-bold",
                      tx.type === "contribution" ? "text-[#3CB371]" : "text-[#061E47]",
                    ].join(" ")}
                  >
                    {tx.type === "contribution" ? "+" : "-"}
                    {formatCurrency(tx.amount, tx.currency)}
                  </span>
                  <p className={`text-xs capitalize font-medium mt-0.5 ${txStatusClass(tx.status)}`}>
                    {statusLabel(tx.status)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
