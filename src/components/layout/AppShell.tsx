"use client";

import { type ReactNode } from "react";
import { AppNav } from "./AppNav";
import { ToastContainer } from "@/components/ui/Toast";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#FEFEFE]">
      <AppNav />
      <main className="flex-1 max-w-4xl mx-auto w-full px-5 py-10">
        {children}
      </main>
      <ToastContainer />
    </div>
  );
}
