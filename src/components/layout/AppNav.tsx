"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/store";
import { useState } from "react";
import { CurrencySelector } from "@/components/ui/CurrencySelector";

const NAV_LINKS = [
  { href: "/app", label: "Spaces", exact: true },
  { href: "/app/activity", label: "Activity", exact: false },
  { href: "/planner", label: "Planner", exact: false },
];

export function AppNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  function handleSignOut() {
    signOut();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-[#FEFEFE]/95" style={{ backdropFilter: "blur(8px)" }}>
      <div className="max-w-4xl mx-auto px-5 h-16 flex items-center justify-between gap-6">
        {/* Brand Device + Wordmark */}
        <Link
          href="/app"
          className="flex items-center gap-2 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded py-1"
          aria-label="Noma app home"
        >
          <div className="w-7 h-7 rounded-lg bg-[#1F4591] text-white flex items-center justify-center font-bold text-xs shadow-xs transition-transform group-hover:scale-105">
            n
          </div>
          <span className="text-[#1F4591] font-bold text-lg tracking-tight">
            noma.
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1.5 flex-1" aria-label="App navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0]",
                isActive(link.href, link.exact)
                  ? "text-[#1F4591] bg-[#EBF2FC]"
                  : "text-[#4A5568] hover:text-[#1F4591] hover:bg-[#F7F9FC]",
              ].join(" ")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Currency selector + User identity + sign out */}
        <div className="hidden sm:flex items-center gap-4">
          <CurrencySelector compact />

          {user && (
            <Link
              href="/app/account"
              className={[
                "text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded px-2 py-1",
                isActive("/app/account", false)
                  ? "text-[#1F4591] bg-[#EBF2FC]"
                  : "text-[#4A5568] hover:text-[#1F4591]",
              ].join(" ")}
            >
              {user.name.split(" ")[0]}
            </Link>
          )}
          <button
            onClick={handleSignOut}
            className="text-sm font-medium text-[#718096] hover:text-[#C0392B] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded py-1 px-1.5"
          >
            Sign out
          </button>
        </div>

        {/* Mobile menu button (44px min target) */}
        <div className="sm:hidden flex items-center gap-2">
          <CurrencySelector compact />
          <button
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#4A5568] rounded-lg hover:bg-[#F7F9FC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0]"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-[#E2E8F0] bg-[#FEFEFE] px-5 py-4 flex flex-col gap-2 shadow-lg">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "px-3.5 py-2.5 rounded-lg text-base font-medium transition-colors",
                isActive(link.href, link.exact)
                  ? "text-[#1F4591] bg-[#EBF2FC]"
                  : "text-[#4A5568]",
              ].join(" ")}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/app/account"
              className={[
                "px-3.5 py-2.5 rounded-lg text-base font-medium transition-colors",
                isActive("/app/account", false)
                  ? "text-[#1F4591] bg-[#EBF2FC]"
                  : "text-[#4A5568]",
              ].join(" ")}
              onClick={() => setMenuOpen(false)}
            >
              Account ({user.name})
            </Link>
          )}
          <button
            onClick={() => { handleSignOut(); setMenuOpen(false); }}
            className="text-left px-3.5 py-2.5 text-base font-medium text-[#C0392B] hover:bg-[#FFF5F5] rounded-lg mt-1"
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}
