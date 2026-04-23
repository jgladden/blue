"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Patient, RiskScore, InterventionStatusEntry } from "@/lib/types";
import { scorePatient } from "@/lib/scoring";
import { trackEvent } from "@/lib/analytics";
import { getAllAssignments } from "@/lib/assignments";
import { getAllInterventionStatuses } from "@/lib/interventions";
import RiskBadge from "./RiskBadge";
import PatientDrawer from "./PatientDrawer";
import DateRangePicker from "./DateRangePicker";

type SortKey = "score" | "age" | "name" | "diagnosis" | "admitted";
type SortDir = "asc" | "desc";

interface PatientRow {
  patient: Patient;
  risk: RiskScore;
}

export default function PatientDashboard({
  patients,
}: {
  patients: Patient[];
}) {
  const router = useRouter();
  const [sortKey, setSortKey] = useState<SortKey>("admitted");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [drawerPatient, setDrawerPatient] = useState<Patient | null>(null);
  const [search, setSearch] = useState("");
  const [dateKey, setDateKey] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filterAssigned, setFilterAssigned] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [assignmentMap, setAssignmentMap] = useState<Record<string, string>>({});
  const [interventionStatusMap, setInterventionStatusMap] = useState<Record<string, InterventionStatusEntry[]>>({});

  useEffect(() => {
    const map: Record<string, string> = {};
    for (const a of getAllAssignments()) {
      map[a.patient_id] = a.assigned_to;
    }
    setAssignmentMap(map);
  }, [patients]);

  useEffect(() => {
    const all = getAllInterventionStatuses();
    const map: Record<string, InterventionStatusEntry[]> = {};
    for (const entry of all) {
      if (!map[entry.patient_id]) map[entry.patient_id] = [];
      map[entry.patient_id].push(entry);
    }
    setInterventionStatusMap(map);
  }, [patients]);

  const assignees = useMemo(
    () => [...new Set(Object.values(assignmentMap))].sort(),
    [assignmentMap]
  );

  const rows: PatientRow[] = useMemo(
    () => patients.map((p) => ({ patient: p, risk: scorePatient(p) })),
    [patients]
  );



  const filtered = useMemo(() => {
    let result = rows;
    if (search.length >= 2) {
      const q = search.toLowerCase();
      result = result.filter((r) => {
        const p = r.patient;
        return (
          p.patient_id.toLowerCase().includes(q) ||
          p.admission.admitting_diagnosis.toLowerCase().includes(q) ||
          p.demographics.race.toLowerCase().includes(q) ||
          p.demographics.preferred_language.toLowerCase().includes(q) ||
          p.demographics.insurance_type.toLowerCase().includes(q) ||
          p.clinical_history.chronic_conditions.some((c) =>
            c.toLowerCase().includes(q)
          )
        );
      });
    }
    if (filterLevel !== "all") {
      result = result.filter((r) => r.risk.level === filterLevel);
    }
    if (filterAssigned !== "all") {
      if (filterAssigned === "unassigned") {
        result = result.filter((r) => !assignmentMap[r.patient.patient_id]);
      } else {
        result = result.filter((r) => assignmentMap[r.patient.patient_id] === filterAssigned);
      }
    }
    if (filterStatus !== "all") {
      result = result.filter((r) => getPatientStatus(r.patient.patient_id) === filterStatus);
    }
    if (dateFrom) {
      result = result.filter((r) => r.patient.admission.admit_date >= dateFrom);
    }
    if (dateTo) {
      result = result.filter((r) => r.patient.admission.admit_date <= dateTo);
    }
    return result;
  }, [rows, search, filterLevel, filterAssigned, filterStatus, assignmentMap, interventionStatusMap, dateFrom, dateTo]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "score":
          cmp = a.risk.total - b.risk.total;
          break;
        case "age":
          cmp = a.patient.demographics.age - b.patient.demographics.age;
          break;
        case "name":
          cmp = a.patient.patient_id.localeCompare(b.patient.patient_id);
          break;
        case "diagnosis":
          cmp = a.patient.admission.admitting_diagnosis.localeCompare(
            b.patient.admission.admitting_diagnosis
          );
          break;
        case "admitted":
          cmp = a.patient.admission.admit_date.localeCompare(
            b.patient.admission.admit_date
          );
          break;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    const newDir = sortKey === key && sortDir === "desc" ? "asc" : "desc";
    setSortKey(key);
    setSortDir(newDir);
    trackEvent("dashboard_sort", { sort_column: key, sort_direction: newDir });
  }

  function handleFilter(type: string, value: string) {
    trackEvent("dashboard_filter", { filter_type: type, filter_value: value });
    switch (type) {
      case "level":
        setFilterLevel(value);
        break;
    }
  }

  function getPatientStatus(patientId: string): "Open" | "Assigned" | "In Progress" | "Complete" {
    if (!assignmentMap[patientId]) return "Open";
    const statuses = interventionStatusMap[patientId];
    if (!statuses || statuses.length === 0) return "Assigned";
    const allComplete = statuses.every(
      (s) => s.status === "completed" || s.status === "not_applicable"
    );
    if (allComplete) return "Complete";
    const anyInProgress = statuses.some((s) => s.status === "in_progress");
    if (anyInProgress) return "In Progress";
    return "Assigned";
  }

  const SortHeader = ({
    label,
    field,
  }: {
    label: string;
    field: SortKey;
  }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider cursor-pointer hover:text-foreground select-none whitespace-nowrap"
      onClick={() => handleSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sortKey === field && (
          <span className="text-accent">{sortDir === "desc" ? "↓" : "↑"}</span>
        )}
      </span>
    </th>
  );

  const distribution = useMemo(() => {
    const levels = { HIGH: { total: 0, scoreSum: 0 }, MEDIUM: { total: 0, scoreSum: 0 }, LOW: { total: 0, scoreSum: 0 } };
    for (const r of rows) {
      levels[r.risk.level].total++;
      levels[r.risk.level].scoreSum += r.risk.total;
    }
    return levels;
  }, [rows]);

  return (
    <div>
      {/* Risk distribution cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {(["HIGH", "MEDIUM", "LOW"] as const).map((level) => {
          const isActive = filterLevel === level;
          return (
            <button
              key={level}
              onClick={() => {
                trackEvent("risk_card_clicked", { level, action: isActive ? "cleared" : "selected" });
                handleFilter("level", isActive ? "all" : level);
              }}
              className={`bg-card border rounded-lg p-4 text-center transition-colors cursor-pointer ${
                isActive
                  ? level === "HIGH"
                    ? "border-risk-high ring-2 ring-risk-high/20"
                    : level === "MEDIUM"
                    ? "border-risk-medium ring-2 ring-risk-medium/20"
                    : "border-risk-low ring-2 ring-risk-low/20"
                  : "border-border hover:border-muted/40"
              }`}
            >
              <div className="text-3xl font-bold mb-1">{distribution[level].total}</div>
              <RiskBadge level={level} />
              <div className="text-xs text-muted mt-1">
                Avg: {distribution[level].total > 0 ? Math.round(distribution[level].scoreSum / distribution[level].total) : 0} / 200 pts
              </div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (e.target.value.length >= 2) {
              trackEvent("patient_search", { query: e.target.value });
            }
          }}
          placeholder="Search patients..."
          className="text-sm border border-border rounded-md px-3 py-1.5 bg-card w-80"
        />
        <select
          value={filterLevel}
          onChange={(e) => handleFilter("level", e.target.value)}
          className="text-sm border border-border rounded-md pl-3 pr-10 py-1.5 bg-card appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_0.75rem_center] bg-no-repeat"
        >
          <option value="all">All risk levels</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <select
          value={filterAssigned}
          onChange={(e) => setFilterAssigned(e.target.value)}
          className="text-sm border border-border rounded-md pl-3 pr-10 py-1.5 bg-card appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_0.75rem_center] bg-no-repeat"
        >
          <option value="all">All assigned</option>
          <option value="unassigned">Unassigned</option>
          {assignees.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-sm border border-border rounded-md pl-3 pr-10 py-1.5 bg-card appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_0.75rem_center] bg-no-repeat"
        >
          <option value="all">All statuses</option>
          <option value="Open">Open</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Complete">Complete</option>
        </select>
        <DateRangePicker
          value={dateKey}
          onChange={(key, f, t) => {
            setDateKey(key);
            setDateFrom(f);
            setDateTo(t);
          }}
        />
        <span className="text-sm text-muted self-center ml-auto">
          {sorted.length} of {rows.length} patients
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-border rounded-lg bg-card">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-background">
            <tr>
              <SortHeader label="Patient ID" field="name" />
              <SortHeader label="Diagnosis" field="diagnosis" />
              <SortHeader label="Admitted" field="admitted" />
              <SortHeader label="Risk Score" field="score" />
              <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider whitespace-nowrap">
                Assigned To
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Status
              </th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.map(({ patient: p, risk }) => {
              const status = getPatientStatus(p.patient_id);
              return (
              <tr
                key={p.patient_id}
                className="hover:bg-accent-light/50 transition-colors cursor-pointer"
                onClick={() => {
                  trackEvent("patient_detail_opened", {
                    patient_id: p.patient_id,
                    risk_level: risk.level,
                    risk_score: risk.total,
                  });
                  router.push(`/patient/${p.patient_id}`);
                }}
              >
                <td className="px-5 py-5 text-sm">
                  <button
                    className="font-medium text-accent hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      trackEvent("patient_drawer_opened", {
                        patient_id: p.patient_id,
                        risk_level: risk.level,
                        risk_score: risk.total,
                      });
                      setDrawerPatient(p);
                    }}
                  >
                    {p.patient_id}
                  </button>
                </td>
                <td className="px-5 py-5 text-sm">
                  {p.admission.admitting_diagnosis}
                </td>
                <td className="px-5 py-5 text-sm whitespace-nowrap">
                  {new Date(p.admission.admit_date + "T00:00:00").toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })}
                </td>
                <td className="px-5 py-5 text-sm">
                  <RiskBadge level={risk.level} score={risk.total} />
                </td>
                <td className="px-5 py-5 text-sm text-muted">
                  {assignmentMap[p.patient_id] || "—"}
                </td>
                <td className="px-5 py-5 text-sm">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    status === "Open" ? "bg-yellow-100 text-yellow-800" :
                    status === "Assigned" ? "bg-blue-100 text-blue-800" :
                    status === "In Progress" ? "bg-purple-100 text-purple-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {status === "In Progress" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                    )}
                    {status}
                  </span>
                </td>
                <td className="px-2 py-5 text-muted">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Patient drawer */}
      {drawerPatient && (
        <PatientDrawer
          patient={drawerPatient}
          onClose={() => setDrawerPatient(null)}
        />
      )}
    </div>
  );
}
