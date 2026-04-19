"use client";

import { getStatusColor } from "@/lib/utils";

export default function StatusBadge({ status }) {
  const colors = getStatusColor(status);
  const label = (status || "DRAFT").replace(/_/g, " ");

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${colors.bg} ${colors.text} ${colors.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} animate-pulse`} />
      {label}
    </span>
  );
}
