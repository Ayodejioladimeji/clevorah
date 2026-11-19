"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminPath } from "./affiliate";
import { siteUrl } from "./affiliate";
import { loginBlocked, loginFailed, loginSucceeded, passwordMatches } from "./auth";
import { slugify } from "./format";
import { sendMail } from "./mail";
import {
  addMessage,
  addSubscriber,
  loadStore,
  setSubscriberStatus,
  updateStore,
} from "./repository";
import { closeSession, currentSession, openSession } from "./session";
import type { Audience, Comparison, PageType, Status } from "./types";

export type FormState = { ok: boolean; error: string; message: string };
export type SaveState = { ok: boolean; error: string };
export type LoginState = { error: string };

const emptyForm: FormState = { ok: false, error: "", message: "" };

function text(formData: FormData, name: string, max = 4000) {
  return String(formData.get(name) || "").trim().slice(0, max);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

async function requireAdmin() {
  const session = await currentSession();
  if (!session) redirect(adminPath());
  return session;
}

function revalidatePublic(item?: { clusterSlug: string; topicSlug: string; slug: string }) {
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  if (!item) return;
  revalidatePath(`/${item.clusterSlug}`);
  revalidatePath(`/${item.clusterSlug}/${item.topicSlug}`);
  revalidatePath(`/${item.clusterSlug}/${item.topicSlug}/${item.slug}`);
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = text(formData, "email", 200).toLowerCase();
  const password = String(formData.get("password") || "");
  if (!process.env.SESSION_SECRET || !process.env.ADMIN_EMAIL) {
    return { error: "Admin login is not configured." };
  }
  if (!process.env.ADMIN_PASSWORD && !process.env.ADMIN_PASSWORD_HASH) {
    return { error: "Admin login is not configured." };
  }
  if (loginBlocked(email)) return { error: "Too many attempts. Wait a few minutes." };
  if (email !== process.env.ADMIN_EMAIL.toLowerCase() || !passwordMatches(password)) {
    loginFailed(email);
    return { error: "Those details do not match." };
  }
  loginSucceeded(email);
  await openSession(email);
  redirect(adminPath());
}

export async function logout() {
  await requireAdmin();
  await closeSession();
  redirect(adminPath());
}

export async function subscribe(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = text(formData, "email", 200).toLowerCase();
  const sourcePage = text(formData, "sourcePage", 300) || "/";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ...emptyForm, error: "Enter a valid email address." };
  }
  const store = await loadStore();
  const existing = store.subscribers.find((item) => item.email === email);
  if (existing?.status === "confirmed") {
    return { ok: true, error: "", message: "This address is already confirmed." };
  }
  const subscriber = await addSubscriber(email, sourcePage);
  const confirm = `${siteUrl()}/newsletter/confirm?token=${subscriber.token}`;
  const unsubscribe = `${siteUrl()}/newsletter/unsubscribe?token=${subscriber.token}`;
  const sent = await sendMail(
    email,
    "Confirm your Clevorah newsletter",
    `Confirm this address to hear about new Clevorah comparisons:\n${confirm}\n\nUnsubscribe:\n${unsubscribe}`,
  );
  if (!sent) {
    return {
      ok: true,
      error: "",
      message: "Saved as pending. Confirmation email sends when mail is configured.",
    };
  }
  return { ok: true, error: "", message: "Check your inbox to confirm." };
}

export async function sendMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = text(formData, "name", 120);
  const email = text(formData, "email", 200).toLowerCase();
  const message = text(formData, "message", 4000);
  if (!name || !message) return { ...emptyForm, error: "Add your name and a message." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ...emptyForm, error: "Enter a valid email address." };
  }
  await addMessage({ name, email, message });
  if (process.env.ADMIN_EMAIL) {
    await sendMail(
      process.env.ADMIN_EMAIL,
      "New Clevorah contact message",
      `${name} <${email}>\n\n${message}`,
    );
  }
  return { ok: true, error: "", message: "Message received." };
}

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  await updateStore((store) => {
    store.settings = {
      homeIntro: text(formData, "homeIntro"),
      launchIntro: text(formData, "launchIntro"),
      growIntro: text(formData, "growIntro"),
      disclosure: text(formData, "disclosure", 400),
      aboutBody: text(formData, "aboutBody"),
      contactIntro: text(formData, "contactIntro"),
      disclosureBody: text(formData, "disclosureBody"),
      privacyBody: text(formData, "privacyBody"),
      navLaunch: text(formData, "navLaunch", 40) || "Launch",
      navGrow: text(formData, "navGrow", 40) || "Grow",
      navAbout: text(formData, "navAbout", 40) || "About",
      navContact: text(formData, "navContact", 40) || "Contact",
    };
    store.author.name = text(formData, "authorName", 120);
    store.author.bio = text(formData, "authorBio");
    store.author.profileUrl = "/about";
  });
  revalidatePublic();
  redirect(`${adminPath()}/settings`);
}

