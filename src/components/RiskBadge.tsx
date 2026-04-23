import type { RiskScore } from "@/lib/types";

const styles: Record<
  RiskScore["level"],
  string
> = {
  HIGH: "bg-risk-high-bg text-risk-high border-risk-high/20",
  MEDIUM: "bg-risk-medium-bg text-risk-medium border-risk-medium/20",
  LOW: "bg-risk-low-bg text-risk-low border-risk-low/20",
};

export default function RiskBadge({
  level,
  score,
}: {
  level: RiskScore["level"];
  score?: number;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[level]}`}
    >
      {level}
      {score !== undefined && (
        <span className="font-normal opacity-75">({score})</span>
      )}
    </span>
  );
}
