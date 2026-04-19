"use client";

import { motion } from "framer-motion";
import { formatDateTime } from "@/lib/utils";
import StatusBadge from "./StatusBadge";

export default function RejectionTable({ documents, selectedIndex, onSelect, onDoubleClick, loading }) {
  if (loading) {
    return (
      <div className="glass-card overflow-hidden">
        <div className="p-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-4 mb-4">
              {Array.from({ length: 6 }).map((_, j) => (
                <div
                  key={j}
                  className="h-5 rounded-md shimmer flex-1"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    animationDelay: `${(i + j) * 0.1}s`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!documents.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-12 text-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-indigo-400">
            <path d="M9 12h6m-3-3v6m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Rejection Documents</h3>
        <p className="text-sm text-slate-400">
          Create your first rejection document to get started.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="glass-card overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-10" />
              <th>Rejection</th>
              <th>Model / Batch</th>
              <th>Department / Type</th>
              <th>Status</th>
              <th className="text-center">Items</th>
              <th className="text-center">Rejected Qty</th>
              <th className="text-center">Claimable</th>
              <th>Current Approver</th>
              <th>Claim No.</th>
              <th>Created By</th>
              <th>Created On</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => (
              <motion.tr
                key={doc.sapUuid || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.5), duration: 0.3 }}
                onClick={() => onSelect(index)}
                onDoubleClick={() => onDoubleClick && onDoubleClick(index)}
                className={`cursor-pointer ${selectedIndex === index ? "selected" : ""}`}
              >
                <td>
                  <div className="flex items-center justify-center">
                    <div
                      className={`w-4 h-4 rounded-md border-2 transition-all duration-200 ${
                        selectedIndex === index
                          ? "bg-indigo-500 border-indigo-500"
                          : "border-slate-600 hover:border-indigo-400"
                      }`}
                    >
                      {selectedIndex === index && (
                        <svg viewBox="0 0 12 12" className="w-full h-full text-white p-0.5">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <span className="text-indigo-400 font-semibold">{doc.rejectionNo || "-"}</span>
                    <span className="block text-xs text-slate-500 mt-0.5">{doc.exceptionHandlingNo}</span>
                  </div>
                </td>
                <td>
                  <div>
                    <span className="text-white font-medium">{doc.modelName || "-"}</span>
                    <span className="block text-xs text-slate-500 mt-0.5">{doc.batchNumber}</span>
                  </div>
                </td>
                <td>
                  <div>
                    <span className="text-slate-300">{doc.department || "-"}</span>
                    <span className="block text-xs text-slate-500 mt-0.5">{doc.rejectionType}</span>
                  </div>
                </td>
                <td>
                  <StatusBadge status={doc.status} />
                </td>
                <td className="text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 text-sm font-semibold">
                    {doc.totalItems || 0}
                  </span>
                </td>
                <td className="text-center">
                  <span className="text-amber-400 font-semibold">{doc.totalRejectedQty || 0}</span>
                </td>
                <td className="text-center">
                  <span className="text-emerald-400 font-semibold">{doc.claimableCount || 0}</span>
                </td>
                <td>
                  <span className="text-slate-300 text-sm">{doc.currentApprover || "-"}</span>
                </td>
                <td>
                  {doc.claimNo ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                      {doc.claimNo}
                    </span>
                  ) : (
                    <span className="text-slate-600">-</span>
                  )}
                </td>
                <td>
                  <span className="text-slate-400 text-sm">{doc.createdBy || "-"}</span>
                </td>
                <td>
                  <span className="text-slate-400 text-sm">{formatDateTime(doc.createdOn)}</span>
                </td>
                <td>
                  <span className="text-slate-400 text-sm max-w-[200px] truncate block">
                    {doc.headerRemarks || "-"}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
