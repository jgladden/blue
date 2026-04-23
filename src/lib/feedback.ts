import type { FeedbackEntry } from "./types";

const STORAGE_KEY = "aiclin_feedback";

export function saveFeedback(entry: FeedbackEntry): void {
  if (typeof window === "undefined") return;
  try {
    const existing = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    ) as FeedbackEntry[];
    existing.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // silent fail
  }
}

export function getAllFeedback(): FeedbackEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    ) as FeedbackEntry[];
  } catch {
    return [];
  }
}

export function getFeedbackForPatient(patientId: string): FeedbackEntry[] {
  return getAllFeedback().filter((f) => f.patient_id === patientId);
}

export function removeFeedback(
  patientId: string,
  type: "assessment" | "intervention",
  interventionIndex?: number
): void {
  if (typeof window === "undefined") return;
  try {
    const all = getAllFeedback();
    const filtered = all.filter(
      (f) =>
        !(
          f.patient_id === patientId &&
          f.type === type &&
          f.intervention_index === interventionIndex
        )
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // silent fail
  }
}

export function clearFeedback(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
