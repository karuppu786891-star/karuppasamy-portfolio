"use server";

import { contactSchema } from "@/lib/validations/contact";

export type ContactState = { status: "idle" | "success" | "error" | "inactive"; message: string };

/** Contact delivery is only active when these env vars are set (see README). */
export async function isContactConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL && process.env.CONTACT_FROM_EMAIL);
}

// very small in-memory throttle (per server instance) to blunt basic spam
const hits = new Map<string, number[]>();
function tooMany(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > 5;
}

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  if (!(await isContactConfigured())) {
    return { status: "inactive", message: "The contact form is not active yet. Please use the email link instead." };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    website: formData.get("website") ?? "",
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Please check your details." };
  }
  if (tooMany(parsed.data.email.toLowerCase())) {
    return { status: "error", message: "Too many messages. Please try again later." };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL,
      to: [process.env.CONTACT_TO_EMAIL],
      reply_to: parsed.data.email,
      subject: `Portfolio message from ${parsed.data.name}`,
      text: `From: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
    }),
  });

  if (!res.ok) return { status: "error", message: "Message could not be sent. Please try again later." };
  return { status: "success", message: "Thanks! Your message has been sent." };
}
