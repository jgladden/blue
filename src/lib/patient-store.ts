import type { Patient } from "./types";

const STORAGE_KEY = "aiclin_patients";

export function getStoredPatients(): Patient[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    ) as Patient[];
  } catch {
    return [];
  }
}

export function addPatient(patient: Patient): void {
  if (typeof window === "undefined") return;
  const existing = getStoredPatients();
  existing.push(patient);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function updatePatient(patient: Patient): void {
  if (typeof window === "undefined") return;
  const existing = getStoredPatients();
  const idx = existing.findIndex((p) => p.patient_id === patient.patient_id);
  if (idx >= 0) {
    existing[idx] = patient;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  }
}

export function deletePatient(patientId: string): void {
  if (typeof window === "undefined") return;
  const existing = getStoredPatients();
  const filtered = existing.filter((p) => p.patient_id !== patientId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function getPatientById(patientId: string): Patient | undefined {
  return getStoredPatients().find((p) => p.patient_id === patientId);
}

export function generatePatientId(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `PT-${num}`;
}

const SEED_PATIENTS: Patient[] = [
  {
    patient_id: "PT-20401",
    demographics: { age: 68, sex: "M", race: "White", preferred_language: "English", insurance_type: "Medicare" },
    admission: { admit_date: "2026-03-10", discharge_date: "2026-03-16", length_of_stay_days: 6, admitting_diagnosis: "Acute exacerbation of CHF", icd10_codes: ["I50.23", "I10", "E11.9"], discharge_disposition: "Home" },
    clinical_history: { prior_admissions_12mo: 3, prior_ed_visits_12mo: 5, chronic_conditions: ["Congestive heart failure", "Hypertension", "Type 2 diabetes"], charlson_comorbidity_index: 6 },
    medications_at_discharge: [
      { name: "Furosemide", dose: "80mg", frequency: "BID" },
      { name: "Lisinopril", dose: "20mg", frequency: "Daily" },
      { name: "Metformin", dose: "1000mg", frequency: "BID" },
      { name: "Carvedilol", dose: "25mg", frequency: "BID" },
      { name: "Spironolactone", dose: "25mg", frequency: "Daily" },
      { name: "Insulin glargine", dose: "20 units", frequency: "Nightly" },
    ],
    labs_at_discharge: { bnp: 1450, creatinine: 1.9, sodium: 131, potassium: 4.8, hba1c: 8.9, hemoglobin: 10.4 },
    social_determinants: { lives_alone: true, has_caregiver: false, transportation_access: "Limited", primary_care_established: true, follow_up_scheduled_within_7_days: false },
    outcome: { readmitted_within_30_days: false, readmission_date: null, readmission_reason: null },
  },
  {
    patient_id: "PT-20502",
    demographics: { age: 42, sex: "F", race: "Hispanic or Latino", preferred_language: "Spanish", insurance_type: "Medicaid" },
    admission: { admit_date: "2026-04-10", discharge_date: "2026-04-13", length_of_stay_days: 3, admitting_diagnosis: "Acute asthma exacerbation", icd10_codes: ["J45.41", "J45.20"], discharge_disposition: "Home" },
    clinical_history: { prior_admissions_12mo: 0, prior_ed_visits_12mo: 2, chronic_conditions: ["Moderate persistent asthma"], charlson_comorbidity_index: 1 },
    medications_at_discharge: [
      { name: "Fluticasone-Salmeterol", dose: "250/50mcg", frequency: "BID" },
      { name: "Albuterol inhaler", dose: "2 puffs", frequency: "Q4H PRN" },
      { name: "Montelukast", dose: "10mg", frequency: "Daily" },
    ],
    labs_at_discharge: { wbc: 10.8, creatinine: 0.7, peak_flow_percent_predicted: 72 },
    social_determinants: { lives_alone: false, has_caregiver: true, transportation_access: "Reliable", primary_care_established: false, follow_up_scheduled_within_7_days: false },
    outcome: { readmitted_within_30_days: false, readmission_date: null, readmission_reason: null },
  },
  {
    patient_id: "PT-20603",
    demographics: { age: 55, sex: "M", race: "Black or African American", preferred_language: "English", insurance_type: "Commercial" },
    admission: { admit_date: "2026-04-14", discharge_date: "2026-04-17", length_of_stay_days: 3, admitting_diagnosis: "NSTEMI", icd10_codes: ["I21.4", "I25.10", "I10", "E78.5"], discharge_disposition: "Home with home health" },
    clinical_history: { prior_admissions_12mo: 0, prior_ed_visits_12mo: 1, chronic_conditions: ["Coronary artery disease", "Hypertension", "Hyperlipidemia"], charlson_comorbidity_index: 3 },
    medications_at_discharge: [
      { name: "Aspirin", dose: "81mg", frequency: "Daily" },
      { name: "Ticagrelor", dose: "90mg", frequency: "BID" },
      { name: "Atorvastatin", dose: "80mg", frequency: "Daily" },
      { name: "Metoprolol succinate", dose: "50mg", frequency: "Daily" },
      { name: "Lisinopril", dose: "10mg", frequency: "Daily" },
      { name: "Pantoprazole", dose: "40mg", frequency: "Daily" },
    ],
    labs_at_discharge: { troponin_peak: 3.2, creatinine: 1.0, ldl: 158, hemoglobin: 13.8, ejection_fraction_percent: 42 },
    social_determinants: { lives_alone: false, has_caregiver: true, transportation_access: "Limited", primary_care_established: true, follow_up_scheduled_within_7_days: true },
    outcome: { readmitted_within_30_days: false, readmission_date: null, readmission_reason: null },
  },
  {
    patient_id: "PT-20704",
    demographics: { age: 74, sex: "F", race: "White", preferred_language: "English", insurance_type: "Medicare" },
    admission: { admit_date: "2026-04-08", discharge_date: "2026-04-14", length_of_stay_days: 6, admitting_diagnosis: "Acute exacerbation of COPD", icd10_codes: ["J44.1", "J96.00", "I10"], discharge_disposition: "Home" },
    clinical_history: { prior_admissions_12mo: 1, prior_ed_visits_12mo: 2, chronic_conditions: ["COPD", "Hypertension", "Osteoporosis"], charlson_comorbidity_index: 4 },
    medications_at_discharge: [
      { name: "Fluticasone-Vilanterol", dose: "100/25mcg", frequency: "Daily" },
      { name: "Ipratropium-Albuterol nebulizer", dose: "3mL", frequency: "Q6H" },
      { name: "Azithromycin", dose: "250mg", frequency: "Daily x4 days" },
      { name: "Amlodipine", dose: "5mg", frequency: "Daily" },
      { name: "Alendronate", dose: "70mg", frequency: "Weekly" },
    ],
    labs_at_discharge: { wbc: 11.4, creatinine: 1.1, sodium: 138, hemoglobin: 12.2, pco2: 48 },
    social_determinants: { lives_alone: true, has_caregiver: false, transportation_access: "Reliable", primary_care_established: true, follow_up_scheduled_within_7_days: false },
    outcome: { readmitted_within_30_days: false, readmission_date: null, readmission_reason: null },
  },
];

const SEEDED_KEY = "aiclin_seeded";

export function seedIfEmpty(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(SEEDED_KEY)) return;
  const existing = getStoredPatients();
  if (existing.length === 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PATIENTS));
  }
  localStorage.setItem(SEEDED_KEY, "true");
}

