"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth, useApp } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const { showToast } = useApp();
  const router = useRouter();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saved, setSaved] = useState(false);

  if (!user) {
    return (
      <AppShell>
        <p className="text-[#4A5568]">
          You need to{" "}
          <a href="/sign-in" className="text-[#2B6AD0]">
            sign in
          </a>{" "}
          to view your account.
        </p>
      </AppShell>
    );
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    showToast("Profile saved.", "success");
    setTimeout(() => setSaved(false), 3000);
  }

  function handleSignOut() {
    signOut();
    router.push("/");
  }

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold text-[#061E47] tracking-tight mb-8">
        Your account
      </h1>

      <div className="max-w-sm">
        <span className="demo-badge mb-5 inline-block">Demo — changes are not saved</span>

        <form onSubmit={handleSave} className="flex flex-col gap-5 mb-10">
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
          <Button type="submit" variant="primary">
            {saved ? "Saved" : "Save changes"}
          </Button>
        </form>

        <div className="border-t border-[#E2E8F0] pt-8">
          <h2 className="text-base font-semibold text-[#061E47] mb-4">
            Notifications
          </h2>
          <p className="text-sm text-[#718096] mb-4">
            Notification preferences are not configured in this demo.
          </p>
        </div>

        <div className="border-t border-[#E2E8F0] pt-8 mt-6">
          <Button variant="destructive" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
