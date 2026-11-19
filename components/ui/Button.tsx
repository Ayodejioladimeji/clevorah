"use client";

import type { ReactNode } from "react";

type Variant = "filled" | "outline";

type Props = {
  variant?: Variant;
  href?: string;
  tracking?: { page: string; brand: string; role: string };
  children: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

const look: Record<Variant, string> = {
  filled: "border border-favorite bg-favorite text-white hover:border-favorite-hover hover:bg-favorite-hover",
  outline: "border border-ink bg-card text-ink hover:bg-paper",
};

export function Button({
  variant = "filled",
  href,
  tracking,
  children,
  type = "button",
  disabled,
  onClick,
}: Props) {
  const className = `inline-flex min-h-11 items-center justify-center px-5 py-2 text-[16px] font-medium leading-6 ${look[variant]} disabled:opacity-60`;
  function track() {
    onClick?.();
    const analytics = window as Window & { gtag?: (...args: unknown[]) => void };
    if (!tracking || typeof analytics.gtag !== "function") return;
    analytics.gtag("event", "affiliate_click", {
      page_slug: tracking.page,
      brand_slug: tracking.brand,
      role: tracking.role,
    });
  }
  if (href) {
    const sponsored = href.startsWith("/go/");
    return (
      <a
        href={href}
        className={className}
        onClick={track}
        {...(sponsored ? { target: "_blank", rel: "sponsored noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={className} disabled={disabled} onClick={track}>
      {children}
    </button>
  );
}
