"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

const initial: LoginState = { error: "" };

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initial);
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="bg-favorite px-8 py-12 text-white md:px-12 md:py-16">
        <p className="text-[28px] font-semibold tracking-tight">Clevorah</p>
        <p className="mt-4 max-w-sm text-[18px] leading-relaxed text-[#F6F5F2]">
          The desk for comparisons, brands, clicks, and the words on the public site.
        </p>
      </div>
      <div className="flex items-center bg-paper px-8 py-12 md:px-12">
        <form action={action} className="grid w-full max-w-sm gap-4">
          <p className="kicker">Desk</p>
          <h1>Log in</h1>
          <TextField label="Email" name="email" type="email" required />
          <TextField label="Password" name="password" type="password" required />
          <Button type="submit" disabled={pending}>
            Log in
          </Button>
          {state.error ? <p>{state.error}</p> : null}
        </form>
      </div>
    </div>
  );
}
