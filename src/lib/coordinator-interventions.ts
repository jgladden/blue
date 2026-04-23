import type { CoordinatorIntervention, CoordinatorInterventionStatus } from "./types";

const STORAGE_KEY = "aiclin_coordinator_interventions";

export function getCoordinatorInterventions(patientId: string): CoordinatorIntervention[] {
  if (typeof window === "undefined") return [];
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as CoordinatorIntervention[];
    return all.filter((i) => i.patient_id === patientId);
  } catch {
    return [];
  }
}

export function addCoordinatorIntervention(intervention: CoordinatorIntervention): void {
  if (typeof window === "undefined") return;
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as CoordinatorIntervention[];
    all.push(intervention);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // silent fail
  }
}

export function updateCoordinatorInterventionStatus(
  id: string,
  status: CoordinatorInterventionStatus
): void {
  if (typeof window === "undefined") return;
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as CoordinatorIntervention[];
    const idx = all.findIndex((i) => i.id === id);
    if (idx >= 0) {
      all[idx].status = status;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    }
  } catch {
    // silent fail
  }
}
