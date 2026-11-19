import type { ReactNode } from "react";

export function Paragraphs({ text }: { text: string }) {
  return text.split(/\n\n+/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>);
}

export function Prose({ title, kicker, children }: { title: string; kicker?: string; children: ReactNode }) {
  return (
    <article>
      <header className="border-b border-line bg-card">
        <div className="frame py-10 md:py-14">
          {kicker ? <p className="kicker">{kicker}</p> : null}
          <h1 className={kicker ? "mt-3" : undefined}>{title}</h1>
        </div>
      </header>
      <div className="frame py-10">
        <div className="measure grid gap-4">{children}</div>
      </div>
    </article>
  );
}
