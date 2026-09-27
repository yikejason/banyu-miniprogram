import { getRecord, putRecord } from "@/lib/storage/vault";
import type { Temperament } from "./types";

const ID = "self";

export async function getTemperament(): Promise<Temperament | null> {
  return getRecord<Temperament>("temperament", ID);
}

export async function saveTemperament(t: Temperament): Promise<void> {
  await putRecord("temperament", ID, t);
}
