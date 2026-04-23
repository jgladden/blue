import type { PatientAssignment } from "./types";

const STORAGE_KEY = "aiclin_assignments";

export function getAssignment(patientId: string): PatientAssignment | null {
  if (typeof window === "undefined") return null;
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as PatientAssignment[];
    return all.find((a) => a.patient_id === patientId) ?? null;
  } catch {
    return null;
  }
}

export function setAssignment(patientId: string, assignedTo: string): void {
  if (typeof window === "undefined") return;
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as PatientAssignment[];
    const idx = all.findIndex((a) => a.patient_id === patientId);
    const entry: PatientAssignment = {
      patient_id: patientId,
      assigned_to: assignedTo,
      assigned_at: new Date().toISOString(),
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

export function removeAssignment(patientId: string): void {
  if (typeof window === "undefined") return;
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as PatientAssignment[];
    const filtered = all.filter((a) => a.patient_id !== patientId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // silent fail
  }
}

export function getAllAssignments(): PatientAssignment[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as PatientAssignment[];
  } catch {
    return [];
  }
}
