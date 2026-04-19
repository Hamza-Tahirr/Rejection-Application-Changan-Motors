"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = "Confirm", type = "danger" }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card p-6 w-full max-w-md"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                type === "danger" ? "bg-rose-500/10" : "bg-amber-500/10"
              }`}>
                <AlertTriangle size={24} className={type === "danger" ? "text-rose-400" : "text-amber-400"} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{message}</p>
              </div>
              <button onClick={onCancel} className="text-slate-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={onCancel} className="btn btn-ghost">
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`btn ${type === "danger" ? "btn-danger" : "btn-primary"}`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
