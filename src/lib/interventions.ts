import type { InterventionStatus, InterventionStatusEntry } from "./types";

const STORAGE_KEY = "aiclin_intervention_statuses";

export function getInterventionStatuses(patientId: string): InterventionStatusEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as InterventionStatusEntry[];
    return all.filter((e) => e.patient_id === patientId);
  } catch {
    return [];
  }
}

export function getInterventionStatus(
  patientId: string,
  interventionIndex: number
): InterventionStatus {
  const entries = getInterventionStatuses(patientId);
  const entry = entries.find((e) => e.intervention_index === interventionIndex);
  return entry?.status ?? "not_started";
}

export function setInterventionStatus(
  patientId: string,
  interventionIndex: number,
  status: InterventionStatus
): void {
  if (typeof window === "undefined") return;
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as InterventionStatusEntry[];
    const idx = all.findIndex(
      (e) => e.patient_id === patientId && e.intervention_index === interventionIndex
    );
    const entry: InterventionStatusEntry = {
      patient_id: patientId,
      intervention_index: interventionIndex,
      status,
      updated_at: new Date().toISOString(),
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

export function getAllInterventionStatuses(): InterventionStatusEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as InterventionStatusEntry[];
  } catch {
    return [];
  }
}
