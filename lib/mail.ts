export async function sendMail(to: string, subject: string, text: string): Promise<boolean> {
  const key = process.env.EMAIL_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) return false;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, text }),
  });
  return response.ok;
}
