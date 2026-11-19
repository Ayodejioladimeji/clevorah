import { Button } from "@/components/ui/Button";

export function EmptyState({
  title,
  body,
  href,
  action,
}: {
  title: string;
  body: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="border border-line bg-card px-6 py-10 md:px-10">
      <p className="kicker">In progress</p>
      <h2 className="mt-3 max-w-[16ch]">{title}</h2>
      <p className="mt-3 max-w-xl">{body}</p>
      {href && action ? (
        <div className="mt-6">
          <Button href={href} variant="outline">
            {action}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
