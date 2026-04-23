"use client";

import { useState, useEffect } from "react";
import type { PatientAssignment, PatientOutcome } from "@/lib/types";
import { getAssignment, setAssignment, removeAssignment } from "@/lib/assignments";
import { getOutcome, setOutcome } from "@/lib/outcomes";
import { trackEvent } from "@/lib/analytics";

export default function PatientStatusPanel({
  patientId,
  dischargeDate,
}: {
  patientId: string;
  dischargeDate: string;
}) {
  const [assignment, setAssignmentState] = useState<PatientAssignment | null>(null);
  const [assignInput, setAssignInput] = useState("");
  const [outcome, setOutcomeState] = useState<PatientOutcome | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const a = getAssignment(patientId);
    setAssignmentState(a);
    setAssignInput(a?.assigned_to ?? "");
    setOutcomeState(getOutcome(patientId));
    setMounted(true);
  }, [patientId]);

  function handleAssign() {
    if (!assignInput.trim()) return;
    setAssignment(patientId, assignInput.trim());
    setAssignmentState({
      patient_id: patientId,
      assigned_to: assignInput.trim(),
      assigned_at: new Date().toISOString(),
    });
    trackEvent("patient_assigned", {
      patient_id: patientId,
      assigned_to: assignInput.trim(),
    });
  }

  // Calculate 30-day outcome date
  const outcomeDate = new Date(dischargeDate + "T00:00:00");
  outcomeDate.setDate(outcomeDate.getDate() + 30);
  const outcomeDateStr = outcomeDate.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const canRecordOutcome = mounted && (() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now >= outcomeDate;
  })();

  function handleOutcomeToggle(checked: boolean) {
    const entry: PatientOutcome = {
      patient_id: patientId,
      readmitted: checked,
      updated_at: new Date().toISOString(),
    };
    setOutcome(entry);
    setOutcomeState(entry);
    trackEvent("patient_outcome_recorded", {
      patient_id: patientId,
      readmitted: checked,
    });
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      {/* Assignment */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Assigned To</h3>
        <div className="flex gap-2">
          <select
            value={assignInput}
            onChange={(e) => {
              setAssignInput(e.target.value);
              if (e.target.value) {
                setAssignment(patientId, e.target.value);
                setAssignmentState({
                  patient_id: patientId,
                  assigned_to: e.target.value,
                  assigned_at: new Date().toISOString(),
                });
                trackEvent("patient_assigned", {
                  patient_id: patientId,
                  assigned_to: e.target.value,
                });
              } else {
                removeAssignment(patientId);
                setAssignmentState(null);
                trackEvent("patient_unassigned", { patient_id: patientId });
              }
            }}
            className="flex-1 text-sm border border-border rounded-md px-3 py-1.5 bg-background"
          >
            <option value="">Select coordinator...</option>
            <option value="Me">Me</option>
            <option value="Sarah Chen">Sarah Chen</option>
            <option value="Marcus Rivera">Marcus Rivera</option>
            <option value="Amy Patel">Amy Patel</option>
            <option value="James Okafor">James Okafor</option>
            <option value="Lisa Tran">Lisa Tran</option>
          </select>
          {assignment && (
            <span className="text-xs text-muted self-center whitespace-nowrap">
              Assigned {new Date(assignment.assigned_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
