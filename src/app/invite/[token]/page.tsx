"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp, useAuth } from "@/lib/store";
import { getInvitationPreview, type Member } from "@/lib/demo-data";
import { PublicNav } from "@/components/layout/PublicNav";
import { Button } from "@/components/ui/Button";

export default function InviteTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { state, updateSpace, showToast } = useApp();

  const invitation = getInvitationPreview(token, state.spaces);

  if (!invitation) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FEFEFE]">
        <PublicNav />
        <main
          id="main-content"
          className="max-w-md mx-auto px-5 py-20 text-center flex-1"
        >
          <h1 className="text-2xl font-semibold text-[#061E47] mb-3">
            Invitation not found
          </h1>
          <p className="text-sm text-[#4A5568] mb-8 leading-relaxed">
            This invitation link may have expired or already been used. Ask the
            person who invited you to send a new link.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/sign-up">
              <Button variant="primary">Create an account</Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="secondary">Sign in</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const space = state.spaces.find((s) => s.id === invitation.spaceId);

  function handleAccept() {
    if (!space || !user || !invitation) return;
    const newMember: Member = {
      id: user.id || `member-${user.email.replace(/[^a-zA-Z0-9]/g, "-")}`,
      name: user.name || "New member",
      email: user.email || "member@noma.app",
      role: "contributor",
      joinedAt: "2026-11-18",
      permissions: {
        canView: invitation?.permissionsRequested.canView ?? true,
        canContribute: invitation?.permissionsRequested.canContribute ?? true,
        canInvite: invitation?.permissionsRequested.canInvite ?? false,
        canApprovePayouts:
          invitation?.permissionsRequested.canApprovePayouts ?? false,
        canRequestPayouts: false,
      },
    };
    updateSpace({ ...space, members: [...space.members, newMember] });
    showToast(`You have joined ${invitation.spaceName}.`, "success");
    router.push(`/app/spaces/${invitation.spaceId}`);
  }

  function handleDecline() {
    router.push("/app");
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FEFEFE]">
      <PublicNav />
      <main id="main-content" className="max-w-lg mx-auto px-5 py-12 flex-1 w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 flex-wrap mb-2">
            <h1 className="text-3xl font-bold text-[#061E47] tracking-tight">
              {invitation.spaceName}
            </h1>
            <span className="text-xs font-semibold text-[#1F4591] capitalize bg-[#EBF2FC] px-2.5 py-0.5 rounded-full">
              {invitation.spaceType} space
            </span>
          </div>
          <p className="text-sm text-[#4A5568]">
            {invitation.invitedBy} has invited you to join this savings space.
          </p>
        </div>

        {/* Purpose */}
        <section className="mb-10">
          <h2 className="text-base font-semibold text-[#061E47] mb-2">
            Purpose
          </h2>
          <p className="text-sm text-[#4A5568] leading-relaxed">
            {invitation.purpose}
          </p>
        </section>

        {/* Rules */}
        {invitation.rules.length > 0 && (
          <section className="mb-10">
            <h2 className="text-base font-semibold text-[#061E47] mb-3">
              Rules
            </h2>
            <ul className="flex flex-col gap-2">
              {invitation.rules.map((rule, i) => (
                <li key={i} className="text-sm text-[#061E47] flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2B6AD0] mt-2 shrink-0" />
                  <span className="leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Permissions */}
        <section className="mb-12">
          <h2 className="text-base font-semibold text-[#061E47] mb-3">
            Permissions granted to you
          </h2>
          <div className="flex flex-wrap gap-2">
            {invitation.permissionsRequested.canView && (
              <span className="px-3 py-1 rounded-full bg-[#EBF2FC] text-[#1F4591] text-xs font-medium">
                View
              </span>
            )}
            {invitation.permissionsRequested.canContribute && (
              <span className="px-3 py-1 rounded-full bg-[#EBF2FC] text-[#1F4591] text-xs font-medium">
                Contribute
              </span>
            )}
            {invitation.permissionsRequested.canInvite && (
              <span className="px-3 py-1 rounded-full bg-[#EBF2FC] text-[#1F4591] text-xs font-medium">
                Invite others
              </span>
            )}
            {invitation.permissionsRequested.canApprovePayouts && (
              <span className="px-3 py-1 rounded-full bg-[#EBF2FC] text-[#1F4591] text-xs font-medium">
                Approve payouts
              </span>
            )}
          </div>
          <p className="text-xs text-[#718096] mt-3">
            Invite expires:{" "}
            {new Date(invitation.expiresAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </section>

        {/* CTA */}
        {user ? (
          <div className="flex gap-3">
            <Button variant="primary" onClick={handleAccept}>
              Accept invitation
            </Button>
            <Button variant="ghost" onClick={handleDecline}>
              Decline
            </Button>
          </div>
        ) : (
          <div className="pt-2">
            <p className="text-sm text-[#4A5568] mb-4">
              You need a Noma account to accept this invitation.
            </p>
            <div className="flex gap-3">
              <Link href={`/sign-in?redirect=/invite/${token}`}>
                <Button variant="primary">Sign in to accept</Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="secondary">Create an account</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
