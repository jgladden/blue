import type { AINarrative } from "./types";

const STORAGE_KEY = "aiclin_narratives";

interface StoredNarrative {
  patient_id: string;
  narrative: AINarrative;
  generated_at: string;
}

export function saveNarrative(patientId: string, narrative: AINarrative): void {
  if (typeof window === "undefined") return;
  try {
    const all = getAllStoredNarratives();
    const idx = all.findIndex((n) => n.patient_id === patientId);
    const entry: StoredNarrative = {
      patient_id: patientId,
      narrative,
      generated_at: new Date().toISOString(),
    };
    if (idx >= 0) {
      all[idx] = entry;
    } else {
      all.push(entry);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // silent fail
  }
}

export function getNarrative(patientId: string): StoredNarrative | null {
  if (typeof window === "undefined") return null;
  try {
    const all = getAllStoredNarratives();
    return all.find((n) => n.patient_id === patientId) || null;
  } catch {
    return null;
  }
}

function getAllStoredNarratives(): StoredNarrative[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    ) as StoredNarrative[];
  } catch {
    return [];
  }
}
