"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Terminal, LogOut, User as UserIcon } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded border border-border/80 bg-muted/40">
              <Terminal className="h-4 w-4 text-foreground" />
            </div>
            <span>DEV_ASSESS</span>
          </Link>
          <span className="hidden sm:inline-flex items-center rounded border border-border/60 bg-muted/30 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
            OpenRouter + SQLite
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Auth State */}
          {!loading && (
            <div className="flex items-center gap-2 font-mono text-xs">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1.5 rounded border border-border/60 bg-muted/30 px-2 py-1 text-muted-foreground">
                    <UserIcon className="h-3 w-3" />
                    <span className="max-w-[140px] truncate text-[11px]">
                      {user.name || user.email}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="inline-flex items-center gap-1 rounded border border-border/60 px-2.5 py-1 text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground"
                    title="Sign Out"
                  >
                    <LogOut className="h-3 w-3" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/sign-in"
                  className="rounded border border-border/80 bg-foreground px-3 py-1 text-[11px] font-semibold text-background transition-opacity hover:opacity-90"
                >
                  Sign In
                </Link>
              )}
            </div>
          )}

          <div className="h-4 w-px bg-border/60" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
