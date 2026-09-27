import { deleteRecord, listRecords, putRecord } from "@/lib/storage/vault";
import { uuid } from "@/lib/crypto/random";
import { mapEmotion } from "./mapEmotion";
import type { EmotionInput, EmotionRecord } from "./types";

export async function saveEmotion(input: EmotionInput): Promise<EmotionRecord> {
  const record: EmotionRecord = {
    id: uuid(),
    createdAt: new Date().toISOString(),
    input,
    visual: mapEmotion(input),
  };
  await putRecord("emotion", record.id, record);
  return record;
}

export async function listEmotions(): Promise<EmotionRecord[]> {
  const all = await listRecords<EmotionRecord>("emotion");
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getEmotion(id: string): Promise<EmotionRecord | null> {
  const all = await listEmotions();
  return all.find((e) => e.id === id) ?? null;
}

export async function deleteEmotions(ids: string[]): Promise<void> {
  for (const id of ids) {
    await deleteRecord("emotion", id);
  }
}
