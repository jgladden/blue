import type { LLMTrace, Patient, AINarrative } from "./types";

const STORAGE_KEY = "aiclin_traces";

async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function createTrace(
  patientId: string,
  systemPrompt: string,
  userMessage: string
): LLMTrace {
  return {
    trace_id: crypto.randomUUID(),
    patient_id: patientId,
    timestamp: new Date().toISOString(),
    request: {
      model: "claude-sonnet-4-6",
      temperature: 0,
      max_tokens: 1500,
      system_prompt_hash: "", // filled async before save
      user_message_preview: userMessage.slice(0, 200),
      input_tokens: null,
    },
    response: {
      status: "success",
      output_tokens: null,
      latency_ms: 0,
      confidence_level: null,
      risk_factors_count: 0,
      interventions_count: 0,
      data_gaps_count: 0,
      evidence_validation: {
        total_claims: 0,
        grounded_claims: 0,
        ungrounded_claims: 0,
        ungrounded_details: [],
      },
    },
    error: null,
  };
}

export function validateEvidence(
  narrative: AINarrative,
  patient: Patient
): LLMTrace["response"]["evidence_validation"] {
  const patientString = JSON.stringify(patient).toLowerCase();
  let totalClaims = 0;
  let groundedClaims = 0;
  const ungroundedDetails: string[] = [];

  for (const rf of narrative.key_risk_factors) {
    totalClaims++;
    if (rf.evidence && patientString.includes(extractKey(rf.evidence))) {
      groundedClaims++;
    } else {
      ungroundedDetails.push(`Risk factor: "${rf.factor}" — evidence not found in record`);
    }
  }

  for (const intervention of narrative.recommended_interventions) {
    totalClaims++;
    if (
      intervention.evidence &&
      patientString.includes(extractKey(intervention.evidence))
    ) {
      groundedClaims++;
    } else {
      ungroundedDetails.push(
        `Intervention: "${intervention.intervention}" — evidence not found in record`
      );
    }
  }

  return {
    total_claims: totalClaims,
    grounded_claims: groundedClaims,
    ungrounded_claims: totalClaims - groundedClaims,
    ungrounded_details: ungroundedDetails,
  };
}

/** Extract the most specific keyword from an evidence string for matching. */
function extractKey(evidence: string): string {
  // Try to pull out a number or specific value for matching
  const numberMatch = evidence.match(/\d+\.?\d*/);
  if (numberMatch) return numberMatch[0];
  // Fall back to first meaningful word (skip short words)
  const words = evidence.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  return words[0] || evidence.toLowerCase().slice(0, 20);
}

export async function completeTrace(
  trace: LLMTrace,
  systemPrompt: string,
  narrative: AINarrative | null,
  patient: Patient,
  latencyMs: number,
  error?: string
): Promise<LLMTrace> {
  trace.request.system_prompt_hash = await hashString(systemPrompt);
  trace.response.latency_ms = latencyMs;

  if (error || !narrative) {
    trace.response.status = "error";
    trace.error = error || "No narrative returned";
  } else {
    trace.response.status = "success";
    trace.response.confidence_level = narrative.confidence_level;
    trace.response.risk_factors_count = narrative.key_risk_factors.length;
    trace.response.interventions_count =
      narrative.recommended_interventions.length;
    trace.response.data_gaps_count = narrative.data_gaps.length;
    trace.response.evidence_validation = validateEvidence(narrative, patient);
  }

  saveTrace(trace);
  return trace;
}

function saveTrace(trace: LLMTrace): void {
  if (typeof window === "undefined") return;
  try {
    const existing = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    ) as LLMTrace[];
    existing.push(trace);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // silent fail
  }
}

export function getAllTraces(): LLMTrace[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    ) as LLMTrace[];
  } catch {
    return [];
  }
}

export function getTraceById(traceId: string): LLMTrace | undefined {
  return getAllTraces().find((t) => t.trace_id === traceId);
}

export function clearTraces(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
