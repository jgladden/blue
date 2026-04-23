import type { PatientOutcome } from "./types";

const STORAGE_KEY = "aiclin_outcomes";

export function getOutcome(patientId: string): PatientOutcome | null {
  if (typeof window === "undefined") return null;
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as PatientOutcome[];
    return all.find((o) => o.patient_id === patientId) ?? null;
  } catch {
    return null;
  }
}

export function setOutcome(outcome: PatientOutcome): void {
  if (typeof window === "undefined") return;
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as PatientOutcome[];
    const idx = all.findIndex((o) => o.patient_id === outcome.patient_id);
    if (idx >= 0) {
      all[idx] = outcome;
    } else {
      all.push(outcome);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // silent fail
  }
}

export function getAllOutcomes(): PatientOutcome[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as PatientOutcome[];
  } catch {
    return [];
  }
}
