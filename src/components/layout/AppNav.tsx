"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/store";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/app", label: "Spaces", exact: true },
  { href: "/app/activity", label: "Activity", exact: false },
  { href: "/app/account", label: "Account", exact: false },
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
      <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between gap-6">
        {/* Brand logomark */}
        <Link
          href="/app"
          className="text-[#1F4591] font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded"
        >
          noma.
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1 flex-1" aria-label="App navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0]",
                isActive(link.href, link.exact)
                  ? "text-[#1F4591] bg-[#EBF2FC]"
                  : "text-[#4A5568] hover:text-[#1F4591] hover:bg-[#F7F9FC]",
              ].join(" ")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User + sign out */}
        <div className="hidden sm:flex items-center gap-4">
          {user && (
            <span className="text-sm text-[#4A5568]">{user.name.split(" ")[0]}</span>
          )}
          <button
            onClick={handleSignOut}
            className="text-sm text-[#718096] hover:text-[#1F4591] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded"
          >
            Sign out
          </button>
        </div>

        {/* Mobile */}
        <button
          className="sm:hidden p-2 text-[#4A5568] rounded-lg hover:bg-[#F7F9FC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0]"
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

      {menuOpen && (
        <div className="sm:hidden border-t border-[#E2E8F0] bg-[#FEFEFE] px-5 py-4 flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive(link.href, link.exact)
                  ? "text-[#1F4591] bg-[#EBF2FC]"
                  : "text-[#4A5568]",
              ].join(" ")}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => { handleSignOut(); setMenuOpen(false); }}
            className="text-left px-3 py-2 text-sm text-[#718096] hover:text-[#1F4591] rounded-lg"
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}