const RANDOM_DIAGNOSES = [
  { diagnosis: "Acute exacerbation of CHF", icd10: ["I50.23", "I10"], conditions: ["Congestive heart failure", "Hypertension"], meds: [{ name: "Furosemide", dose: "40mg", frequency: "BID" }, { name: "Lisinopril", dose: "10mg", frequency: "Daily" }, { name: "Carvedilol", dose: "12.5mg", frequency: "BID" }], labs: { bnp: 980, creatinine: 1.5, sodium: 134, hemoglobin: 11.2 } },
  { diagnosis: "Community-acquired pneumonia", icd10: ["J18.9"], conditions: ["COPD"], meds: [{ name: "Levofloxacin", dose: "750mg", frequency: "Daily" }, { name: "Albuterol inhaler", dose: "2 puffs", frequency: "Q4H PRN" }], labs: { wbc: 14.2, creatinine: 0.9, procalcitonin: 1.8, hemoglobin: 12.6 } },
  { diagnosis: "DKA", icd10: ["E11.10", "E11.65"], conditions: ["Type 2 diabetes with ketoacidosis"], meds: [{ name: "Insulin glargine", dose: "25 units", frequency: "Nightly" }, { name: "Insulin lispro", dose: "Sliding scale", frequency: "TID with meals" }, { name: "Metformin", dose: "1000mg", frequency: "BID" }], labs: { glucose: 210, hba1c: 10.2, creatinine: 1.0, potassium: 4.5 } },
  { diagnosis: "Acute exacerbation of COPD", icd10: ["J44.1", "J96.00"], conditions: ["COPD", "Home oxygen dependent"], meds: [{ name: "Fluticasone-Vilanterol", dose: "100/25mcg", frequency: "Daily" }, { name: "Ipratropium-Albuterol nebulizer", dose: "3mL", frequency: "Q4H" }, { name: "Prednisone taper", dose: "40mg", frequency: "See taper schedule" }], labs: { wbc: 12.1, creatinine: 1.2, pco2: 50, po2: 66, hemoglobin: 13.1 } },
  { diagnosis: "Cellulitis of lower extremity", icd10: ["L03.116", "E11.622"], conditions: ["Type 2 diabetes with skin complications", "Peripheral vascular disease"], meds: [{ name: "Cephalexin", dose: "500mg", frequency: "QID" }, { name: "Metformin", dose: "1000mg", frequency: "BID" }], labs: { wbc: 11.8, creatinine: 1.0, hba1c: 8.4, hemoglobin: 12.0 } },
  { diagnosis: "Hip fracture s/p ORIF", icd10: ["S72.001A", "W19.XXXA"], conditions: ["Osteoporosis", "Hypertension"], meds: [{ name: "Enoxaparin", dose: "40mg", frequency: "Daily" }, { name: "Acetaminophen", dose: "650mg", frequency: "Q6H" }, { name: "Alendronate", dose: "70mg", frequency: "Weekly" }], labs: { hemoglobin: 9.8, creatinine: 1.1, albumin: 3.0, calcium: 8.9 } },
];

