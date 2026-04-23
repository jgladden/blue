import data from "@/data/patients.json";
import type { Patient, PatientDataset } from "./types";

const dataset = data as unknown as PatientDataset;

export function getAllPatients(): Patient[] {
  return dataset.patients;
}

export function getPatientById(id: string): Patient | undefined {
  return dataset.patients.find((p) => p.patient_id === id);
}
