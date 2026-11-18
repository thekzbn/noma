"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { useAuth, useApp } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const { showToast } = useApp();
  const router = useRouter();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saved, setSaved] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [payoutAlerts, setPayoutAlerts] = useState(true);

  if (!user) {
    return (
      <AppShell>
        <div className="py-20 text-center max-w-sm mx-auto">
          <h1 className="text-2xl font-semibold text-[#061E47] mb-3">Sign in required</h1>
          <p className="text-[#4A5568] text-sm mb-6">You need to sign in to manage your account details.</p>
          <Button variant="primary" fullWidth onClick={() => router.push("/sign-in")}>
            Sign in
          </Button>
        </div>
      </AppShell>
    );
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    showToast("Profile details updated.", "success");
    setTimeout(() => setSaved(false), 3000);
  }

  function handleSignOut() {
    signOut();
    router.push("/");
  }

  return (
    <AppShell>
      <div className="pb-6 mb-10">
        <h1 className="text-3xl font-bold text-[#061E47] tracking-tight">
          Account settings
        </h1>
        <p className="text-sm text-[#718096] mt-1.5">
          Manage your personal details, credentials, and notification preferences.
        </p>
      </div>

      <div className="max-w-md">
        {/* Personal Details */}
        <section className="mb-14">
          <h2 className="text-lg font-semibold text-[#061E47] mb-4">
            Personal profile
          </h2>
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <Input
              label="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              autoComplete="name"
            />
            <Input
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
            />
            <div>
              <Button type="submit" variant="primary">
                {saved ? "Saved" : "Save changes"}
              </Button>
            </div>
          </form>
        </section>

        {/* Notification preferences */}
        <section className="mb-14">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#061E47]">
              Notifications
            </h2>
            <p className="text-xs text-[#718096] mt-1">
              Choose how you want to be alerted about space events.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Checkbox
              checked={payoutAlerts}
              onChange={setPayoutAlerts}
              label="Payout approvals"
              description="Receive alerts when a community space requires your vote."
              className="p-1 rounded-lg hover:bg-[#F7F9FC] transition-colors"
            />

            <Checkbox
              checked={emailAlerts}
              onChange={setEmailAlerts}
              label="Contribution receipts"
              description="Receive confirmation emails whenever you deposit funds."
              className="p-1 rounded-lg hover:bg-[#F7F9FC] transition-colors"
            />
          </div>
        </section>

        {/* Security / Sign out */}
        <section className="pt-2">
          <h2 className="text-lg font-semibold text-[#061E47] mb-1">
            Session
          </h2>
          <p className="text-xs text-[#718096] mb-4">
            Sign out of your active session on this device.
          </p>
          <Button variant="destructive" onClick={handleSignOut}>
            Sign out
          </Button>
        </section>
      </div>
    </AppShell>
  );
}
