import type { RiskScore } from "@/lib/types";
import RiskBadge from "./RiskBadge";

export default function RiskBreakdown({ risk }: { risk: RiskScore }) {
  const maxPossible = 200; // rough max for bar width scaling
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Risk Score Breakdown</h2>
        <RiskBadge level={risk.level} score={risk.total} />
      </div>

      {/* Score bar */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-muted mb-1">
          <span>0</span>
          <span>LOW &lt;20</span>
          <span>MEDIUM 20-39</span>
          <span>HIGH 40+</span>
        </div>
        <div className="w-full h-3 bg-background rounded-full overflow-hidden relative">
          {/* Tier markers */}
          <div
            className="absolute top-0 bottom-0 w-px bg-border"
            style={{ left: `${(20 / maxPossible) * 100}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-px bg-border"
            style={{ left: `${(40 / maxPossible) * 100}%` }}
          />
          {/* Score fill */}
          <div
            className={`h-full rounded-full transition-all ${
              risk.level === "HIGH"
                ? "bg-risk-high"
                : risk.level === "MEDIUM"
                ? "bg-risk-medium"
                : "bg-risk-low"
            }`}
            style={{
              width: `${Math.min((risk.total / maxPossible) * 100, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Factor list */}
      <div className="space-y-2">
        {risk.factors.map((f, i) => (
          <div
            key={i}
            className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0"
          >
            <span>{f.label}</span>
            <span className="font-semibold text-risk-high">+{f.points}</span>
          </div>
        ))}
        {risk.factors.length === 0 && (
          <p className="text-sm text-muted">No contributing risk factors</p>
        )}
      </div>
    </div>
  );
}
