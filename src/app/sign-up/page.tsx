"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PublicNav } from "@/components/layout/PublicNav";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/store";

interface FormData {
  name: string;
  email: string;
  password: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Enter your name.";
  if (!data.email.includes("@")) errors.email = "Enter a valid email address.";
  if (data.password.length < 8)
    errors.password = "Password must be at least 8 characters.";
  return errors;
}

export default function SignUpPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [form, setForm] = useState<FormData>({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((er) => ({ ...er, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    // Simulate async
    await new Promise((r) => setTimeout(r, 800));
    signIn({
      id: "user-" + Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
    });
    router.push("/onboarding");
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FEFEFE]">
      <PublicNav />
      <main id="main-content" className="flex-1 flex items-start justify-center px-5 py-16">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-[#061E47] mb-2 tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-[#4A5568] mb-8">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-[#2B6AD0] font-medium hover:text-[#1F4591]">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <Input
              label="Full name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Adaeze Okafor"
            />
            <Input
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              hint="At least 8 characters"
            />
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              className="mt-1"
            >
              Create account
            </Button>
          </form>

          <p className="text-xs text-[#856404] bg-[#FFF8E6] border border-[#F6D860] rounded-lg px-3 py-2 mt-6 leading-relaxed">
            Demo prototype — signing up stores your session and spaces locally in your browser. No real backend is contacted.
          </p>

          <p className="text-xs text-[#718096] mt-4 leading-relaxed">
            By creating an account you agree to noma.&apos;s terms of service and
            privacy policy.
          </p>
        </div>
      </main>
    </div>
  );
}
