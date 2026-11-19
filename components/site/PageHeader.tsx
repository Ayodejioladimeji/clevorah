import type { ReactNode } from "react";

export function PageHeader({
  kicker,
  title,
  lede,
  children,
}: {
  kicker?: string;
  title: string;
  lede?: string;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-line bg-card">
      <div className="frame grid gap-4 py-10 md:py-14">
        {children}
        {kicker ? <p className="kicker">{kicker}</p> : null}
        <h1 className="max-w-[40rem]">{title}</h1>
        {lede ? <p className="max-w-[40rem] text-[18px] leading-relaxed">{lede}</p> : null}
      </div>
    </header>
  );
}
