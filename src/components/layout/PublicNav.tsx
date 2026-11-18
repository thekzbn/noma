"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/store";

export function PublicNav() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-[#FEFEFE]/95"
      style={{ backdropFilter: "blur(8px)" }}
    >
      <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between gap-6">
        {/* Brand Device + Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded py-1 px-0.5"
          aria-label="Noma home"
        >
          <div className="w-8 h-8 rounded-lg bg-[#1F4591] text-white flex items-center justify-center font-bold text-sm shadow-xs transition-transform group-hover:scale-105">
            n
          </div>
          <span className="text-[#1F4591] font-bold text-xl tracking-tight">
            noma.
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-7" aria-label="Main navigation">
          <Link
            href="/planner"
            className="text-sm font-medium text-[#4A5568] hover:text-[#1F4591] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded py-1"
          >
            Savings Planner
          </Link>
          <Link
            href="/how-it-works"
            className="text-sm font-medium text-[#4A5568] hover:text-[#1F4591] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded py-1"
          >
            How it works
          </Link>
          <Link
            href="/campaign/campaign-1"
            className="text-sm font-medium text-[#4A5568] hover:text-[#1F4591] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded py-1"
          >
            See a campaign
          </Link>
        </nav>

        {/* Auth CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <Link
              href="/app"
              className="text-sm font-semibold px-4 py-2 rounded-lg bg-[#2B6AD0] text-white hover:bg-[#1F4591] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B6AD0]"
            >
              Go to your spaces
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-[#2B6AD0] hover:text-[#1F4591] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0] rounded px-2.5 py-1.5"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="text-sm font-semibold px-4 py-2 rounded-lg bg-[#2B6AD0] text-white hover:bg-[#1F4591] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B6AD0]"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile controls */}
        <div className="sm:hidden flex items-center">
          <button
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#4A5568] rounded-lg hover:bg-[#F7F9FC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2B6AD0]"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
        <div
          id="mobile-menu"
          className="sm:hidden border-t border-[#E2E8F0] bg-[#FEFEFE] px-5 py-4 flex flex-col gap-3 shadow-lg"
        >
          <Link
            href="/planner"
            className="text-base font-medium text-[#4A5568] hover:text-[#1F4591] py-2"
            onClick={() => setMenuOpen(false)}
          >
            Savings Planner
          </Link>
          <Link
            href="/how-it-works"
            className="text-base font-medium text-[#4A5568] hover:text-[#1F4591] py-2"
            onClick={() => setMenuOpen(false)}
          >
            How it works
          </Link>
          <Link
            href="/campaign/campaign-1"
            className="text-base font-medium text-[#4A5568] hover:text-[#1F4591] py-2"
            onClick={() => setMenuOpen(false)}
          >
            See a campaign
          </Link>
          <div className="pt-3 border-t border-[#E2E8F0] flex flex-col gap-3">
            {user ? (
              <Link
                href="/app"
                className="text-base font-semibold text-[#2B6AD0] py-2"
                onClick={() => setMenuOpen(false)}
              >
                Go to your spaces
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-base font-medium text-[#2B6AD0] py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="text-base font-semibold text-center px-4 py-3 rounded-lg bg-[#2B6AD0] text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
