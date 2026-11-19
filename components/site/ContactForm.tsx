"use client";

import { useActionState } from "react";
import { sendMessage, type FormState } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

const initial: FormState = { ok: false, error: "", message: "" };

export function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, initial);
  if (state.ok) return <p>{state.message}</p>;
  return (
    <form action={action} className="grid gap-3">
      <TextField label="Name" name="name" required />
      <TextField label="Email" name="email" type="email" required />
      <TextField label="Message" name="message" multiline required />
      <Button type="submit" disabled={pending}>
        Send
      </Button>
      {state.error ? <p>{state.error}</p> : null}
    </form>
  );
}
