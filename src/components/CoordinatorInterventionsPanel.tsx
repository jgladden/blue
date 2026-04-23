"use client";

import { useState, useEffect } from "react";
import type { CoordinatorIntervention, CoordinatorInterventionStatus } from "@/lib/types";
import {
  getCoordinatorInterventions,
  addCoordinatorIntervention,
  updateCoordinatorInterventionStatus,
} from "@/lib/coordinator-interventions";
import { trackEvent } from "@/lib/analytics";

export default function CoordinatorInterventionsPanel({
  patientId,
}: {
  patientId: string;
}) {
  const [interventions, setInterventions] = useState<CoordinatorIntervention[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setInterventions(getCoordinatorInterventions(patientId));
  }, [patientId]);

  function handleAdd(intervention: CoordinatorIntervention) {
    addCoordinatorIntervention(intervention);
    setInterventions(getCoordinatorInterventions(patientId));
    setShowModal(false);
    trackEvent("coordinator_intervention_added", {
      patient_id: patientId,
      priority: intervention.priority,
    });
  }

  function handleStatusChange(id: string, status: CoordinatorInterventionStatus) {
    updateCoordinatorInterventionStatus(id, status);
    setInterventions(getCoordinatorInterventions(patientId));
    trackEvent("coordinator_intervention_status_changed", {
      patient_id: patientId,
      intervention_id: id,
      status,
    });
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Coordinator Interventions</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Intervention
        </button>
      </div>

      {interventions.length === 0 ? (
        <p className="text-sm text-muted">No coordinator recommendations added yet.</p>
      ) : (
        <div className="space-y-2">
          {interventions.map((intv) => (
            <div key={intv.id} className="text-sm border border-border rounded p-3">
              <div className={`text-sm font-semibold uppercase tracking-wider mb-1 ${
                intv.priority === "high"
                  ? "text-risk-high"
                  : intv.priority === "medium"
                  ? "text-risk-medium"
                  : "text-risk-low"
              }`}>
                {intv.priority} priority
              </div>
              <div className="mb-1">
                <span className="font-medium">{intv.title}</span>
              </div>
              <p className="text-muted text-xs">{intv.subtitle}</p>

              <div className="mt-2 pt-2 border-t border-border flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">Status:</span>
                <select
                  value={intv.status}
                  onChange={(e) =>
                    handleStatusChange(intv.id, e.target.value as CoordinatorInterventionStatus)
                  }
                  className={`text-xs border rounded px-2 py-1 ${
                    intv.status === "completed"
                      ? "border-risk-low/30 bg-risk-low-bg text-risk-low"
                      : intv.status === "in_progress"
                      ? "border-risk-medium/30 bg-risk-medium-bg text-risk-medium"
                      : "border-border bg-background text-foreground"
                  }`}
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddRecommendationModal
          patientId={patientId}
          onSubmit={handleAdd}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

function AddRecommendationModal({
  patientId,
  onSubmit,
  onCancel,
}: {
  patientId: string;
  onSubmit: (intervention: CoordinatorIntervention) => void;
  onCancel: () => void;
}) {
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  function handleSubmit() {
    onSubmit({
      id: crypto.randomUUID(),
      patient_id: patientId,
      priority,
      title: title.trim(),
      subtitle: subtitle.trim(),
      status: "not_started",
      created_at: new Date().toISOString(),
    });
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-lg mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold">Add Intervention</h3>
          <button onClick={onCancel} className="text-muted hover:text-foreground transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-muted mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as "high" | "medium" | "low")}
              className="w-full text-sm border border-border rounded-md px-3 py-2 bg-background"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-muted mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Schedule follow-up with cardiology"
              className="w-full text-sm border border-border rounded-md px-3 py-2 bg-background"
            />
          </div>

          <div>
            <label className="block text-xs text-muted mb-1">Description</label>
            <textarea
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Patient needs cardiology follow-up within 7 days of discharge"
              className="w-full text-sm border border-border rounded-md px-3 py-2 bg-background resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-5">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="px-4 py-2 text-sm bg-accent text-white rounded-md hover:bg-accent/90 disabled:opacity-50 transition-colors"
          >
            Add Intervention
          </button>
        </div>
      </div>
    </div>
  );
}
