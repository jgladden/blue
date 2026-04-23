"use client";

import { useState, useEffect } from "react";
import { useCallback } from "react";
import type { Patient, AINarrative, FeedbackEntry, InterventionStatus } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";
import { getNarrative } from "@/lib/narratives";
import { getInterventionStatus, setInterventionStatus } from "@/lib/interventions";
import { saveFeedback, getFeedbackForPatient, removeFeedback } from "@/lib/feedback";
import { scorePatient } from "@/lib/scoring";

const CONFIDENCE_STYLES = {
  high: "bg-risk-low-bg text-risk-low",
  moderate: "bg-risk-medium-bg text-risk-medium",
  low: "bg-risk-high-bg text-risk-high",
};

export default function InterventionsPanel({
  patient,
  loading: externalLoading,
}: {
  patient: Patient;
  loading?: boolean;
}) {
  const risk = scorePatient(patient);
  const [narrative, setNarrative] = useState<AINarrative | null>(null);
  const [statusMap, setStatusMap] = useState<Record<number, InterventionStatus>>({});
  const [rejectIndex, setRejectIndex] = useState<number | null>(null);
  const [feedbackLog, setFeedbackLog] = useState<FeedbackEntry[]>([]);

  const refreshFeedback = useCallback(() => {
    setFeedbackLog(getFeedbackForPatient(patient.patient_id));
  }, [patient.patient_id]);

  useEffect(() => {
    const cached = getNarrative(patient.patient_id);
    if (cached) {
      setNarrative(cached.narrative);
      const map: Record<number, InterventionStatus> = {};
      for (let i = 0; i < (cached.narrative.recommended_interventions?.length ?? 0); i++) {
        map[i] = getInterventionStatus(patient.patient_id, i);
      }
      setStatusMap(map);
    }
    refreshFeedback();
  }, [patient.patient_id, refreshFeedback]);

  // Re-check narrative when it might have been generated
  useEffect(() => {
    const interval = setInterval(() => {
      const cached = getNarrative(patient.patient_id);
      if (cached && !narrative) {
        setNarrative(cached.narrative);
        const map: Record<number, InterventionStatus> = {};
        for (let i = 0; i < (cached.narrative.recommended_interventions?.length ?? 0); i++) {
          map[i] = getInterventionStatus(patient.patient_id, i);
        }
        setStatusMap(map);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [patient.patient_id, narrative]);

  if (!narrative && !externalLoading) {
    return null;
  }

  if (!narrative || narrative.recommended_interventions.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-3">AI Recommended Interventions</h2>
        <div className="space-y-3 animate-pulse">
          <div className="h-3 bg-border rounded w-full" />
          <div className="h-3 bg-border rounded w-5/6" />
          <div className="h-3 bg-border rounded w-4/6" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-3">AI Recommended Interventions</h2>
      <div className="text-xs text-risk-medium bg-risk-medium-bg border border-risk-medium/20 rounded px-3 py-2 mb-3">
        <strong>AI-generated content</strong> — verify against patient profile
      </div>
      <div className="space-y-2">
        {narrative.recommended_interventions.map((intv, i) => {
          return (
            <div
              key={i}
              className="text-sm border rounded p-3 border-border"
            >
              <div className="flex items-center justify-between mb-1">
                <div className={`text-sm font-semibold uppercase tracking-wider ${
                  intv.priority === "high"
                    ? "text-risk-high"
                    : intv.priority === "medium"
                    ? "text-risk-medium"
                    : "text-risk-low"
                }`}>
                  {intv.priority} priority
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted">Confidence:</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${CONFIDENCE_STYLES[intv.confidence]}`}
                  >
                    {intv.confidence.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="mb-1">
                <span className="font-medium">{intv.intervention}</span>
              </div>
              <p className="text-muted text-xs">{intv.rationale}</p>
              <p className="text-xs text-muted mt-1">Evidence: {intv.evidence}</p>

              {/* Status */}
              <div className="mt-2 pt-2 border-t border-border flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">Status:</span>
                <select
                  value={statusMap[i] ?? "not_started"}
                  onChange={(e) => {
                    const newStatus = e.target.value as InterventionStatus;
                    setInterventionStatus(patient.patient_id, i, newStatus);
                    setStatusMap((prev) => ({ ...prev, [i]: newStatus }));
                    trackEvent("intervention_status_changed", {
                      patient_id: patient.patient_id,
                      intervention_index: i,
                      status: newStatus,
                    });
                    if (newStatus === "not_applicable") {
                      trackEvent("reject_modal_opened", { patient_id: patient.patient_id, type: "intervention", intervention_index: i });
                      setRejectIndex(i);
                    } else {
                      // Clear feedback when moving away from not_applicable
                      removeFeedback(patient.patient_id, "intervention", i);
                      refreshFeedback();
                    }
                  }}
                  className={`text-xs border rounded px-2 py-1 ${
                    (statusMap[i] ?? "not_started") === "completed"
                      ? "border-risk-low/30 bg-risk-low-bg text-risk-low"
                      : (statusMap[i] ?? "not_started") === "in_progress"
                      ? "border-risk-medium/30 bg-risk-medium-bg text-risk-medium"
                      : (statusMap[i] ?? "not_started") === "not_applicable"
                      ? "border-border bg-background text-muted"
                      : "border-border bg-background text-foreground"
                  }`}
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="not_applicable">Not Applicable</option>
                </select>
              </div>

              {/* Not Applicable reason banner */}
              {(() => {
                const fb = feedbackLog.find(
                  (f) => f.type === "intervention" && f.intervention_index === i && f.action === "rejected"
                );
                if (!fb || (!fb.rejection_reasons?.length && !fb.free_text)) return null;
                return (
                  <div className="mt-2 pt-2 border-t border-border">
                    <div className="text-sm px-3 py-2 rounded border bg-risk-high-bg border-risk-high/20">
                      <span className="text-risk-high font-medium">Not Applicable</span>
                      {fb.rejection_reasons && fb.rejection_reasons.length > 0 && (
                        <span className="text-risk-high"> — {fb.rejection_reasons.join(", ")}</span>
                      )}
                      {fb.free_text && (
                        <p className="text-xs text-risk-high/70 mt-0.5">&quot;{fb.free_text}&quot;</p>
                      )}
                    </div>
                  </div>
                );
              })()}

            </div>
          );
        })}
      </div>

      {/* Reject modal for Not Applicable */}
      {rejectIndex !== null && (
        <InterventionRejectModal
          label={narrative.recommended_interventions[rejectIndex]?.intervention}
          onSubmit={(reasons, text) => {
            saveFeedback({
              patient_id: patient.patient_id,
              timestamp: new Date().toISOString(),
              type: "intervention",
              intervention_index: rejectIndex,
              action: "rejected",
              rejection_reasons: reasons,
              free_text: text || undefined,
            });
            trackEvent("intervention_rejected", {
              patient_id: patient.patient_id,
              risk_level: risk.level,
              intervention_index: rejectIndex,
              intervention_text: narrative.recommended_interventions[rejectIndex]?.intervention,
              rejection_reasons: reasons,
              free_text: text || undefined,
            });
            refreshFeedback();
            setRejectIndex(null);
          }}
          onCancel={() => {
            saveFeedback({
              patient_id: patient.patient_id,
              timestamp: new Date().toISOString(),
              type: "intervention",
              intervention_index: rejectIndex,
              action: "rejected",
              rejection_reasons: [],
            });
            trackEvent("reject_modal_dismissed", { patient_id: patient.patient_id, type: "intervention" });
            trackEvent("intervention_rejected", {
              patient_id: patient.patient_id,
              risk_level: risk.level,
              intervention_index: rejectIndex,
              intervention_text: narrative.recommended_interventions[rejectIndex]?.intervention,
              rejection_reasons: [],
            });
            refreshFeedback();
            setRejectIndex(null);
          }}
        />
      )}
    </div>
  );
}

const REJECTION_REASON_GROUPS = [
  { label: "Recommendation Relevance", reasons: ["Already in place", "Not applicable", "Not feasible", "More urgent intervention needed"] },
  { label: "Clinical Context", reasons: ["Missing important context", "Patient condition changed", "Contradicts care plan"] },
  { label: "Data Quality", reasons: ["Data incomplete", "Data incorrect"] },
];

function InterventionRejectModal({
  label,
  onSubmit,
  onCancel,
}: {
  label?: string;
  onSubmit: (reasons: string[], freeText: string) => void;
  onCancel: () => void;
}) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [freeText, setFreeText] = useState("");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-lg mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold">
            Not Applicable{label ? `: ${label}` : ""}
          </h3>
          <button onClick={onCancel} className="text-muted hover:text-foreground transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-muted mb-4">Select reasons (optional)</p>

        <div className="space-y-3 mb-4">
          {REJECTION_REASON_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-xs font-semibold text-muted mb-1">{group.label}</p>
              <div className="flex flex-wrap gap-2">
                {group.reasons.map((reason) => (
                  <button
                    key={reason}
                    onClick={() =>
                      setSelectedReasons((prev) =>
                        prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
                      )
                    }
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      selectedReasons.includes(reason)
                        ? "bg-risk-high text-white border-risk-high"
                        : "bg-card border-border text-foreground hover:border-risk-high/40"
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <textarea
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          placeholder="Anything else you'd like to share? (optional)"
          className="w-full text-sm border border-border rounded-md p-2 mb-4 bg-background resize-none"
          rows={2}
        />

        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onSubmit(selectedReasons, freeText)}
            className="px-4 py-2 text-sm bg-risk-high text-white rounded-md hover:bg-risk-high/90 transition-colors"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
