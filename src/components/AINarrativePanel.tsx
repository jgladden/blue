"use client";

import { useState, useEffect, useCallback } from "react";
// Narrative generation is handled by PatientDetailClient
import type { Patient, AINarrative, RiskScore, FeedbackEntry } from "@/lib/types";
import { saveFeedback, getFeedbackForPatient, removeFeedback } from "@/lib/feedback";
import { trackEvent } from "@/lib/analytics";
import RiskBreakdown from "./RiskBreakdown";

const CONFIDENCE_STYLES = {
  high: "bg-risk-low-bg text-risk-low",
  moderate: "bg-risk-medium-bg text-risk-medium",
  low: "bg-risk-high-bg text-risk-high",
};


export default function AINarrativePanel({
  patient,
  risk,
  narrative,
  loading,
  sections,
}: {
  patient: Patient;
  risk: RiskScore;
  narrative: AINarrative | null;
  loading: boolean;
  sections?: ("summary" | "breakdown" | "risk-factors" | "data-gaps" | "limitations" | "references")[];
}) {
  const show = (s: string) => !sections || sections.includes(s as typeof sections[number]);

  const [feedbackLog, setFeedbackLog] = useState<FeedbackEntry[]>([]);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const refreshFeedback = useCallback(() => {
    setFeedbackLog(getFeedbackForPatient(patient.patient_id));
  }, [patient.patient_id]);

  useEffect(() => {
    refreshFeedback();
  }, [patient.patient_id, refreshFeedback]);

  const assessmentFeedback = feedbackLog.find((f) => f.type === "assessment");

  function handleAssessmentAccept() {
    const entry: FeedbackEntry = {
      patient_id: patient.patient_id,
      timestamp: new Date().toISOString(),
      type: "assessment",
      action: "accepted",
    };
    saveFeedback(entry);
    trackEvent("risk_assessment_accepted", {
      patient_id: patient.patient_id,
      risk_level: risk.level,
    });
    refreshFeedback();
  }

  function handleAssessmentReject(reasons: string[], freeText: string) {
    const entry: FeedbackEntry = {
      patient_id: patient.patient_id,
      timestamp: new Date().toISOString(),
      type: "assessment",
      action: "rejected",
      rejection_reasons: reasons,
      free_text: freeText || undefined,
    };
    saveFeedback(entry);
    trackEvent("risk_assessment_rejected", {
      patient_id: patient.patient_id,
      risk_level: risk.level,
      rejection_reasons: reasons,
      free_text: freeText || undefined,
    });
    refreshFeedback();
    setShowRejectModal(false);
  }

  function handleChangeAssessment() {
    trackEvent("feedback_changed", { patient_id: patient.patient_id, type: "assessment" });
    removeFeedback(patient.patient_id, "assessment");
    refreshFeedback();
  }

  return (
    <>
    {/* Risk Summary */}
    {show("summary") && <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Risk Summary</h2>
        {narrative && !loading && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted">Confidence:</span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CONFIDENCE_STYLES[narrative.confidence_level]}`}
            >
              {narrative.confidence_level.toUpperCase()}
            </span>
          </div>
        )}
      </div>
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-3 bg-border rounded w-full" />
          <div className="h-3 bg-border rounded w-5/6" />
          <div className="h-3 bg-border rounded w-4/6" />
        </div>
      ) : narrative ? (
        <>
          <div className="text-xs text-risk-medium bg-risk-medium-bg border border-risk-medium/20 rounded px-3 py-2 mb-3">
            <strong>AI-generated content</strong> — verify against patient profile
          </div>
          <p className="text-sm leading-relaxed">{narrative.risk_narrative}</p>

          {/* Summary feedback */}
          <div className="mt-4">
            <p className="text-xs text-muted mb-2">Was this summary useful?</p>
            {assessmentFeedback ? (
              <div
                className={`flex items-start justify-between text-sm px-3 py-2 rounded border ${
                  assessmentFeedback.action === "accepted"
                    ? "bg-risk-low-bg border-risk-low/20"
                    : "bg-risk-high-bg border-risk-high/20"
                }`}
              >
                <div className="flex items-start gap-2">
                  {assessmentFeedback.action === "accepted" && (
                    <svg className="w-4 h-4 text-risk-low shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  <div>
                    <span className={assessmentFeedback.action === "accepted" ? "text-risk-low font-medium" : "text-risk-high font-medium"}>
                      {assessmentFeedback.action === "accepted" ? "Yes" : "No"}
                    </span>
                    {assessmentFeedback.action === "rejected" && assessmentFeedback.rejection_reasons && assessmentFeedback.rejection_reasons.length > 0 && (
                      <span className="text-risk-high"> — {assessmentFeedback.rejection_reasons.join(", ")}</span>
                    )}
                    {assessmentFeedback.action === "rejected" && assessmentFeedback.free_text && (
                      <p className="text-xs text-risk-high/70 mt-0.5">&quot;{assessmentFeedback.free_text}&quot;</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleChangeAssessment}
                  className={`text-xs shrink-0 ml-3 px-2 py-1 rounded border transition-colors ${
                    assessmentFeedback.action === "accepted"
                      ? "text-risk-low border-risk-low/30 hover:bg-risk-low/10"
                      : "text-risk-high border-risk-high/30 hover:bg-risk-high/10"
                  }`}
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleAssessmentAccept}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-risk-low-bg text-risk-low border border-risk-low/20 rounded-md hover:bg-risk-low/10 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Yes
                </button>
                <button
                  onClick={() => {
                    trackEvent("reject_modal_opened", { patient_id: patient.patient_id, type: "assessment" });
                    setShowRejectModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-risk-high-bg text-risk-high border border-risk-high/20 rounded-md hover:bg-risk-high/10 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  No
                </button>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>}

    {/* Risk Score Breakdown */}
    {show("breakdown") && <RiskBreakdown risk={risk} />}

    {/* Key Risk Factors */}
    {show("risk-factors") && <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-3">Key Risk Factors</h2>
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-3 bg-border rounded w-full" />
          <div className="h-3 bg-border rounded w-5/6" />
          <div className="h-3 bg-border rounded w-4/6" />
        </div>
      ) : narrative && narrative.key_risk_factors.length > 0 ? (
        <>
        <div className="text-xs text-risk-medium bg-risk-medium-bg border border-risk-medium/20 rounded px-3 py-2 mb-3">
          <strong>AI-generated content</strong> — verify against patient profile
        </div>
        <div className="space-y-2">
          {narrative.key_risk_factors.map((rf, i) => (
            <div key={i} className="text-sm border border-border rounded p-3">
              <div className="flex justify-end mb-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted">Confidence:</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${CONFIDENCE_STYLES[rf.confidence]}`}
                  >
                    {rf.confidence.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="mb-1">
                <span className="font-medium">{rf.factor}</span>
              </div>
              <p className="text-muted text-xs">{rf.evidence}</p>
              <p className="text-xs mt-1">{rf.contribution}</p>
            </div>
          ))}
        </div>
        </>
      ) : (
        <p className="text-sm text-muted">No key risk factors identified.</p>
      )}
    </div>}

    {/* Data Gaps */}
    {show("data-gaps") && (
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-3">Data Gaps</h2>
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-3 bg-border rounded w-full" />
            <div className="h-3 bg-border rounded w-5/6" />
            <div className="h-3 bg-border rounded w-4/6" />
          </div>
        ) : narrative && narrative.data_gaps.length > 0 ? (
          <>
            <div className="text-xs text-risk-medium bg-risk-medium-bg border border-risk-medium/20 rounded px-3 py-2 mb-3">
              <strong>AI-generated content</strong> — verify against patient profile
            </div>
            <ul className="text-sm space-y-1">
              {narrative.data_gaps.map((gap, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-risk-medium mt-0.5">!</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-sm text-muted">No data gaps identified.</p>
        )}
      </div>
    )}

    {/* Limitations */}
    {show("limitations") && (
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-3">Limitations</h2>
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-3 bg-border rounded w-full" />
            <div className="h-3 bg-border rounded w-5/6" />
            <div className="h-3 bg-border rounded w-4/6" />
          </div>
        ) : narrative && narrative.limitations.length > 0 ? (
          <>
            <div className="text-xs text-risk-medium bg-risk-medium-bg border border-risk-medium/20 rounded px-3 py-2 mb-3">
              <strong>AI-generated content</strong> — verify against patient profile
            </div>
            <ul className="text-sm text-muted space-y-1 list-disc list-inside">
              {narrative.limitations.map((lim, i) => (
                <li key={i}>{lim}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-sm text-muted">No limitations identified.</p>
        )}
      </div>
    )}

    {/* Clinical References */}
    {show("references") && (
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-3">Clinical References</h2>
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-3 bg-border rounded w-full" />
            <div className="h-3 bg-border rounded w-5/6" />
            <div className="h-3 bg-border rounded w-4/6" />
          </div>
        ) : narrative && narrative.clinical_references.length > 0 ? (
          <>
            <div className="text-xs text-risk-medium bg-risk-medium-bg border border-risk-medium/20 rounded px-3 py-2 mb-3">
              <strong>AI-generated content</strong> — verify against patient profile
            </div>
            <ul className="text-sm text-muted space-y-1 list-disc list-inside">
              {narrative.clinical_references.map((ref, i) => (
                <li key={i}>{ref}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-sm text-muted">No clinical references available.</p>
        )}
      </div>
    )}

    {/* Reject modal for assessment */}
    {showRejectModal && (
      <RejectModal
        onSubmit={(reasons, text) => handleAssessmentReject(reasons, text)}
        onCancel={() => {
          trackEvent("reject_modal_dismissed", { patient_id: patient.patient_id, type: "assessment" });
          handleAssessmentReject([], "");
        }}
      />
    )}

    </>
  );
}

const REJECTION_REASON_GROUPS = [
  { label: "Clinical Context", reasons: ["Missing important context", "Patient condition changed", "Contradicts care plan"] },
  { label: "Data Quality", reasons: ["Data incomplete", "Data incorrect"] },
];

function RejectModal({
  onSubmit,
  onCancel,
}: {
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
          <h3 className="text-base font-semibold">Feedback</h3>
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
