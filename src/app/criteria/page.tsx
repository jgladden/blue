"use client";

import { useMemo, useState } from "react";
import { getAllPatients } from "@/lib/patients";
import { scorePatient } from "@/lib/scoring";
import { trackEvent } from "@/lib/analytics";

const SCORING_WEIGHTS = [
  { label: "Prior admissions 12mo: 4+", points: 25 },
  { label: "Charlson comorbidity index: 8+", points: 25 },
  { label: "Prior admissions 12mo: 2–3", points: 15 },
  { label: "Charlson comorbidity index: 5–7", points: 15 },
  { label: "Lives alone + no caregiver", points: 15 },
  { label: "Prior ED visits 12mo: 3+", points: 10 },
  { label: "No follow-up scheduled within 7 days", points: 10 },
  { label: "No PCP established", points: 10 },
  { label: "High-risk medication (insulin, IV, tapers, O2)", points: 10 },
  { label: "Prior admissions 12mo: 1", points: 5 },
  { label: "Limited transportation", points: 5 },
  { label: "Non-English preferred language", points: 5 },
  { label: "Length of stay 7+ days", points: 5 },
  { label: "6+ medications at discharge", points: 5 },
  { label: "Uninsured or Medicaid", points: 5 },
  { label: "Discharge to home without home health", points: 5 },
];

type Tab = "risk-factors" | "scoring";

export default function OverviewPage() {
  const [tab, setTab] = useState<Tab>("scoring");

  const topFactors = useMemo(() => {
    const patients = getAllPatients();
    const factorCounts: Record<string, number> = {};
    for (const p of patients) {
      const risk = scorePatient(p);
      for (const f of risk.factors) {
        const key = f.label
          .replace(/:\s*\d+.*$/, "")
          .replace(/\(.*\)/, "")
          .trim();
        factorCounts[key] = (factorCounts[key] || 0) + 1;
      }
    }
    return Object.entries(factorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);
  }, []);

  return (
    <div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-6">
        {([
          { key: "scoring", label: "Scoring Methodology" },
          { key: "risk-factors", label: "Common Risk Factors" },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => {
              trackEvent("overview_tab_switched", { tab: t.key });
              setTab(t.key);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
              tab === t.key
                ? "bg-card border border-border border-b-card text-foreground -mb-px"
                : "text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Scoring methodology */}
      {tab === "scoring" && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-1">Risk Scoring Methodology</h2>
          <p className="text-xs text-muted mb-4">
            Points are summed across all applicable factors. LOW: 0–19 | MEDIUM: 20–39 | HIGH: 40+
          </p>
          <div className="space-y-2">
            {SCORING_WEIGHTS.map((w) => (
              <div key={w.label} className="flex items-center gap-3">
                <div
                  className="h-5 bg-accent/40 rounded"
                  style={{ width: `${(w.points / 25) * 100}%`, minWidth: "8px" }}
                />
                <span className="text-sm font-semibold text-accent whitespace-nowrap">+{w.points}</span>
                <span className="text-sm whitespace-nowrap">{w.label}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4 pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-risk-low" />
              <span className="text-xs text-muted">LOW 0–19</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-risk-medium" />
              <span className="text-xs text-muted">MEDIUM 20–39</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-risk-high" />
              <span className="text-xs text-muted">HIGH 40+</span>
            </div>
          </div>
        </div>
      )}

      {/* Common risk factors */}
      {tab === "risk-factors" && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">
            Most Common Risk Factors
          </h2>
          <div className="space-y-2">
            {topFactors.map(([factor, count]) => (
              <div key={factor} className="flex items-center gap-3">
                <div
                  className="h-5 bg-accent/40 rounded"
                  style={{
                    width: `${(count / 30) * 100}%`,
                    minWidth: "20px",
                  }}
                />
                <span className="text-sm font-semibold text-accent whitespace-nowrap">{count}</span>
                <span className="text-sm whitespace-nowrap">{factor}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