const RANDOM_NAMES_DATA = {
  sex: ["M", "F"],
  race: ["White", "Black or African American", "Hispanic or Latino", "Asian"],
  language: ["English", "English", "English", "Spanish", "Vietnamese", "Mandarin"],
  insurance: ["Medicare", "Medicaid", "Commercial", "Uninsured"],
  disposition: ["Home", "Home with home health", "Skilled nursing facility"],
  transportation: ["Reliable", "Reliable", "Limited"],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateRandomPatient(): Patient {
  const template = pick(RANDOM_DIAGNOSES);
  const age = 30 + Math.floor(Math.random() * 55);
  const sex = pick(RANDOM_NAMES_DATA.sex);
  const los = 2 + Math.floor(Math.random() * 8);

  // Admit date is today
  const admitDate = new Date();
  const dischargeDate = new Date(admitDate);
  dischargeDate.setDate(dischargeDate.getDate() + los);

  // Ensure HIGH risk (40+ points)
  const priorAdmissions = 2 + Math.floor(Math.random() * 3); // 2-4 → +15 or +25
  const edVisits = 3 + Math.floor(Math.random() * 5); // 3+ → +10
  const charlson = 5 + Math.floor(Math.random() * 5); // 5+ → +15 or +25
  const livesAlone = true;
  const hasCaregiver = false; // +15
  const language = pick(RANDOM_NAMES_DATA.language);
  const insurance = pick(["Medicaid", "Uninsured"]); // +5

  const extraMeds = [
    { name: "Pantoprazole", dose: "40mg", frequency: "Daily" },
    { name: "Amlodipine", dose: "5mg", frequency: "Daily" },
    { name: "Potassium Chloride", dose: "20mEq", frequency: "Daily" },
  ]; // ensures 6+ meds → +5

  return {
    patient_id: generatePatientId(),
    demographics: {
      age,
      sex,
      race: pick(RANDOM_NAMES_DATA.race),
      preferred_language: language,
      insurance_type: insurance,
    },
    admission: {
      admit_date: admitDate.toISOString().split("T")[0],
      discharge_date: dischargeDate.toISOString().split("T")[0],
      length_of_stay_days: los,
      admitting_diagnosis: template.diagnosis,
      icd10_codes: template.icd10,
      discharge_disposition: pick(RANDOM_NAMES_DATA.disposition),
    },
    clinical_history: {
      prior_admissions_12mo: priorAdmissions,
      prior_ed_visits_12mo: edVisits,
      chronic_conditions: template.conditions,
      charlson_comorbidity_index: charlson,
    },
    medications_at_discharge: [...template.meds, ...extraMeds],
    labs_at_discharge: template.labs as unknown as Record<string, number | number[] | string>,
    social_determinants: {
      lives_alone: livesAlone,
      has_caregiver: hasCaregiver,
      transportation_access: "Limited", // +5
      primary_care_established: false, // +10
      follow_up_scheduled_within_7_days: false, // +10
    },
    outcome: {
      readmitted_within_30_days: false,
      readmission_date: null,
      readmission_reason: null,
    },
  };
}

export function createEmptyPatient(): Patient {
  return {
    patient_id: generatePatientId(),
    demographics: {
      age: 0,
      sex: "",
      race: "",
      preferred_language: "English",
      insurance_type: "",
    },
    admission: {
      admit_date: "",
      discharge_date: "",
      length_of_stay_days: 0,
      admitting_diagnosis: "",
      icd10_codes: [],
      discharge_disposition: "",
    },
    clinical_history: {
      prior_admissions_12mo: 0,
      prior_ed_visits_12mo: 0,
      chronic_conditions: [],
      charlson_comorbidity_index: 0,
    },
    medications_at_discharge: [],
    labs_at_discharge: {},
    social_determinants: {
      lives_alone: false,
      has_caregiver: false,
      transportation_access: "Reliable",
      primary_care_established: true,
      follow_up_scheduled_within_7_days: true,
    },
    outcome: {
      readmitted_within_30_days: false,
      readmission_date: null,
      readmission_reason: null,
    },
  };
}
