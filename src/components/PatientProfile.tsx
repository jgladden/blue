import type { Patient } from "@/lib/types";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between py-1 text-sm border-b border-border last:border-0">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

export default function PatientProfile({ patient, hideTitle }: { patient: Patient; hideTitle?: boolean }) {
  const p = patient;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {!hideTitle && <h2 className="text-lg font-semibold mb-4">Patient Profile</h2>}

      <Section title="Demographics">
        <Field label="Age" value={p.demographics.age} />
        <Field label="Sex" value={p.demographics.sex} />
        <Field label="Race" value={p.demographics.race} />
        <Field label="Language" value={p.demographics.preferred_language} />
        <Field label="Insurance" value={p.demographics.insurance_type} />
      </Section>

      <Section title="Admission">
        <Field label="Diagnosis" value={p.admission.admitting_diagnosis} />
        <Field label="Admitted" value={p.admission.admit_date} />
        <Field label="Discharged" value={p.admission.discharge_date} />
        <Field
          label="Length of Stay"
          value={`${p.admission.length_of_stay_days} days`}
        />
        <Field label="Disposition" value={p.admission.discharge_disposition} />
        <Field label="ICD-10" value={p.admission.icd10_codes.join(", ")} />
      </Section>

      <Section title="Clinical History">
        <Field
          label="Prior Admissions (12mo)"
          value={p.clinical_history.prior_admissions_12mo}
        />
        <Field
          label="Prior ED Visits (12mo)"
          value={p.clinical_history.prior_ed_visits_12mo}
        />
        <Field
          label="Charlson Index"
          value={p.clinical_history.charlson_comorbidity_index}
        />
        <Field
          label="Chronic Conditions"
          value={
            p.clinical_history.chronic_conditions.length > 0
              ? p.clinical_history.chronic_conditions.join(", ")
              : "None"
          }
        />
      </Section>

      <Section title="Medications at Discharge">
        <div className="space-y-1">
          {p.medications_at_discharge.map((med, i) => (
            <div key={i} className="text-sm py-1 border-b border-border last:border-0">
              <span className="font-medium">{med.name}</span>{" "}
              <span className="text-muted">
                {med.dose} — {med.frequency}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Labs at Discharge">
        <div className="space-y-0">
          {Object.entries(p.labs_at_discharge).map(([key, value]) => (
            <Field
              key={key}
              label={key.replace(/_/g, " ")}
              value={
                Array.isArray(value) ? value.join(" → ") : String(value)
              }
            />
          ))}
        </div>
      </Section>

      <Section title="Social Determinants">
        <Field
          label="Lives Alone"
          value={p.social_determinants.lives_alone ? "Yes" : "No"}
        />
        <Field
          label="Has Caregiver"
          value={p.social_determinants.has_caregiver ? "Yes" : "No"}
        />
        <Field
          label="Transportation"
          value={p.social_determinants.transportation_access}
        />
        <Field
          label="PCP Established"
          value={
            p.social_determinants.primary_care_established ? "Yes" : "No"
          }
        />
        <Field
          label="Follow-up within 7 days"
          value={
            p.social_determinants.follow_up_scheduled_within_7_days
              ? "Yes"
              : "No"
          }
        />
      </Section>
    </div>
  );
}
