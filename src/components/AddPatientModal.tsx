"use client";

import { useState } from "react";
import type { Patient, Medication } from "@/lib/types";
import { createEmptyPatient } from "@/lib/patient-store";

const SEX_OPTIONS = ["M", "F"];
const RACE_OPTIONS = [
  "White",
  "Black or African American",
  "Hispanic or Latino",
  "Asian",
  "Native Hawaiian or Other Pacific Islander",
  "American Indian or Alaska Native",
  "Other",
];
const INSURANCE_OPTIONS = [
  "Medicare",
  "Medicaid",
  "Commercial",
  "Uninsured",
];
const DISPOSITION_OPTIONS = [
  "Home",
  "Home with home health",
  "Skilled nursing facility",
  "Rehabilitation facility",
];
const TRANSPORTATION_OPTIONS = ["Reliable", "Limited", "None"];

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <label className="block text-xs text-muted mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full text-sm border border-border rounded-md px-3 py-1.5 bg-background";
const selectClass =
  "w-full text-sm border border-border rounded-md px-3 py-1.5 bg-background";

export default function AddPatientModal({
  onSubmit,
  onCancel,
}: {
  onSubmit: (patient: Patient) => void;
  onCancel: () => void;
}) {
  const [patient, setPatient] = useState<Patient>(createEmptyPatient);
  const [medications, setMedications] = useState<Medication[]>([
    { name: "", dose: "", frequency: "" },
  ]);
  const [chronicConditions, setChronicConditions] = useState("");
  const [icd10Codes, setIcd10Codes] = useState("");
  const [labKeys, setLabKeys] = useState([{ key: "", value: "" }]);

  function updateDemographics(
    field: keyof Patient["demographics"],
    value: string | number
  ) {
    setPatient((p) => ({
      ...p,
      demographics: { ...p.demographics, [field]: value },
    }));
  }

  function updateAdmission(
    field: keyof Patient["admission"],
    value: string | number | string[]
  ) {
    setPatient((p) => ({
      ...p,
      admission: { ...p.admission, [field]: value },
    }));
  }

  function updateHistory(
    field: keyof Patient["clinical_history"],
    value: number | string[]
  ) {
    setPatient((p) => ({
      ...p,
      clinical_history: { ...p.clinical_history, [field]: value },
    }));
  }

  function updateSocial(
    field: keyof Patient["social_determinants"],
    value: boolean | string
  ) {
    setPatient((p) => ({
      ...p,
      social_determinants: { ...p.social_determinants, [field]: value },
    }));
  }

  function handleSubmit() {
    // Calculate length of stay
    let los = patient.admission.length_of_stay_days;
    if (patient.admission.admit_date && patient.admission.discharge_date) {
      const admit = new Date(patient.admission.admit_date + "T00:00:00");
      const discharge = new Date(
        patient.admission.discharge_date + "T00:00:00"
      );
      los = Math.max(
        1,
        Math.round(
          (discharge.getTime() - admit.getTime()) / (1000 * 60 * 60 * 24)
        )
      );
    }

    // Build labs
    const labs: Record<string, number | string> = {};
    for (const l of labKeys) {
      if (l.key.trim()) {
        const num = parseFloat(l.value);
        labs[l.key.trim()] = isNaN(num) ? l.value : num;
      }
    }

    const finalPatient: Patient = {
      ...patient,
      admission: {
        ...patient.admission,
        length_of_stay_days: los,
        icd10_codes: icd10Codes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      },
      clinical_history: {
        ...patient.clinical_history,
        chronic_conditions: chronicConditions
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      },
      medications_at_discharge: medications.filter((m) => m.name.trim()),
      labs_at_discharge: labs,
    };

    onSubmit(finalPatient);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-10 overflow-y-auto"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-2xl mx-4 mb-10 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Add Patient</h2>
          <button
            onClick={onCancel}
            className="text-muted hover:text-foreground transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="text-xs text-muted mb-4">
          Patient ID: {patient.patient_id}
        </div>

        <FormSection title="Demographics">
          <Field label="Age">
            <input
              type="number"
              className={inputClass}
              value={patient.demographics.age || ""}
              onChange={(e) =>
                updateDemographics("age", parseInt(e.target.value) || 0)
              }
            />
          </Field>
          <Field label="Sex">
            <select
              className={selectClass}
              value={patient.demographics.sex}
              onChange={(e) => updateDemographics("sex", e.target.value)}
            >
              <option value="">Select...</option>
              {SEX_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Race">
            <select
              className={selectClass}
              value={patient.demographics.race}
              onChange={(e) => updateDemographics("race", e.target.value)}
            >
              <option value="">Select...</option>
              {RACE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Preferred Language">
            <input
              type="text"
              className={inputClass}
              value={patient.demographics.preferred_language}
              onChange={(e) =>
                updateDemographics("preferred_language", e.target.value)
              }
            />
          </Field>
          <Field label="Insurance Type">
            <select
              className={selectClass}
              value={patient.demographics.insurance_type}
              onChange={(e) =>
                updateDemographics("insurance_type", e.target.value)
              }
            >
              <option value="">Select...</option>
              {INSURANCE_OPTIONS.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </Field>
        </FormSection>

        <FormSection title="Admission">
          <Field label="Admitting Diagnosis" full>
            <input
              type="text"
              className={inputClass}
              value={patient.admission.admitting_diagnosis}
              onChange={(e) =>
                updateAdmission("admitting_diagnosis", e.target.value)
              }
            />
          </Field>
          <Field label="Admit Date">
            <input
              type="date"
              className={inputClass}
              value={patient.admission.admit_date}
              onChange={(e) => updateAdmission("admit_date", e.target.value)}
            />
          </Field>
          <Field label="Discharge Date">
            <input
              type="date"
              className={inputClass}
              value={patient.admission.discharge_date}
              onChange={(e) =>
                updateAdmission("discharge_date", e.target.value)
              }
            />
          </Field>
          <Field label="Discharge Disposition">
            <select
              className={selectClass}
              value={patient.admission.discharge_disposition}
              onChange={(e) =>
                updateAdmission("discharge_disposition", e.target.value)
              }
            >
              <option value="">Select...</option>
              {DISPOSITION_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>
          <Field label="ICD-10 Codes (comma-separated)">
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. I50.21, I10, E11.65"
              value={icd10Codes}
              onChange={(e) => setIcd10Codes(e.target.value)}
            />
          </Field>
        </FormSection>

        <FormSection title="Clinical History">
          <Field label="Prior Admissions (12mo)">
            <input
              type="number"
              className={inputClass}
              value={patient.clinical_history.prior_admissions_12mo || ""}
              onChange={(e) =>
                updateHistory(
                  "prior_admissions_12mo",
                  parseInt(e.target.value) || 0
                )
              }
            />
          </Field>
          <Field label="Prior ED Visits (12mo)">
            <input
              type="number"
              className={inputClass}
              value={patient.clinical_history.prior_ed_visits_12mo || ""}
              onChange={(e) =>
                updateHistory(
                  "prior_ed_visits_12mo",
                  parseInt(e.target.value) || 0
                )
              }
            />
          </Field>
          <Field label="Charlson Comorbidity Index">
            <input
              type="number"
              className={inputClass}
              value={
                patient.clinical_history.charlson_comorbidity_index || ""
              }
              onChange={(e) =>
                updateHistory(
                  "charlson_comorbidity_index",
                  parseInt(e.target.value) || 0
                )
              }
            />
          </Field>
          <Field label="Chronic Conditions (comma-separated)">
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. CHF, Hypertension, COPD"
              value={chronicConditions}
              onChange={(e) => setChronicConditions(e.target.value)}
            />
          </Field>
        </FormSection>

        <FormSection title="Social Determinants">
          <Field label="Lives Alone">
            <select
              className={selectClass}
              value={patient.social_determinants.lives_alone ? "yes" : "no"}
              onChange={(e) =>
                updateSocial("lives_alone", e.target.value === "yes")
              }
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </Field>
          <Field label="Has Caregiver">
            <select
              className={selectClass}
              value={patient.social_determinants.has_caregiver ? "yes" : "no"}
              onChange={(e) =>
                updateSocial("has_caregiver", e.target.value === "yes")
              }
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </Field>
          <Field label="Transportation Access">
            <select
              className={selectClass}
              value={patient.social_determinants.transportation_access}
              onChange={(e) =>
                updateSocial("transportation_access", e.target.value)
              }
            >
              {TRANSPORTATION_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="PCP Established">
            <select
              className={selectClass}
              value={
                patient.social_determinants.primary_care_established
                  ? "yes"
                  : "no"
              }
              onChange={(e) =>
                updateSocial(
                  "primary_care_established",
                  e.target.value === "yes"
                )
              }
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </Field>
          <Field label="Follow-up within 7 Days">
            <select
              className={selectClass}
              value={
                patient.social_determinants.follow_up_scheduled_within_7_days
                  ? "yes"
                  : "no"
              }
              onChange={(e) =>
                updateSocial(
                  "follow_up_scheduled_within_7_days",
                  e.target.value === "yes"
                )
              }
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </Field>
        </FormSection>

        {/* Medications */}
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">
            Medications at Discharge
          </h3>
          <div className="space-y-2">
            {medications.map((med, i) => (
              <div key={i} className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Name"
                  value={med.name}
                  onChange={(e) => {
                    const updated = [...medications];
                    updated[i] = { ...med, name: e.target.value };
                    setMedications(updated);
                  }}
                />
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Dose"
                  value={med.dose}
                  onChange={(e) => {
                    const updated = [...medications];
                    updated[i] = { ...med, dose: e.target.value };
                    setMedications(updated);
                  }}
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Frequency"
                    value={med.frequency}
                    onChange={(e) => {
                      const updated = [...medications];
                      updated[i] = { ...med, frequency: e.target.value };
                      setMedications(updated);
                    }}
                  />
                  {medications.length > 1 && (
                    <button
                      onClick={() =>
                        setMedications(medications.filter((_, j) => j !== i))
                      }
                      className="text-muted hover:text-risk-high shrink-0"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                setMedications([
                  ...medications,
                  { name: "", dose: "", frequency: "" },
                ])
              }
              className="text-xs text-accent hover:underline"
            >
              + Add medication
            </button>
          </div>
        </div>

        {/* Labs */}
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">
            Labs at Discharge
          </h3>
          <div className="space-y-2">
            {labKeys.map((lab, i) => (
              <div key={i} className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Lab name (e.g. creatinine)"
                  value={lab.key}
                  onChange={(e) => {
                    const updated = [...labKeys];
                    updated[i] = { ...lab, key: e.target.value };
                    setLabKeys(updated);
                  }}
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Value"
                    value={lab.value}
                    onChange={(e) => {
                      const updated = [...labKeys];
                      updated[i] = { ...lab, value: e.target.value };
                      setLabKeys(updated);
                    }}
                  />
                  {labKeys.length > 1 && (
                    <button
                      onClick={() =>
                        setLabKeys(labKeys.filter((_, j) => j !== i))
                      }
                      className="text-muted hover:text-risk-high shrink-0"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() =>
                setLabKeys([...labKeys, { key: "", value: "" }])
              }
              className="text-xs text-accent hover:underline"
            >
              + Add lab value
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end pt-4 border-t border-border">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              !patient.demographics.age ||
              !patient.demographics.sex ||
              !patient.admission.admitting_diagnosis ||
              !patient.admission.discharge_date
            }
            className="px-4 py-2 text-sm bg-accent text-white rounded-md hover:bg-accent/90 disabled:opacity-50 transition-colors"
          >
            Add Patient
          </button>
        </div>
      </div>
    </div>
  );
}
