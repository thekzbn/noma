"use client";

import { type ReactNode } from "react";
import { AppNav } from "./AppNav";
import { ToastContainer } from "@/components/ui/Toast";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#FEFEFE]">
      <div
        className="bg-[#FFF8E6] border-b border-[#F6D860] text-[#856404] text-xs text-center py-2 px-4"
        role="status"
        aria-label="Demo mode notice"
      >
        Demo mode — no real money moves. Contributions and payouts are simulated.
      </div>
      <AppNav />
      <main id="main-content" className="flex-1 max-w-4xl mx-auto w-full px-5 py-10">
        {children}
      </main>
      <ToastContainer />
    </div>
  );
}
