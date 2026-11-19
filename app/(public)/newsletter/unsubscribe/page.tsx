import type { Metadata } from "next";
import { unsubscribeSubscriber } from "@/lib/actions";
import { Prose } from "@/components/site/Prose";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const removed = token ? await unsubscribeSubscriber(token) : false;
  return (
    <Prose title="Newsletter">
      <p>{removed ? "You are unsubscribed." : "This link is not valid."}</p>
    </Prose>
  );
}
