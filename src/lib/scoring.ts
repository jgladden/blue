import type { Patient, RiskScore, RiskFactor } from "./types";

const HIGH_RISK_MED_KEYWORDS = [
  "insulin",
  "iv",
  "picc",
  "taper",
  "held",
  "sliding scale",
  "prednisone",
  "supplemental o2",
];

function hasHighRiskMed(
  medications: Patient["medications_at_discharge"]
): boolean {
  return medications.some((med) => {
    const combined = `${med.name} ${med.dose} ${med.frequency}`.toLowerCase();
    return HIGH_RISK_MED_KEYWORDS.some((keyword) => combined.includes(keyword));
  });
}

export function scorePatient(patient: Patient): RiskScore {
  let total = 0;
  const factors: RiskFactor[] = [];

  function add(points: number, label: string) {
    total += points;
    factors.push({ label, points });
  }

  // Prior admissions (12mo)
  const admissions = patient.clinical_history.prior_admissions_12mo;
  if (admissions >= 4) add(25, `Prior admissions: ${admissions} (4+)`);
  else if (admissions >= 2) add(15, `Prior admissions: ${admissions} (2-3)`);
  else if (admissions === 1) add(5, `Prior admissions: ${admissions}`);

  // Prior ED visits (12mo)
  const edVisits = patient.clinical_history.prior_ed_visits_12mo;
  if (edVisits >= 3) add(10, `ED visits: ${edVisits} (3+)`);

  // Charlson comorbidity index
  const charlson = patient.clinical_history.charlson_comorbidity_index;
  if (charlson >= 8) add(25, `Charlson index: ${charlson} (8+)`);
  else if (charlson >= 5) add(15, `Charlson index: ${charlson} (5-7)`);

  // Lives alone + no caregiver
  if (
    patient.social_determinants.lives_alone &&
    !patient.social_determinants.has_caregiver
  ) {
    add(15, "Lives alone, no caregiver");
  }

  // No follow-up within 7 days
  if (!patient.social_determinants.follow_up_scheduled_within_7_days) {
    add(10, "No follow-up scheduled within 7 days");
  }

  // No PCP established
  if (!patient.social_determinants.primary_care_established) {
    add(10, "No primary care established");
  }

  // Limited transportation
  if (patient.social_determinants.transportation_access === "Limited") {
    add(5, "Limited transportation access");
  }

  // Non-English preferred language
  if (patient.demographics.preferred_language !== "English") {
    add(5, `Non-English speaker (${patient.demographics.preferred_language})`);
  }

  // Length of stay 7+ days
  if (patient.admission.length_of_stay_days >= 7) {
    add(5, `Length of stay: ${patient.admission.length_of_stay_days} days (7+)`);
  }

  // 6+ medications at discharge
  if (patient.medications_at_discharge.length >= 6) {
    add(
      5,
      `${patient.medications_at_discharge.length} medications at discharge (6+)`
    );
  }

  // High-risk medication types
  if (hasHighRiskMed(patient.medications_at_discharge)) {
    add(10, "High-risk medication type");
  }

  // Uninsured or Medicaid
  if (
    patient.demographics.insurance_type === "Uninsured" ||
    patient.demographics.insurance_type === "Medicaid"
  ) {
    add(5, `Insurance: ${patient.demographics.insurance_type}`);
  }

  // Discharge to home without home health
  if (patient.admission.discharge_disposition.toLowerCase() === "home") {
    add(5, "Discharge home without home health");
  }

  const level: RiskScore["level"] =
    total >= 40 ? "HIGH" : total >= 20 ? "MEDIUM" : "LOW";

  return { total, level, factors };
}
