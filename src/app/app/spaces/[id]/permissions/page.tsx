"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useSpaces, useApp } from "@/lib/store";
import { type Member } from "@/lib/demo-data";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";

type PermKey =
  | "canView"
  | "canContribute"
  | "canInvite"
  | "canApprovePayouts"
  | "canRequestPayouts";

const PERM_LABELS: Record<PermKey, string> = {
  canView: "View",
  canContribute: "Contribute",
  canInvite: "Invite",
  canRequestPayouts: "Request payouts",
  canApprovePayouts: "Approve payouts",
};

export default function PermissionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { spaces, updateSpace } = useSpaces();
  const { showToast } = useApp();

  const space = spaces.find((s) => s.id === id);
  const [members, setMembers] = useState<Member[]>(() => space?.members ?? []);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  if (!space) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto py-16 text-center">
          <p className="text-[#061E47] mb-4">Space not found.</p>
          <Link
            href="/app"
            className="text-[#2B6AD0] hover:underline text-sm font-medium"
          >
            Back to spaces
          </Link>
        </div>
      </AppShell>
    );
  }

  const currentSpace = space;

  function togglePerm(memberId: string, perm: PermKey) {
    if (perm === "canView") return;
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              permissions: {
                ...m.permissions,
                [perm]: !m.permissions[perm],
              },
            }
          : m
      )
    );
    setSaved(false);
  }

  function handleRemove(memberId: string) {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    setConfirmRemove(null);
    setSaved(false);
  }

  function handleSave() {
    updateSpace({ ...currentSpace, members });
    showToast("Permissions updated.", "success");
    setSaved(true);
  }

  const ownerMember = members.find((m) => m.role === "owner");
  const editableMembers = members.filter((m) => m.role !== "owner");

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto py-6">
        <Link
          href={`/app/spaces/${id}`}
          className="text-sm font-medium text-[#2B6AD0] hover:text-[#1F4591] mb-6 inline-flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded"
        >
          ← {space.name}
        </Link>

        <h1 className="text-2xl font-bold text-[#061E47] tracking-tight mb-1.5">
          Permissions
        </h1>
        <p className="text-sm text-[#4A5568] mb-8 leading-relaxed">
          Control what each member is authorised to do in this space.
        </p>

        {/* Owner */}
        {ownerMember && (
          <section className="mb-10">
            <h2 className="text-base font-semibold text-[#061E47] mb-3">
              Owner
            </h2>
            <div className="flex items-center justify-between py-3.5 border-b border-[#E2E8F0]">
              <div>
                <div className="font-semibold text-sm text-[#061E47]">
                  {ownerMember.name}
                </div>
                <div className="text-xs text-[#718096] mt-0.5">
                  Full administrative authority (cannot be removed)
                </div>
              </div>
              <span className="text-xs bg-[#EBF2FC] text-[#1F4591] px-2.5 py-0.5 rounded-full font-semibold">
                Owner
              </span>
            </div>
          </section>
        )}

        {/* Editable members */}
        <section className="mb-10">
          <h2 className="text-base font-semibold text-[#061E47] mb-3">
            Members ({editableMembers.length})
          </h2>

          {editableMembers.length === 0 && (
            <p className="text-sm text-[#4A5568]">
              No other members yet.{" "}
              <Link
                href={`/app/spaces/${id}/invite`}
                className="text-[#2B6AD0] hover:underline font-medium"
              >
                Invite someone.
              </Link>
            </p>
          )}

          <div className="divide-y divide-[#E2E8F0]">
            {editableMembers.map((member) => (
              <div key={member.id} className="py-5">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <div className="font-semibold text-sm text-[#061E47]">
                      {member.name}
                    </div>
                    <div className="text-xs text-[#718096] capitalize mt-0.5">
                      {member.role}
                    </div>
                  </div>
                  {confirmRemove === member.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#C0392B] font-medium">
                        Remove {member.name}?
                      </span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemove(member.id)}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmRemove(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmRemove(member.id)}
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {(Object.keys(PERM_LABELS) as PermKey[]).map((perm) => {
                    const isOn = member.permissions[perm];
                    const isLocked = perm === "canView";
                    return (
                      <button
                        key={perm}
                        type="button"
                        onClick={() => togglePerm(member.id, perm)}
                        disabled={isLocked}
                        className={[
                          "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                          isOn
                            ? "bg-[#EBF2FC] border-[#2B6AD0] text-[#1F4591]"
                            : "bg-white border-[#CBD5E0] text-[#718096] hover:border-[#68A4F1]",
                          isLocked ? "cursor-default opacity-80" : "cursor-pointer",
                        ].join(" ")}
                      >
                        {PERM_LABELS[perm]}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-3">
          <Button variant="primary" onClick={handleSave}>
            Save changes
          </Button>
          {saved && (
            <span className="text-xs font-semibold text-[#1E7A45]">
              Changes saved
            </span>
          )}
        </div>
      </div>
    </AppShell>
  );
}
