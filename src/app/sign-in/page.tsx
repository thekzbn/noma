"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PublicNav } from "@/components/layout/PublicNav";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/store";
import { Suspense } from "react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/app";
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};
    if (!email.includes("@")) newErrors.email = "Enter a valid email address.";
    if (!password) newErrors.password = "Enter your password.";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    // Demo: sign in with any credentials
    const name = email.split("@")[0].replace(/[._-]/g, " ");
    signIn({
      id: "user-signin",
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
    });
    router.push(redirect);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FEFEFE]">
      <PublicNav />
      <main id="main-content" className="flex-1 flex items-start justify-center px-5 py-16">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-[#061E47] mb-2 tracking-tight">
            Sign in to noma.
          </h1>
          <p className="text-sm text-[#4A5568] mb-8">
            No account?{" "}
            <Link href="/sign-up" className="text-[#2B6AD0] font-medium hover:text-[#1F4591]">
              Create one
            </Link>
          </p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <Input
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((er) => ({ ...er, email: undefined }));
              }}
              error={errors.email}
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((er) => ({ ...er, password: undefined }));
              }}
              error={errors.password}
            />
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              className="mt-1"
            >
              Sign in
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FEFEFE]" />}>
      <SignInForm />
    </Suspense>
  );
}
