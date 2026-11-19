import type { Metadata } from "next";
import { confirmSubscriber } from "@/lib/actions";
import { Prose } from "@/components/site/Prose";

export const metadata: Metadata = {
  title: "Confirm newsletter",
  robots: { index: false, follow: false },
};

export default async function ConfirmPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const confirmed = token ? await confirmSubscriber(token) : false;
  return (
    <Prose title="Newsletter">
      <p>{confirmed ? "You are subscribed." : "This link is not valid."}</p>
    </Prose>
  );
}
