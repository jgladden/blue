"use client";

import { useCallback } from "react";

function today() {
  return new Date().toISOString().split("T")[0];
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

function firstOfMonth() {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().split("T")[0];
}

const OPTIONS = [
  { label: "All dates", key: "all" },
  { label: "Today", key: "today" },
  { label: "Last 7 Days", key: "week" },
  { label: "Last 30 Days", key: "30days" },
] as const;

function getRange(key: string): { from: string; to: string } {
  switch (key) {
    case "today":
      return { from: today(), to: today() };
    case "week":
      return { from: daysAgo(7), to: today() };
    case "30days":
      return { from: daysAgo(30), to: today() };
    default:
      return { from: "", to: "" };
  }
}

export default function DateRangePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (key: string, from: string, to: string) => void;
}) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const key = e.target.value;
      const range = getRange(key);
      onChange(key, range.from, range.to);
    },
    [onChange]
  );

  return (
    <select
      value={value}
      onChange={handleChange}
      className="text-sm border border-border rounded-md pl-3 pr-10 py-1.5 bg-card appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_0.75rem_center] bg-no-repeat"
    >
      {OPTIONS.map((o) => (
        <option key={o.key} value={o.key}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
