import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import mongoose, { type Model, type Schema } from "mongoose";
import { seedData } from "./seed";
import type {
  Brand,
  Comparison,
  ContactMessage,
  Store,
  Subscriber,
} from "./types";

const filePath = path.join(process.cwd(), "data", "content.json");
const collections = [
  "SiteSettings",
  "Author",
  "Cluster",
  "Topic",
  "Comparison",
  "Brand",
  "Click",
  "Subscriber",
  "ContactMessage",
  "SlugRedirect",
] as const;

type CollectionName = (typeof collections)[number];

const keys: Record<CollectionName, keyof Store> = {
  SiteSettings: "settings",
  Author: "author",
  Cluster: "clusters",
  Topic: "topics",
  Comparison: "comparisons",
  Brand: "brands",
  Click: "clicks",
  Subscriber: "subscribers",
  ContactMessage: "messages",
  SlugRedirect: "redirects",
};

let queue: Promise<unknown> = Promise.resolve();
let connection: Promise<typeof mongoose> | null = null;
const models = new Map<string, Model<{ data: unknown }>>();

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function connect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  if (!connection) connection = mongoose.connect(uri);
  await connection;
  return mongoose.connection;
}

function recordModel(name: string) {
  const existing = models.get(name);
  if (existing) return existing;
  const schema: Schema<{ data: unknown }> =
    (mongoose.models[name]?.schema as Schema<{ data: unknown }>) ||
    new mongoose.Schema({ data: { type: mongoose.Schema.Types.Mixed, required: true } });
  const model =
    (mongoose.models[name] as Model<{ data: unknown }>) ||
    mongoose.model<{ data: unknown }>(name, schema, name);
  models.set(name, model);
  return model;
}

async function readFileStore(): Promise<Store | null> {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as Store;
  } catch {
    return null;
  }
}

async function writeFileStore(store: Store) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(store, null, 2));
}

async function readMongo(): Promise<Store | null> {
  const db = await connect();
  if (!db) return null;
  const store = seedData();
  let found = false;
  for (const name of collections) {
    const doc = await recordModel(name).findOne().lean<{ data: Store[keyof Store] }>();
    if (doc?.data) {
      found = true;
      const key = keys[name];
      (store[key] as Store[keyof Store]) = doc.data;
    }
  }
  return found ? store : null;
}

async function writeMongo(store: Store) {
  const db = await connect();
  if (!db) return false;
  for (const name of collections) {
    const key = keys[name];
    await recordModel(name).findOneAndUpdate(
      {},
      { data: store[key] },
      { upsert: true, new: true },
    );
  }
  return true;
}

async function read(): Promise<Store> {
  if (process.env.MONGODB_URI) {
    const existing = await readMongo();
    if (existing) return existing;
    const seeded = seedData();
    await writeMongo(seeded);
    return seeded;
  }
  const file = await readFileStore();
  if (file) return file;
  const seeded = seedData();
  await writeFileStore(seeded);
  return seeded;
}

async function write(store: Store) {
  const saved = await writeMongo(store);
  if (!saved) await writeFileStore(store);
}

export function loadStore() {
  return enqueue(read);
}

export function updateStore(change: (store: Store) => void) {
  return enqueue(async () => {
    const store = await read();
    change(store);
    await write(store);
    return store;
  });
}

export function growIsPublic(store: Store) {
  return store.comparisons.some(
    (item) => item.clusterSlug === "grow" && item.status === "published",
  );
}

export function brandById(store: Store, id: string) {
  return store.brands.find((item) => item.id === id);
}

export function publishedComparisons(store: Store, clusterSlug: string, topicSlug?: string) {
  return store.comparisons.filter(
    (item) =>
      item.status === "published" &&
      item.clusterSlug === clusterSlug &&
      (topicSlug ? item.topicSlug === topicSlug : true),
  );
}

export function findComparison(store: Store, cluster: string, topic: string, slug: string) {
  return store.comparisons.find(
    (item) =>
      item.clusterSlug === cluster && item.topicSlug === topic && item.slug === slug,
  );
}

export function findByPreviousSlug(store: Store, cluster: string, topic: string, slug: string) {
  return store.comparisons.find(
    (item) =>
      item.clusterSlug === cluster &&
      item.topicSlug === topic &&
      item.previousSlugs.includes(slug),
  );
}

export async function addSubscriber(email: string, sourcePage: string) {
  const token = randomUUID();
  const subscriber: Subscriber = {
    id: randomUUID(),
    email: email.toLowerCase(),
    sourcePage,
    status: "pending",
    token,
    createdAt: new Date().toISOString(),
  };
  await updateStore((store) => {
    const existing = store.subscribers.find((item) => item.email === subscriber.email);
    if (existing) {
      existing.status = "pending";
      existing.token = token;
      existing.sourcePage = sourcePage;
      subscriber.token = token;
      subscriber.id = existing.id;
      return;
    }
    store.subscribers.push(subscriber);
  });
  return subscriber;
}

export async function setSubscriberStatus(token: string, status: Subscriber["status"]) {
  let found = false;
  await updateStore((store) => {
    const subscriber = store.subscribers.find((item) => item.token === token);
    if (!subscriber) return;
    subscriber.status = status;
    found = true;
  });
  return found;
}

export async function addMessage(input: Omit<ContactMessage, "id" | "createdAt">) {
  await updateStore((store) => {
    store.messages.push({
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    });
  });
}

export async function addClick(pageSlug: string, brandId: string, role: "favorite" | "alternative") {
  await updateStore((store) => {
    store.clicks.push({
      id: randomUUID(),
      pageSlug,
      brandId,
      role,
      at: new Date().toISOString(),
    });
  });
}

export function linkableBrand(brand: Brand | undefined) {
  return Boolean(brand && !brand.paused && brand.affiliateUrl);
}

export function clusterBySlug(store: Store, slug: string) {
  return store.clusters.find((item) => item.slug === slug);
}

export function topicBySlug(store: Store, clusterSlug: string, slug: string) {
  return store.topics.find((item) => item.clusterSlug === clusterSlug && item.slug === slug);
}

export function clusterIsVisible(store: Store, slug: string) {
  if (slug === "launch") return true;
  if (slug === "grow") return growIsPublic(store);
  return false;
}

export type { Comparison };
