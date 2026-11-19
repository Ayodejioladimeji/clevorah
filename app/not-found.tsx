import { Button } from "@/components/ui/Button";
import { PublicShell } from "@/components/site/PublicShell";

export default function NotFound() {
  return (
    <PublicShell>
      <div className="frame py-16 md:py-24">
        <div className="max-w-xl border border-line bg-card px-6 py-10 md:px-10">
          <p className="kicker">404</p>
          <h1 className="mt-3">Page not found</h1>
          <p className="mt-3">That page is not published.</p>
          <div className="mt-6">
            <Button href="/launch" variant="outline">
              Back to Launch
            </Button>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
