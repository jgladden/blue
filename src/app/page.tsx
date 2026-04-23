"use client";

import { useState, useEffect, useCallback } from "react";
import type { Patient } from "@/lib/types";
import {
  getStoredPatients,
  seedIfEmpty,
  addPatient,
  generateRandomPatient,
} from "@/lib/patient-store";
import { scorePatient } from "@/lib/scoring";
import PatientDashboard from "@/components/PatientDashboard";
import { trackEvent } from "@/lib/analytics";
import Link from "next/link";

export default function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [syncing, setSyncing] = useState(false);

  const refreshPatients = useCallback(() => {
    setPatients(getStoredPatients());
  }, []);

  useEffect(() => {
    seedIfEmpty();
    refreshPatients();
  }, [refreshPatients]);

  function handleRefreshEHR() {
    trackEvent("ehr_refresh_requested");
    setSyncing(true);
    setTimeout(() => {
      const newPatient = generateRandomPatient();
      addPatient(newPatient);
      refreshPatients();
      trackEvent("ehr_refresh_completed", { patient_id: newPatient.patient_id });
      setSyncing(false);
    }, 3000);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Patient Dashboard</h1>
          <p className="text-base text-muted mt-1">
            Readmission risk assessment of patients admitted over last 30 days.
          </p>
        </div>
        <button
          onClick={handleRefreshEHR}
          disabled={syncing}
          className="flex items-center gap-1.5 px-4 py-2 text-sm bg-accent text-white rounded-md hover:bg-accent/90 disabled:opacity-70 transition-colors"
        >
          <svg
            className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h5M20 20v-5h-5M20.49 9A9 9 0 005.64 5.64L4 4m16 16l-1.64-1.64A9 9 0 014.51 15"
            />
          </svg>
          {syncing ? "Syncing..." : "Sync EHR Patient Data"}
        </button>
      </div>

      {/* Discharging today alert */}
      {(() => {
        const today = new Date().toISOString().split("T")[0];
        const admittedToday = patients.filter(
          (p) => p.admission.admit_date === today
        );
        const highRisk = admittedToday.filter(
          (p) => scorePatient(p).level === "HIGH"
        );
        if (admittedToday.length === 0) return null;
        return (
          <div
            className={`mb-4 rounded-lg px-4 py-3 border flex items-center justify-between ${
              highRisk.length > 0
                ? "bg-risk-high-bg border-risk-high/20"
                : "bg-risk-medium-bg border-risk-medium/20"
            }`}
          >
            <div className="flex items-center gap-2">
              <svg
                className={`w-5 h-5 shrink-0 ${
                  highRisk.length > 0 ? "text-risk-high" : "text-risk-medium"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              <span className="text-sm font-medium">
                {admittedToday.length} patient{admittedToday.length !== 1 ? "s" : ""} admitted today
                {highRisk.length > 0 && (
                  <span className="text-risk-high font-semibold">
                    {" "}— {highRisk.length} HIGH risk
                  </span>
                )}
              </span>
            </div>
            <div className="flex gap-2">
              {highRisk.slice(0, 3).map((p) => (
                <Link
                  key={p.patient_id}
                  href={`/patient/${p.patient_id}`}
                  className="text-xs px-2 py-1 bg-card border border-border rounded hover:border-accent transition-colors"
                >
                  {p.patient_id}
                </Link>
              ))}
            </div>
          </div>
        );
      })()}

      {patients.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <p className="text-muted mb-4">No patient data available.</p>
          <button
            onClick={handleRefreshEHR}
            disabled={syncing}
            className="px-4 py-2 text-sm bg-accent text-white rounded-md hover:bg-accent/90 disabled:opacity-70 transition-colors"
          >
            {syncing ? "Syncing..." : "Sync EHR Patient Data"}
          </button>
        </div>
      ) : (
        <PatientDashboard patients={patients} />
      )}
    </div>
  );
}
