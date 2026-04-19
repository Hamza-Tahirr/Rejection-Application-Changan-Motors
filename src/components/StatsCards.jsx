"use client";

import { motion } from "framer-motion";
import { FileText, Clock, CheckCircle, XCircle, AlertTriangle, Package } from "lucide-react";
import { useEffect, useState } from "react";

function AnimatedCounter({ value, duration = 1.5 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (value === 0) { setCount(0); return; }
    let start = 0;
    const increment = value / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
}

const CARD_CONFIG = [
  {
    key: "total",
    label: "Total Documents",
    icon: FileText,
    gradient: "from-indigo-500 to-violet-500",
    shadowColor: "rgba(99,102,241,0.3)",
    iconBg: "bg-indigo-500/20",
    getValue: (docs) => docs.length,
  },
  {
    key: "draft",
    label: "Drafts",
    icon: Package,
    gradient: "from-sky-500 to-cyan-500",
    shadowColor: "rgba(14,165,233,0.3)",
    iconBg: "bg-sky-500/20",
    getValue: (docs) => docs.filter((d) => d.status === "DRAFT").length,
  },
  {
    key: "pending",
    label: "Pending Approval",
    icon: Clock,
    gradient: "from-amber-500 to-orange-500",
    shadowColor: "rgba(245,158,11,0.3)",
    iconBg: "bg-amber-500/20",
    getValue: (docs) => docs.filter((d) => d.status === "PENDING_APPROVAL" || d.status === "IN_APPROVAL").length,
  },
  {
    key: "approved",
    label: "Approved",
    icon: CheckCircle,
    gradient: "from-emerald-500 to-green-500",
    shadowColor: "rgba(16,185,129,0.3)",
    iconBg: "bg-emerald-500/20",
    getValue: (docs) => docs.filter((d) => d.status === "APPROVED").length,
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: XCircle,
    gradient: "from-rose-500 to-pink-500",
    shadowColor: "rgba(239,68,68,0.3)",
    iconBg: "bg-rose-500/20",
    getValue: (docs) => docs.filter((d) => d.status === "REJECTED").length,
  },
  {
    key: "totalQty",
    label: "Total Rejected Qty",
    icon: AlertTriangle,
    gradient: "from-fuchsia-500 to-purple-500",
    shadowColor: "rgba(192,132,252,0.3)",
    iconBg: "bg-fuchsia-500/20",
    getValue: (docs) => docs.reduce((sum, d) => sum + (d.totalRejectedQty || 0), 0),
  },
];

export default function StatsCards({ documents }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {CARD_CONFIG.map((card, index) => {
        const Icon = card.icon;
        const value = card.getValue(documents);
        return (
          <motion.div
            key={card.key}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="glass-card p-4 cursor-default group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <Icon size={18} className={`bg-gradient-to-r ${card.gradient} bg-clip-text`} style={{ color: "inherit" }} />
                <Icon size={18} className="absolute text-white/80" />
              </div>
              <motion.div
                className={`w-2 h-2 rounded-full bg-gradient-to-r ${card.gradient}`}
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              <AnimatedCounter value={value} />
            </div>
            <p className="text-xs text-slate-400 font-medium">{card.label}</p>
            {/* Gradient bar at bottom */}
            <div className="mt-3 h-1 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((value / Math.max(documents.length, 1)) * 100, 100)}%` }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full bg-gradient-to-r ${card.gradient}`}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
