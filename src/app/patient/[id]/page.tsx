"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import type { Patient } from "@/lib/types";
import { getStoredPatients } from "@/lib/patient-store";
import { trackEvent } from "@/lib/analytics";
import PatientDetailClient from "./PatientDetailClient";
import PatientProfile from "@/components/PatientProfile";

export default function PatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const patients = getStoredPatients();
    const found = patients.find((p) => p.patient_id === id);
    if (found) {
      setPatient(found);
    }
    setLoading(false);
  }, [id]);

  // Close drawer on Escape
  useEffect(() => {
    if (!showProfile) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowProfile(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [showProfile]);

  // Prevent body scroll while drawer is open
  useEffect(() => {
    if (showProfile) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [showProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted">
        Loading...
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-20">
        <p className="text-muted mb-4">Patient not found.</p>
        <Link href="/" className="text-accent hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="text-sm text-accent hover:underline mb-2 inline-block"
            >
              &larr; Back to Dashboard
            </Link>
            <h1 className="text-2xl font-semibold">
              {patient.patient_id}{" "}
              <span className="text-muted font-normal text-lg">
                — {patient.admission.admitting_diagnosis}
              </span>
            </h1>
          </div>
          <button
            onClick={() => {
              setShowProfile(true);
              trackEvent("patient_profile_opened", { patient_id: patient.patient_id });
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Patient Profile
          </button>
        </div>
      </div>
      <PatientDetailClient patient={patient} />

      {/* Patient Profile Drawer */}
      {showProfile && (
        <div className="fixed inset-0 z-[100] flex justify-end" onClick={() => setShowProfile(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full max-w-lg bg-card border-l border-border shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold">Patient Profile</h2>
              <button
                onClick={() => setShowProfile(false)}
                className="text-muted hover:text-foreground transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5">
              <PatientProfile patient={patient} hideTitle />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
