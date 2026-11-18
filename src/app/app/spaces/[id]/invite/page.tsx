"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { useSpaces } from "@/lib/store";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";

type PermissionKey =
  | "canView"
  | "canContribute"
  | "canInvite"
  | "canApprovePayouts"
  | "canRequestPayouts";

const PERMISSION_LABELS: Record<
  PermissionKey,
  { label: string; hint: string }
> = {
  canView: {
    label: "View space details",
    hint: "Can see the goal, activity, and member list",
  },
  canContribute: { label: "Contribute", hint: "Can add money to this space" },
  canInvite: {
    label: "Invite others",
    hint: "Can generate invite links for new members",
  },
  canRequestPayouts: {
    label: "Request payouts",
    hint: "Can submit payout requests",
  },
  canApprovePayouts: {
    label: "Approve payouts",
    hint: "Can vote to approve or reject payout requests",
  },
};

export default function InvitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { spaces } = useSpaces();
  const space = spaces.find((s) => s.id === id);

  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const [permissions, setPermissions] = useState<Record<PermissionKey, boolean>>({
    canView: true,
    canContribute: true,
    canInvite: false,
    canRequestPayouts: false,
    canApprovePayouts: false,
  });

  const activePermsList = useMemo(() => {
    return Object.entries(permissions)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(",");
  }, [permissions]);

  if (!space) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto py-16 text-center">
          <p className="text-[#061E47] mb-4">Space not found.</p>
          <Link href="/app" className="text-[#2B6AD0] hover:underline text-sm font-medium">
            Back to spaces
          </Link>
        </div>
      </AppShell>
    );
  }

  const inviteLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/invite/inv-${id}?perms=${activePermsList}`
      : `/invite/inv-${id}?perms=${activePermsList}`;

  async function handleCopy() {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setCopyFailed(false);
        setTimeout(() => setCopied(false), 2500);
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch {
      setCopyFailed(true);
      setTimeout(() => setCopyFailed(false), 4000);
    }
  }

  function toggle(key: PermissionKey) {
    if (key === "canView") return;
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <AppShell>
      <div className="max-w-lg mx-auto py-6">
        <Link
          href={`/app/spaces/${id}`}
          className="text-sm font-medium text-[#2B6AD0] hover:text-[#1F4591] mb-6 inline-flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded"
        >
          ← {space.name}
        </Link>

        <h1 className="text-2xl font-bold text-[#061E47] tracking-tight mb-1.5">
          Invite someone
        </h1>
        <p className="text-sm text-[#4A5568] mb-8 leading-relaxed">
          Share a link to invite people to {space.name}. Set what they are authorised to do before they accept.
        </p>

        {/* Permissions */}
        <section className="mt-8 mb-10">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-[#061E47]">
              Permissions for invitees
            </h2>
            <p className="text-xs text-[#718096] mt-1">
              Invitees will see these exact conditions before accepting the invitation.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {(Object.keys(PERMISSION_LABELS) as PermissionKey[]).map((key) => {
              const { label, hint } = PERMISSION_LABELS[key];
              const isLocked = key === "canView";
              return (
                <Checkbox
                  key={key}
                  checked={permissions[key]}
                  onChange={() => toggle(key)}
                  disabled={isLocked}
                  label={label}
                  description={hint}
                  badge={
                    isLocked ? (
                      <span className="text-xs text-[#718096] font-normal">
                        (always enabled)
                      </span>
                    ) : undefined
                  }
                  className="p-1 rounded-lg hover:bg-[#F7F9FC] transition-colors"
                />
              );
            })}
          </div>
        </section>

        {/* Invite link */}
        <section className="mt-8">
          <h2 className="text-base font-semibold text-[#061E47] mb-3">
            Generated invite link
          </h2>
          <div className="flex items-center gap-3 p-3 bg-[#F7F9FC] border border-[#CBD5E0] rounded-lg mb-2">
            <span className="flex-1 text-xs font-mono text-[#061E47] break-all select-all">
              {inviteLink}
            </span>
            <Button variant="secondary" size="sm" onClick={handleCopy}>
              {copied ? "Copied" : "Copy link"}
            </Button>
          </div>
          {copyFailed && (
            <p className="text-xs text-[#C0392B] mb-2" role="alert">
              Could not copy automatically. Please select and copy the link text above.
            </p>
          )}
          <p className="text-xs text-[#718096] leading-relaxed">
            Anyone with this link will see the permissions you selected before accepting. They will need a noma. account to join.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