export async function saveBrand(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id", 80);
  await updateStore((store) => {
    const brand = store.brands.find((item) => item.id === id);
    if (!brand) return;
    brand.name = text(formData, "name", 120) || brand.name;
    brand.topicSlug = text(formData, "topicSlug", 80) || brand.topicSlug;
    brand.network = text(formData, "network", 40);
    brand.signupUrl = text(formData, "signupUrl", 500);
    brand.affiliateUrl = text(formData, "affiliateUrl", 500);
    brand.subIdParam = text(formData, "subIdParam", 40);
    brand.countryNote = text(formData, "countryNote", 400);
    brand.paused = formData.get("paused") === "on";
  });
  redirect(`${adminPath()}/brands`);
}

export async function createComparison(formData: FormData) {
  await requireAdmin();
  const title = text(formData, "title", 180);
  const topicSlug = text(formData, "topicSlug", 80);
  if (!title || !topicSlug) redirect(`${adminPath()}/comparisons`);
  const id = randomUUID();
  await updateStore((store) => {
    const topic = store.topics.find((item) => item.slug === topicSlug);
    const slugBase = slugify(title) || id;
    const taken = new Set(store.comparisons.map((item) => `${item.topicSlug}/${item.slug}`));
    let slug = slugBase;
    let suffix = 2;
    while (taken.has(`${topicSlug}/${slug}`)) {
      slug = `${slugBase}-${suffix}`;
      suffix += 1;
    }
    const comparison: Comparison = {
      id,
      pageType: "best-of",
      clusterSlug: topic?.clusterSlug || "launch",
      topicSlug,
      audience: "small-business",
      title,
      slug,
      previousSlugs: [],
      verdict: "Draft. Check the current offer and add a first-hand note before publishing.",
      favoriteBrandId: "",
      alternativeBrandId: "",
      whyFavorite: "",
      whenAlternative: "",
      skipFavorite: "",
      skipAlternative: "",
      criteria: [
        { label: "Best for", favorite: "", alternative: "" },
        { label: "Limit", favorite: "", alternative: "" },
      ],
      answers: [],
      seoTitle: title,
      metaDescription: "",
      originalDate: null,
      reviewDate: null,
      firstHandNote: "",
      status: "draft",
      searchQuery: "",
    };
    store.comparisons.push(comparison);
  });
  redirect(`${adminPath()}/comparisons/${id}`);
}

function rows(formData: FormData, prefix: string, count: number, fields: string[]) {
  const items = [];
  for (let index = 0; index < count; index += 1) {
    const record: Record<string, string> = {};
    for (const field of fields) record[field] = text(formData, `${prefix}${field}${index}`, 500);
    if (Object.values(record).some(Boolean)) items.push(record);
  }
  return items;
}

export async function saveComparison(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
  const id = text(formData, "id", 80);
  const status = text(formData, "status", 20) === "published" ? "published" : "draft";
  const firstHandNote = text(formData, "firstHandNote");
  if (status === "published" && !firstHandNote) {
    return { ok: false, error: "Add a first-hand note before publishing." };
  }
  const store = await loadStore();
  const current = store.comparisons.find((item) => item.id === id);
  if (!current) return { ok: false, error: "That comparison is missing." };
  const topicSlug = text(formData, "topicSlug", 80) || current.topicSlug;
  const topic = store.topics.find((item) => item.slug === topicSlug);
  const slug = slugify(text(formData, "slug", 120) || current.slug);
  const clash = store.comparisons.find(
    (item) => item.id !== id && item.topicSlug === topicSlug && item.slug === slug,
  );
  if (!slug || clash) return { ok: false, error: "Choose a slug that is free inside this category." };
  const favoriteBrandId = text(formData, "favoriteBrandId", 80);
  const alternativeBrandId = text(formData, "alternativeBrandId", 80);
  if (favoriteBrandId && favoriteBrandId === alternativeBrandId) {
    return { ok: false, error: "Choose two different brands." };
  }
  const pageType = text(formData, "pageType", 20) as PageType;
  const audience = text(formData, "audience", 40) as Audience;
  const criteria = rows(formData, "criteria", 4, ["label", "favorite", "alternative"]).filter(
    (item) => item.label,
  ) as Comparison["criteria"];
  const answers = rows(formData, "answer", 3, ["question", "answer"]).filter(
    (item) => item.question,
  ) as Comparison["answers"];
  let previous: string[] = [];
  await updateStore((next) => {
    const item = next.comparisons.find((entry) => entry.id === id);
    if (!item) return;
    if (item.slug !== slug) item.previousSlugs = [...new Set([...item.previousSlugs, item.slug])];
    previous = [...item.previousSlugs];
    item.pageType = pageType === "versus" || pageType === "use-case" ? pageType : "best-of";
    item.clusterSlug = topic?.clusterSlug || item.clusterSlug;
    item.topicSlug = topicSlug;
    item.audience = audience || item.audience;
    item.title = text(formData, "title", 180) || item.title;
    item.slug = slug;
    item.verdict = text(formData, "verdict");
    item.favoriteBrandId = favoriteBrandId;
    item.alternativeBrandId = alternativeBrandId;
    item.whyFavorite = text(formData, "whyFavorite");
    item.whenAlternative = text(formData, "whenAlternative");
    item.skipFavorite = text(formData, "skipFavorite");
    item.skipAlternative = text(formData, "skipAlternative");
    item.criteria = criteria.length ? criteria : item.criteria;
    item.answers = answers;
    item.seoTitle = text(formData, "seoTitle", 180) || item.title;
    item.metaDescription = text(formData, "metaDescription", 300);
    item.searchQuery = text(formData, "searchQuery", 180);
    item.firstHandNote = firstHandNote;
    item.status = status as Status;
    if (status === "published") {
      if (!item.originalDate) item.originalDate = today();
      item.reviewDate = today();
    }
  });
  revalidatePublic({ clusterSlug: topic?.clusterSlug || current.clusterSlug, topicSlug, slug });
  revalidatePublic(current);
  for (const old of previous) {
    revalidatePath(`/${topic?.clusterSlug || current.clusterSlug}/${topicSlug}/${old}`);
  }
  redirect(`${adminPath()}/comparisons/${id}`);
}

