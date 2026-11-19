"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

export function ConsentNotice() {
  const measurementId = process.env.NEXT_PUBLIC_GA_ID;
  const [ready, setReady] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    setAccepted(window.localStorage.getItem("clevorah-consent") === "accepted");
    setReady(true);
  }, []);

  useEffect(() => {
    if (!accepted || !measurementId || document.getElementById("ga4")) return;
    const script = document.createElement("script");
    script.id = "ga4";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
    const analytics = window as Window & {
      gtag?: (...args: unknown[]) => void;
      dataLayer?: unknown[];
    };
    analytics.dataLayer = analytics.dataLayer || [];
    analytics.gtag = (...args: unknown[]) => {
      analytics.dataLayer?.push(args);
    };
    analytics.gtag("js", new Date());
    analytics.gtag("config", measurementId);
  }, [accepted, measurementId]);

  if (!measurementId || !ready || accepted) return null;
  return (
    <div className="border-b border-line">
      <div className="frame flex flex-wrap items-center justify-between gap-3 py-3">
        <p className="meta">Analytics stays off until you accept. It runs on public pages only.</p>
        <Button
          type="button"
          onClick={() => {
            window.localStorage.setItem("clevorah-consent", "accepted");
            setAccepted(true);
          }}
        >
          Accept
        </Button>
      </div>
    </div>
  );
}
