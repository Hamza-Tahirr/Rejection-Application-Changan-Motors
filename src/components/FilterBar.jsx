"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ChevronDown, X, RotateCcw } from "lucide-react";
import { useState } from "react";
import { STATUS_LIST, DEPARTMENT_LIST, REJECTION_TYPE_LIST } from "@/lib/constants";
import { getModelList } from "@/lib/constants";

export default function FilterBar({ filters, onFilterChange, onSearch, onClear, totalCount }) {
  const [expanded, setExpanded] = useState(false);
  const modelList = getModelList();

  const activeFilterCount = Object.values(filters).filter(
    (v) => v && v !== ""
  ).length - (filters.search ? 1 : 0);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="glass-card overflow-hidden"
    >
      {/* Top bar with search and toggle */}
      <div className="p-4 flex flex-wrap items-center gap-4">
        {/* Search field */}
        <div className="relative flex-1 min-w-[280px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={filters.search || ""}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Search rejection, batch, model, department, claim..."
            className="form-input pl-10 pr-4"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn btn-ghost text-sm"
          >
            <Filter size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            />
          </button>

          {activeFilterCount > 0 && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={onClear}
              className="btn btn-ghost text-sm text-rose-400 hover:text-rose-300"
            >
              <RotateCcw size={14} />
              Clear
            </motion.button>
          )}

          <div className="hidden sm:block w-px h-8 bg-white/10" />

          <span className="text-sm text-slate-400 hidden sm:inline">
            <span className="text-white font-semibold">{totalCount}</span> record(s)
          </span>
        </div>
      </div>

      {/* Expandable filter row */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
              <FilterField
                label="Rejection No."
                value={filters.rejectionNo}
                onChange={(v) => onFilterChange("rejectionNo", v)}
                placeholder="e.g. RJ-2026-..."
              />
              <FilterField
                label="Exception No."
                value={filters.exceptionHandlingNo}
                onChange={(v) => onFilterChange("exceptionHandlingNo", v)}
                placeholder="e.g. EH-..."
              />
              <FilterSelect
                label="Model Name"
                value={filters.modelName}
                onChange={(v) => onFilterChange("modelName", v)}
                options={modelList}
              />
              <FilterField
                label="Batch Number"
                value={filters.batchNumber}
                onChange={(v) => onFilterChange("batchNumber", v)}
                placeholder="e.g. BATCH-..."
              />
              <FilterSelect
                label="Department"
                value={filters.department}
                onChange={(v) => onFilterChange("department", v)}
                options={DEPARTMENT_LIST}
              />
              <FilterSelect
                label="Rejection Type"
                value={filters.rejectionType}
                onChange={(v) => onFilterChange("rejectionType", v)}
                options={REJECTION_TYPE_LIST}
              />
              <FilterSelect
                label="Status"
                value={filters.status}
                onChange={(v) => onFilterChange("status", v)}
                options={STATUS_LIST.filter((s) => s.key !== "")}
              />
            </div>
            <div className="px-4 pb-4 flex justify-end">
              <button onClick={onSearch} className="btn btn-primary text-sm">
                <Search size={14} /> Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FilterField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-[11px] text-slate-500 font-medium mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-input text-sm"
      />
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-[11px] text-slate-500 font-medium mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="form-input form-select text-sm"
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt.key} value={opt.key}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
