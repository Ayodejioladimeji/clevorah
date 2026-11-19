"use client";

import { useActionState } from "react";
import { generateDraft, type SaveState } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

const initial: SaveState = { ok: false, error: "" };

export function GenerateDraft({ id }: { id: string }) {
  const [state, action, pending] = useActionState(generateDraft, initial);
  return (
    <form action={action} className="grid gap-3 border border-line bg-card p-4">
      <h2>Draft with Gemini</h2>
      <p className="meta">This fills the fields and keeps the page unpublished. It does not invent commissions or signup links.</p>
      <input type="hidden" name="id" value={id} />
      <TextField label="Facts you already checked" name="facts" multiline />
      <Button type="submit" variant="outline" disabled={pending}>
        Generate draft
      </Button>
      {state.error ? <p>{state.error}</p> : null}
    </form>
  );
}