export async function generateDraft(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
  const id = text(formData, "id", 80);
  const facts = text(formData, "facts");
  if (!process.env.GEMINI_API_KEY) return { ok: false, error: "GEMINI_API_KEY is not set." };
  const store = await loadStore();
  const current = store.comparisons.find((item) => item.id === id);
  if (!current) return { ok: false, error: "That comparison is missing." };
  const favorite = store.brands.find((item) => item.id === current.favoriteBrandId)?.name || "the favorite";
  const alternative = store.brands.find((item) => item.id === current.alternativeBrandId)?.name || "the alternative";
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const prompt = [
    "Fill a Clevorah comparison draft. Return JSON only.",
    "Keys: verdict, whyFavorite, whenAlternative, skipFavorite, skipAlternative, criteria, answers, seoTitle, metaDescription.",
    "criteria is an array of {label, favorite, alternative}. answers is an array of {question, answer}.",
    `Title: ${current.title}`,
    `Favorite: ${favorite}`,
    `Alternative: ${alternative}`,
    `Search query: ${current.searchQuery}`,
    `Publisher facts: ${facts || "None supplied."}`,
    "Do not invent commission amounts, cookie windows, country eligibility, or signup links.",
    "Do not claim the product was used. If a fact is unknown, write Check the current offer.",
  ].join("\n");
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4 },
      }),
    },
  );
  if (!response.ok) return { ok: false, error: "The draft could not be generated." };
  const payload = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const raw = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n") || "";
  const jsonText = raw.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  let draft: Partial<Comparison> & { criteria?: Comparison["criteria"]; answers?: Comparison["answers"] };
  try {
    draft = JSON.parse(jsonText) as typeof draft;
  } catch {
    return { ok: false, error: "The draft could not be read. Try again." };
  }
  const stringField = (value: unknown, max = 2000) => (typeof value === "string" ? value.trim().slice(0, max) : "");
  await updateStore((next) => {
    const item = next.comparisons.find((entry) => entry.id === id);
    if (!item) return;
    item.verdict = stringField(draft.verdict) || item.verdict;
    item.whyFavorite = stringField(draft.whyFavorite);
    item.whenAlternative = stringField(draft.whenAlternative);
    item.skipFavorite = stringField(draft.skipFavorite, 500);
    item.skipAlternative = stringField(draft.skipAlternative, 500);
    item.seoTitle = stringField(draft.seoTitle, 180) || item.seoTitle;
    item.metaDescription = stringField(draft.metaDescription, 300);
    if (Array.isArray(draft.criteria)) {
      item.criteria = draft.criteria
        .slice(0, 4)
        .map((row) => ({
          label: stringField(row?.label, 80),
          favorite: stringField(row?.favorite, 240),
          alternative: stringField(row?.alternative, 240),
        }))
        .filter((row) => row.label);
    }
    if (Array.isArray(draft.answers)) {
      item.answers = draft.answers
        .slice(0, 3)
        .map((row) => ({
          question: stringField(row?.question, 180),
          answer: stringField(row?.answer, 600),
        }))
        .filter((row) => row.question);
    }
    item.status = "draft";
  });
  revalidatePublic(current);
  redirect(`${adminPath()}/comparisons/${id}?generated=1`);
}

export async function confirmSubscriber(token: string) {
  return setSubscriberStatus(token, "confirmed");
}

export async function unsubscribeSubscriber(token: string) {
  return setSubscriberStatus(token, "unsubscribed");
}
