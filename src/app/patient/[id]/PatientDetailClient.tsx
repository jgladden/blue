"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { Patient, AINarrative } from "@/lib/types";
import { scorePatient } from "@/lib/scoring";
import { trackEvent } from "@/lib/analytics";
import { createTrace, completeTrace } from "@/lib/tracing";
import { SYSTEM_PROMPT, buildUserMessage } from "@/lib/prompts";
import { getNarrative, saveNarrative } from "@/lib/narratives";
import PatientStatusPanel from "@/components/PatientStatusPanel";
import AINarrativePanel from "@/components/AINarrativePanel";
import InterventionsPanel from "@/components/InterventionsPanel";
import CoordinatorInterventionsPanel from "@/components/CoordinatorInterventionsPanel";

type Tab = "assessment" | "intervention" | "notes";

export default function PatientDetailClient({
  patient,
}: {
  patient: Patient;
}) {
  const risk = scorePatient(patient);
  const [narrative, setNarrative] = useState<AINarrative | null>(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("intervention");
  const generating = useRef(false);

  // Generate narrative once on mount
  useEffect(() => {
    trackEvent("page_view", {
      page: `/patient/${patient.patient_id}`,
    });

    const cached = getNarrative(patient.patient_id);
    if (cached) {
      setNarrative(cached.narrative);
      setAiLoading(false);
      handleTracing({
        narrative: cached.narrative,
        trace_id: "cached",
        latency_ms: 0,
      });
    } else {
      fetchNarrative();
    }
  }, [patient.patient_id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchNarrative() {
    if (generating.current) return;
    generating.current = true;
    setAiLoading(true);

    trackEvent("ai_narrative_generate_clicked", {
      patient_id: patient.patient_id,
      is_regenerate: false,
    });

    trackEvent("ai_narrative_requested", {
      patient_id: patient.patient_id,
      is_regenerate: false,
    });

    try {
      const res = await fetch("/api/ai-narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `API error: ${res.status}`);
      }

      const data = await res.json();
      setNarrative(data.narrative);
      saveNarrative(patient.patient_id, data.narrative);

      trackEvent("ai_narrative_received", {
        patient_id: patient.patient_id,
        trace_id: data.trace_id,
        latency_ms: data.latency_ms,
        confidence_level: data.narrative?.confidence_level,
      });

      handleTracing(data);
    } catch (err) {
      console.error("Failed to generate narrative:", err);
    } finally {
      setAiLoading(false);
      generating.current = false;
    }
  }

  async function handleTracing(data: { narrative: AINarrative; trace_id: string; latency_ms: number; input_tokens?: number; output_tokens?: number }) {
    const userMessage = buildUserMessage(
      JSON.stringify(patient),
      risk.total,
      risk.level,
      risk.factors.map((f) => `${f.label}: +${f.points}`)
    );
    const trace = createTrace(patient.patient_id, SYSTEM_PROMPT, userMessage);
    trace.trace_id = data.trace_id;
    trace.request.input_tokens = data.input_tokens ?? null;
    trace.response.output_tokens = data.output_tokens ?? null;

    await completeTrace(
      trace,
      SYSTEM_PROMPT,
      data.narrative,
      patient,
      data.latency_ms
    );
  }

  const tabClass = (t: Tab) =>
    `px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
      tab === t
        ? "bg-card border border-border border-b-card text-foreground -mb-px"
        : "text-muted hover:text-foreground"
    }`;

  return (
    <div>
      {/* Tab nav */}
      <div className="flex gap-1 border-b border-border mb-6">
        <button className={tabClass("intervention")} onClick={() => setTab("intervention")}>
          Intervention
        </button>
        <button className={tabClass("assessment")} onClick={() => setTab("assessment")}>
          Assessment
        </button>
        <button className={tabClass("notes")} onClick={() => setTab("notes")}>
          Assessment Notes
        </button>
      </div>

      {/* Assessment tab */}
      {tab === "assessment" && (
        <div className="space-y-4">
          <AINarrativePanel
            patient={patient}
            risk={risk}
            narrative={narrative}
            loading={aiLoading}
            sections={["summary", "breakdown", "risk-factors"]}
          />
        </div>
      )}

      {/* Intervention tab */}
      {tab === "intervention" && (
        <div className="space-y-4">
          <PatientStatusPanel patientId={patient.patient_id} dischargeDate={patient.admission.discharge_date} />
          <CoordinatorInterventionsPanel patientId={patient.patient_id} />
          <InterventionsPanel patient={patient} loading={aiLoading} />
        </div>
      )}

      {/* Assessment Notes tab */}
      {tab === "notes" && (
        <div className="space-y-4">
          <AINarrativePanel
            patient={patient}
            risk={risk}
            narrative={narrative}
            loading={aiLoading}
            sections={["data-gaps", "limitations", "references"]}
          />
        </div>
      )}
    </div>
  );
}
