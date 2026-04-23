"use client";

import { useState, useEffect } from "react";
import { scorePatient } from "@/lib/scoring";
import { getAllInterventionStatuses } from "@/lib/interventions";
import { getStoredPatients } from "@/lib/patient-store";
import type { Patient, InterventionStatusEntry, CoordinatorIntervention } from "@/lib/types";

export default function OutcomesPage() {
  const [patients, setPatients] = useState<Patient[]>([]);

  const [interventionStatuses, setInterventionStatuses] = useState<InterventionStatusEntry[]>([]);
  const [coordinatorInterventions, setCoordinatorInterventions] = useState<CoordinatorIntervention[]>([]);
  const [totalAIInterventions, setTotalAIInterventions] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPatients(getStoredPatients());

    setInterventionStatuses(getAllInterventionStatuses());
    // Count total AI interventions only for patients with interaction
    try {
      const narratives = JSON.parse(localStorage.getItem("aiclin_narratives") || "[]");
      const statuses = getAllInterventionStatuses();
      const patientsWithInteraction = new Set(statuses.map((s) => s.patient_id));
      let aiCount = 0;
      for (const n of narratives) {
        if (patientsWithInteraction.has(n.patient_id)) {
          aiCount += n.narrative?.recommended_interventions?.length ?? 0;
        }
      }
      setTotalAIInterventions(aiCount);
    } catch { /* silent */ }
    try {
      const allCoord = JSON.parse(localStorage.getItem("aiclin_coordinator_interventions") || "[]");
      setCoordinatorInterventions(allCoord);
    } catch { /* silent */ }
    setMounted(true);
  }, []);

  return (
    <div>

      {!mounted ? (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">30-Day Outcome Rates</h2>
            <div className="space-y-3 animate-pulse">
              <div className="h-3 bg-border rounded w-full" />
              <div className="h-3 bg-border rounded w-5/6" />
              <div className="h-3 bg-border rounded w-4/6" />
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Estimated Cost Avoidance</h2>
            <div className="space-y-3 animate-pulse">
              <div className="h-3 bg-border rounded w-full" />
              <div className="h-3 bg-border rounded w-5/6" />
              <div className="h-3 bg-border rounded w-4/6" />
            </div>
          </div>
        </div>
      ) : (
      <div className="space-y-6">
        {/* Outcome rates */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">30-Day Outcome Rates</h2>
          <div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold">267</div>
                <div className="text-xs text-muted">Total patients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-risk-low">226</div>
                <div className="text-xs text-muted">Not readmitted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-risk-high">41</div>
                <div className="text-xs text-muted">Readmitted</div>
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <h3 className="text-sm font-semibold mb-2">Readmission Rate</h3>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex-1 h-3 bg-risk-low/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-risk-high rounded-full"
                    style={{ width: "15.4%" }}
                  />
                </div>
                <span className="text-sm font-semibold">15.4%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cost avoidance calculator */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Estimated Cost Avoidance</h2>
          {(() => {
            const pts = getStoredPatients();
            const highRiskCount = pts.filter((p) => scorePatient(p).level === "HIGH").length;
            const medRiskCount = pts.filter((p) => scorePatient(p).level === "MEDIUM").length;

            const aiNotApplicable = interventionStatuses.filter(
              (s) => s.status === "not_applicable"
            ).length;
            const aiAccepted = interventionStatuses.filter(
              (s) => s.status === "in_progress" || s.status === "completed"
            ).length;
            const coordAccepted = coordinatorInterventions.filter(
              (c) => c.status === "in_progress" || c.status === "completed"
            ).length;
            const totalAccepted = aiAccepted + coordAccepted;
            const totalInterventions = (totalAIInterventions - aiNotApplicable) + coordinatorInterventions.length;
            const acceptanceRate = totalInterventions > 0
              ? totalAccepted / totalInterventions
              : 0;

            const completedAI = interventionStatuses.filter(
              (s) => s.status === "completed"
            ).length;
            const completedCoordinator = coordinatorInterventions.filter(
              (c) => c.status === "completed"
            ).length;
            const completedStatuses = completedAI + completedCoordinator;
            const completionRate = totalInterventions > 0
              ? completedStatuses / totalInterventions
              : 0;

            const avgCost = 20000;
            const highPrevention = 0.15;
            const medPrevention = 0.08;
            const highSavings = Math.round(highRiskCount * completionRate * highPrevention * avgCost);
            const medSavings = Math.round(medRiskCount * completionRate * medPrevention * avgCost);
            const totalSavings = highSavings + medSavings;

            return (
              <div>
                {/* Summary stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                  <div>
                    <div className="text-2xl font-bold">
                      {totalInterventions > 0
                        ? `${Math.round(acceptanceRate * 100)}%`
                        : "0%"}
                    </div>
                    <div className="text-xs text-muted">Intervention acceptance rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{Math.round(completionRate * 100)}%</div>
                    <div className="text-xs text-muted">Intervention completion rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-risk-low">
                      ${totalSavings.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted">Total estimated cost avoidance</div>
                  </div>
                </div>

                {/* Breakdown by tier */}
                <div className="border-t border-border pt-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-muted uppercase tracking-wider">
                        <th className="text-left pb-2">Risk Tier</th>
                        <th className="text-right pb-2">Patients</th>
                        <th className="text-right pb-2">Completion Rate</th>
                        <th className="text-right pb-2">Prevention Rate</th>
                        <th className="text-right pb-2">Avg Cost</th>
                        <th className="text-right pb-2">Est. Savings</th>
                      </tr>
                    </thead>
                    <tbody className="border-t border-border">
                      <tr className="border-b border-border">
                        <td className="py-2 font-semibold text-risk-high">HIGH</td>
                        <td className="py-2 text-right">{highRiskCount}</td>
                        <td className="py-2 text-right">{Math.round(completionRate * 100)}%</td>
                        <td className="py-2 text-right">15%</td>
                        <td className="py-2 text-right">$20,000</td>
                        <td className="py-2 text-right font-semibold">${highSavings.toLocaleString()}</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2 font-semibold text-risk-medium">MEDIUM</td>
                        <td className="py-2 text-right">{medRiskCount}</td>
                        <td className="py-2 text-right">{Math.round(completionRate * 100)}%</td>
                        <td className="py-2 text-right">8%</td>
                        <td className="py-2 text-right">$20,000</td>
                        <td className="py-2 text-right font-semibold">${medSavings.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold" colSpan={5}>Total</td>
                        <td className="py-2 text-right font-bold text-risk-low">${totalSavings.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-border pt-3 mt-4">
                  <p className="text-xs text-muted">
                    Patients x completion rate x prevention rate x $20,000 avg readmission cost.
                    {totalInterventions > 0
                      ? ` Completion rate based on ${completedStatuses} of ${totalInterventions} interventions completed (AI + coordinator).`
                      : ""}
                    {" "}Prevention rate: 15% for HIGH-risk, 8% for MEDIUM-risk.
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
      )}
    </div>
  );
}
