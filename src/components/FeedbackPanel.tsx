"use client";

import { useState, useCallback } from "react";
import type { Patient, AINarrative, FeedbackEntry } from "@/lib/types";
import { saveFeedback, getFeedbackForPatient } from "@/lib/feedback";
import { trackEvent } from "@/lib/analytics";
import type { RiskScore } from "@/lib/types";

const RISK_REJECTION_REASONS = [
  "Risk too high",
  "Risk too low",
  "Missing key risk factor",
];

const INTERVENTION_REJECTION_REASONS = [
  "Already in place",
  "Not applicable",
  "Not feasible",
  "More urgent intervention needed",
];

const CLINICAL_REJECTION_REASONS = [
  "Missing important context",
  "Patient condition changed",
  "Contradicts care plan",
];

const DATA_REJECTION_REASONS = ["Data incomplete", "Data incorrect"];

const ALL_REJECTION_REASONS = [
  ...RISK_REJECTION_REASONS,
  ...INTERVENTION_REJECTION_REASONS,
  ...CLINICAL_REJECTION_REASONS,
  ...DATA_REJECTION_REASONS,
];

interface RejectFormState {
  type: "assessment" | "intervention";
  interventionIndex?: number;
  interventionText?: string;
}

export default function FeedbackPanel({
  patient,
  risk,
  narrative,
}: {
  patient: Patient;
  risk: RiskScore;
  narrative: AINarrative | null;
}) {
  const [rejectForm, setRejectForm] = useState<RejectFormState | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [freeText, setFreeText] = useState("");
  const [feedbackLog, setFeedbackLog] = useState<FeedbackEntry[]>(() =>
    getFeedbackForPatient(patient.patient_id)
  );

  const refreshLog = useCallback(() => {
    setFeedbackLog(getFeedbackForPatient(patient.patient_id));
  }, [patient.patient_id]);

  function handleAccept(type: "assessment" | "intervention", interventionIndex?: number) {
    const entry: FeedbackEntry = {
      patient_id: patient.patient_id,
      timestamp: new Date().toISOString(),
      type,
      intervention_index: interventionIndex,
      action: "accepted",
    };
    saveFeedback(entry);

    const eventType =
      type === "assessment" ? "risk_assessment_accepted" : "intervention_accepted";
    trackEvent(eventType, {
      patient_id: patient.patient_id,
      risk_level: risk.level,
      ...(interventionIndex !== undefined && {
        intervention_index: interventionIndex,
        intervention_text:
          narrative?.recommended_interventions[interventionIndex]?.intervention,
      }),
    });

    refreshLog();
    setRejectForm(null);
  }

  function handleRejectStart(
    type: "assessment" | "intervention",
    interventionIndex?: number,
    interventionText?: string
  ) {
    setRejectForm({ type, interventionIndex, interventionText });
    setSelectedReasons([]);
    setFreeText("");
  }

  function handleRejectSubmit() {
    if (!rejectForm) return;

    const entry: FeedbackEntry = {
      patient_id: patient.patient_id,
      timestamp: new Date().toISOString(),
      type: rejectForm.type,
      intervention_index: rejectForm.interventionIndex,
      action: "rejected",
      rejection_reasons: selectedReasons,
      free_text: freeText || undefined,
    };
    saveFeedback(entry);

    const eventType =
      rejectForm.type === "assessment"
        ? "risk_assessment_rejected"
        : "intervention_rejected";
    trackEvent(eventType, {
      patient_id: patient.patient_id,
      risk_level: risk.level,
      rejection_reasons: selectedReasons,
      free_text: freeText || undefined,
      ...(rejectForm.interventionIndex !== undefined && {
        intervention_index: rejectForm.interventionIndex,
        intervention_text: rejectForm.interventionText,
      }),
    });

    refreshLog();
    setRejectForm(null);
    setSelectedReasons([]);
    setFreeText("");
  }

  function toggleReason(reason: string) {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  }

  const assessmentFeedback = feedbackLog.find(
    (f) => f.type === "assessment"
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Clinician Feedback</h2>

      {/* Overall assessment feedback */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold mb-2">Overall Risk Assessment</h3>
        {assessmentFeedback ? (
          <div
            className={`text-sm px-3 py-2 rounded ${
              assessmentFeedback.action === "accepted"
                ? "bg-risk-low-bg text-risk-low"
                : "bg-risk-high-bg text-risk-high"
            }`}
          >
            {assessmentFeedback.action === "accepted"
              ? "Accepted"
              : `Rejected — ${assessmentFeedback.rejection_reasons?.join(", ")}`}
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => handleAccept("assessment")}
              className="px-3 py-1.5 text-sm bg-risk-low-bg text-risk-low border border-risk-low/20 rounded-md hover:bg-risk-low/10 transition-colors"
            >
              Accept
            </button>
            <button
              onClick={() => handleRejectStart("assessment")}
              className="px-3 py-1.5 text-sm bg-risk-high-bg text-risk-high border border-risk-high/20 rounded-md hover:bg-risk-high/10 transition-colors"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      {/* Intervention-level feedback */}
      {narrative && narrative.recommended_interventions.length > 0 && (
        <div className="mb-5">
          <h3 className="text-sm font-semibold mb-2">Interventions</h3>
          <div className="space-y-2">
            {narrative.recommended_interventions.map((intv, i) => {
              const existing = feedbackLog.find(
                (f) => f.type === "intervention" && f.intervention_index === i
              );
              return (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm border border-border rounded p-2"
                >
                  <span className="truncate mr-2 flex-1">
                    {intv.intervention}
                  </span>
                  {existing ? (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                        existing.action === "accepted"
                          ? "bg-risk-low-bg text-risk-low"
                          : "bg-risk-high-bg text-risk-high"
                      }`}
                    >
                      {existing.action}
                    </span>
                  ) : (
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleAccept("intervention", i)}
                        className="px-2 py-1 text-xs bg-risk-low-bg text-risk-low rounded hover:bg-risk-low/10"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleRejectStart("intervention", i, intv.intervention)
                        }
                        className="px-2 py-1 text-xs bg-risk-high-bg text-risk-high rounded hover:bg-risk-high/10"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rejection form */}
      {rejectForm && (
        <div className="border border-risk-high/20 bg-risk-high-bg/50 rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3">
            Reason for rejection
            {rejectForm.type === "intervention" && rejectForm.interventionText && (
              <span className="font-normal text-muted">
                {" "}
                — {rejectForm.interventionText}
              </span>
            )}
          </h3>

          <div className="space-y-3 mb-4">
            {[
              { label: "Risk Score Accuracy", reasons: RISK_REJECTION_REASONS },
              {
                label: "Recommendation Relevance",
                reasons: INTERVENTION_REJECTION_REASONS,
              },
              { label: "Clinical Context", reasons: CLINICAL_REJECTION_REASONS },
              { label: "Data Quality", reasons: DATA_REJECTION_REASONS },
            ].map((group) => (
              <div key={group.label}>
                <p className="text-xs font-semibold text-muted mb-1">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.reasons.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => toggleReason(reason)}
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
            className="w-full text-sm border border-border rounded-md p-2 mb-3 bg-card resize-none"
            rows={2}
          />

          <div className="flex gap-2">
            <button
              onClick={handleRejectSubmit}
              disabled={selectedReasons.length === 0}
              className="px-3 py-1.5 text-sm bg-risk-high text-white rounded-md hover:bg-risk-high/90 disabled:opacity-50 transition-colors"
            >
              Submit Rejection
            </button>
            <button
              onClick={() => setRejectForm(null)}
              className="px-3 py-1.5 text-sm text-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
