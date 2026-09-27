import { getRecord, listRecords, putRecord } from "@/lib/storage/vault";
import { uuid } from "@/lib/crypto/random";
import type { JournalEntry } from "./types";

function titleFrom(body: string, title?: string) {
  if (title?.trim()) return title.trim();
  const t = body.trim().replace(/\n/g, " ");
  return t.slice(0, 16) || "无题";
}

export async function createJournal(input: {
  title?: string;
  body: string;
  emotionId?: string;
}): Promise<JournalEntry> {
  const now = new Date().toISOString();
  const entry: JournalEntry = {
    id: uuid(),
    createdAt: now,
    updatedAt: now,
    title: titleFrom(input.body, input.title),
    body: input.body,
    emotionId: input.emotionId,
  };
  await putRecord("journal", entry.id, entry);
  return entry;
}

export async function updateJournal(
  id: string,
  patch: Partial<Pick<JournalEntry, "title" | "body" | "emotionId">>,
): Promise<JournalEntry> {
  const current = await getJournal(id);
  if (!current) throw new Error("日记不存在");
  const next: JournalEntry = {
    ...current,
    ...patch,
    title: titleFrom(patch.body ?? current.body, patch.title ?? current.title),
    updatedAt: new Date().toISOString(),
  };
  await putRecord("journal", id, next);
  return next;
}

export async function getJournal(id: string): Promise<JournalEntry | null> {
  return getRecord<JournalEntry>("journal", id);
}

export async function listJournals(): Promise<JournalEntry[]> {
  const all = await listRecords<JournalEntry>("journal");
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
