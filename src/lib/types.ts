export interface Patient {
  patient_id: string;
  demographics: {
    age: number;
    sex: string;
    race: string;
    preferred_language: string;
    insurance_type: string;
  };
  admission: {
    admit_date: string;
    discharge_date: string;
    length_of_stay_days: number;
    admitting_diagnosis: string;
    icd10_codes: string[];
    discharge_disposition: string;
  };
  clinical_history: {
    prior_admissions_12mo: number;
    prior_ed_visits_12mo: number;
    chronic_conditions: string[];
    charlson_comorbidity_index: number;
  };
  medications_at_discharge: Medication[];
  labs_at_discharge: Record<string, number | number[] | string>;
  social_determinants: {
    lives_alone: boolean;
    has_caregiver: boolean;
    transportation_access: string;
    primary_care_established: boolean;
    follow_up_scheduled_within_7_days: boolean;
  };
  outcome: {
    readmitted_within_30_days: boolean;
    readmission_date: string | null;
    readmission_reason: string | null;
  };
}

export interface Medication {
  name: string;
  dose: string;
  frequency: string;
}

export interface RiskFactor {
  label: string;
  points: number;
}

export interface RiskScore {
  total: number;
  level: "HIGH" | "MEDIUM" | "LOW";
  factors: RiskFactor[];
}

export interface AINarrative {
  risk_narrative: string;
  confidence_level: "high" | "moderate" | "low";
  data_gaps: string[];
  key_risk_factors: {
    factor: string;
    evidence: string;
    contribution: string;
    confidence: "high" | "moderate" | "low";
  }[];
  recommended_interventions: {
    intervention: string;
    rationale: string;
    priority: "high" | "medium" | "low";
    evidence: string;
    confidence: "high" | "moderate" | "low";
  }[];
  clinical_references: string[];
  limitations: string[];
}

export interface FeedbackEntry {
  patient_id: string;
  timestamp: string;
  type: "assessment" | "intervention";
  intervention_index?: number;
  action: "accepted" | "rejected";
  rejection_reasons?: string[];
  free_text?: string;
}

export type InterventionStatus = "not_started" | "in_progress" | "completed" | "not_applicable";

export interface InterventionStatusEntry {
  patient_id: string;
  intervention_index: number;
  status: InterventionStatus;
  updated_at: string;
}

export interface PatientOutcome {
  patient_id: string;
  readmitted: boolean;
  readmission_date?: string;
  readmission_reason?: string;
  updated_at: string;
}

export interface PatientAssignment {
  patient_id: string;
  assigned_to: string;
  assigned_at: string;
}

export type CoordinatorInterventionStatus = "not_started" | "in_progress" | "completed";

export interface CoordinatorIntervention {
  id: string;
  patient_id: string;
  priority: "high" | "medium" | "low";
  title: string;
  subtitle: string;
  status: CoordinatorInterventionStatus;
  created_at: string;
}

export interface AnalyticsEvent {
  event_id: string;
  event_type: string;
  timestamp: string;
  session_id: string;
  properties: Record<string, unknown>;
}

export interface LLMTrace {
  trace_id: string;
  patient_id: string;
  timestamp: string;
  request: {
    model: string;
    temperature: number;
    max_tokens: number;
    system_prompt_hash: string;
    user_message_preview: string;
    input_tokens: number | null;
  };
  response: {
    status: "success" | "error";
    output_tokens: number | null;
    latency_ms: number;
    confidence_level: "high" | "moderate" | "low" | null;
    risk_factors_count: number;
    interventions_count: number;
    data_gaps_count: number;
    evidence_validation: {
      total_claims: number;
      grounded_claims: number;
      ungrounded_claims: number;
      ungrounded_details: string[];
    };
  };
  error: string | null;
}

export interface PatientDataset {
  dataset_metadata: {
    description: string;
    generated_for: string;
    record_count: number;
    note: string;
  };
  patients: Patient[];
}
