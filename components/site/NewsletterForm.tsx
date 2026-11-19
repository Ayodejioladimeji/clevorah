"use client";

import { useActionState } from "react";
import { subscribe, type FormState } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

const initial: FormState = { ok: false, error: "", message: "" };

export function NewsletterForm({ sourcePage, compact = false }: { sourcePage: string; compact?: boolean }) {
  const [state, action, pending] = useActionState(subscribe, initial);
  return (
    <form action={action} className="grid gap-3">
      {compact ? <p className="kicker">New comparisons</p> : <h2>New comparisons</h2>}
      <p className="meta">Get a note when a comparison is published. The pages stay readable without it.</p>
      {state.ok ? <p>{state.message}</p> : null}
      {state.ok ? null : (
        <>
          <input type="hidden" name="sourcePage" value={sourcePage} />
          <TextField label="Email" name="email" type="email" required />
          <Button type="submit" disabled={pending}>
            Send confirmation
          </Button>
        </>
      )}
      {state.error ? <p>{state.error}</p> : null}
    </form>
  );
}
