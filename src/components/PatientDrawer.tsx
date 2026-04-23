"use client";

import { useEffect } from "react";
import type { Patient } from "@/lib/types";
import { scorePatient } from "@/lib/scoring";
import PatientProfile from "./PatientProfile";
import RiskBreakdown from "./RiskBreakdown";
import RiskBadge from "./RiskBadge";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

export default function PatientDrawer({
  patient,
  onClose,
}: {
  patient: Patient;
  onClose: () => void;
}) {
  const risk = scorePatient(patient);

  function handleClose() {
    trackEvent("patient_drawer_closed", { patient_id: patient.patient_id });
    onClose();
  }

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end" onClick={handleClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Drawer */}
      <div
        className="relative w-full max-w-lg bg-card border-l border-border shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">{patient.patient_id}</h2>
              <RiskBadge level={risk.level} score={risk.total} />
            </div>
            <p className="text-sm text-muted mt-0.5">
              {patient.admission.admitting_diagnosis}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/patient/${patient.patient_id}`}
              className="text-xs px-3 py-1.5 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
            >
              Full Details
            </Link>
            <button
              onClick={handleClose}
              className="text-muted hover:text-foreground transition-colors p-1"
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
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          <RiskBreakdown risk={risk} />
          <PatientProfile patient={patient} />
        </div>
      </div>
    </div>
  );
}
