import React from "react";
import Link from "next/link";
import { Terminal } from "lucide-react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

export function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-sm rounded-md border border-border/80 bg-card p-6 shadow-sm sm:p-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <Link
          href="/"
          className="mx-auto mb-4 inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded border border-border/80 bg-background">
            <Terminal className="h-3.5 w-3.5 text-foreground" />
          </div>
          <span>DEV_ASSESS</span>
        </Link>
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      </div>

      {/* Form Content */}
      <div>{children}</div>

      {/* Footer */}
      <div className="mt-6 border-t border-border/60 pt-4 text-center font-mono text-xs text-muted-foreground">
        <span>{footerText} </span>
        <Link
          href={footerLinkHref}
          className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
        >
          {footerLinkText}
        </Link>
      </div>
    </div>
  );
}
