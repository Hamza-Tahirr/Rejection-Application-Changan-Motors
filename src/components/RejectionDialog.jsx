"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import {
  X, Save, Send, Plus, Minus, Search, FileText,
  ChevronDown, Package, MapPin, Layers, User, Calendar, MessageSquare,
} from "lucide-react";
import {
  DEPARTMENT_LIST, LOCATOR_LIST, REJECTION_TYPE_LIST, CATEGORY_LIST,
  REASON_LIST, getModelList, getBatchesForModel, getPartsForBatch,
  getReasonText, normalizeCategory,
} from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import StatusBadge from "./StatusBadge";

export default function RejectionDialog({ open, mode, data, onClose, onSave, onSubmit, saving }) {
  const [header, setHeader] = useState({});
  const [items, setItems] = useState([]);
  const [itemSearch, setItemSearch] = useState("");
  const [availableBatches, setAvailableBatches] = useState([]);
  const [availableParts, setAvailableParts] = useState([]);
  const [selectedItemIndices, setSelectedItemIndices] = useState(new Set());
  const [activeTab, setActiveTab] = useState("header");
  const [errors, setErrors] = useState([]);

  const editable = mode === "CREATE" || mode === "EDIT" || mode === "COPY";
  const modelList = getModelList();

  useEffect(() => {
    if (open && data) {
      setHeader({ ...data.header });
      setItems(data.items ? data.items.map((item) => ({ ...item })) : []);
      setItemSearch("");
      setSelectedItemIndices(new Set());
      setErrors([]);
      setActiveTab("header");
      // Refresh collections
      const batches = getBatchesForModel(data.header?.modelName || "");
      setAvailableBatches(batches);
      const parts = getPartsForBatch(data.header?.modelName || "", data.header?.batchNumber || "");
      setAvailableParts(parts);
    }
  }, [open, data]);

  const updateHeader = useCallback((field, value) => {
    setHeader((prev) => ({ ...prev, [field]: value }));
  }, []);

  const recalcSummary = useCallback((currentItems) => {
    const totalItems = currentItems.length;
    const totalRejectedQty = currentItems.reduce((sum, item) => sum + (parseInt(item.rejectedQty) || 0), 0);
    const claimableCount = currentItems.filter((item) => item.claimable).length;
    setHeader((prev) => ({ ...prev, totalItems, totalRejectedQty, claimableCount }));
  }, []);

  // Model change
  const handleModelChange = (modelName) => {
    updateHeader("modelName", modelName);
    updateHeader("batchNumber", "");
    updateHeader("exceptionHandlingNo", "");
    setItems([]);
    const batches = getBatchesForModel(modelName);
    setAvailableBatches(batches);
    setAvailableParts([]);
    recalcSummary([]);
  };

  // Batch change
  const handleBatchChange = (batchNumber) => {
    updateHeader("batchNumber", batchNumber);
    const batch = availableBatches.find((b) => b.batchNumber === batchNumber);
    if (batch) {
      updateHeader("exceptionHandlingNo", batch.exceptionHandlingNo);
      if (!header.locator) updateHeader("locator", batch.defaultLocator);
    } else {
      updateHeader("exceptionHandlingNo", "");
    }
    setItems([]);
    const parts = getPartsForBatch(header.modelName, batchNumber);
    setAvailableParts(parts);
    recalcSummary([]);
  };

  // Rejection type change
  const handleRejectionTypeChange = (rejectionType) => {
    updateHeader("rejectionType", rejectionType);
  };

  // Add item
  const handleAddItem = () => {
    if (!header.modelName || !header.batchNumber) {
      setErrors(["Please select Model Name and Batch Number before adding items."]);
      return;
    }
    if (!availableParts.length) {
      setErrors(["No parts available for the selected model/batch."]);
      return;
    }
    const newIndex = items.length + 1;
    const newItem = {
      itemNo: String(newIndex * 10).padStart(4, "0"),
      partNo: "", materialCode: "", description: "", uom: "",
      availableQty: 0, rejectedQty: 1, category: "", reasonCode: "",
      reasonText: "", claimable: false, claimReferenceDoc: "",
      robbingReferenceDoc: "", itemRemarks: "",
    };
    const updated = [...items, newItem];
    setItems(updated);
    recalcSummary(updated);
    setErrors([]);
  };

  // Remove selected items
  const handleRemoveItems = () => {
    if (selectedItemIndices.size === 0) {
      setErrors(["Please select at least one item to remove."]);
      return;
    }
    const updated = items.filter((_, i) => !selectedItemIndices.has(i));
    // Renumber
    updated.forEach((item, i) => {
      item.itemNo = String((i + 1) * 10).padStart(4, "0");
    });
    setItems(updated);
    setSelectedItemIndices(new Set());
    recalcSummary(updated);
    setErrors([]);
  };

  // Part selection change
  const handlePartChange = (itemIndex, partNo) => {
    const updated = [...items];
    const item = { ...updated[itemIndex] };

    // Check duplicate
    const isDuplicate = items.some((it, idx) => idx !== itemIndex && it.partNo === partNo);
    if (isDuplicate) {
      setErrors(["This part is already added in another item."]);
      item.partNo = ""; item.materialCode = ""; item.description = "";
      item.uom = ""; item.availableQty = 0; item.rejectedQty = 1;
      item.category = ""; item.reasonCode = "";
      updated[itemIndex] = item;
      setItems(updated);
      recalcSummary(updated);
      return;
    }

    const part = availableParts.find((p) => p.partNo === partNo);
    if (part) {
      item.partNo = part.partNo;
      item.materialCode = part.materialCode;
      item.description = part.description;
      item.uom = part.uom;
      item.availableQty = part.availableQty;
      item.rejectedQty = 1;
      item.category = normalizeCategory(part.defaultCategory);
      item.reasonCode = "";
    } else {
      item.partNo = ""; item.materialCode = ""; item.description = "";
      item.uom = ""; item.availableQty = 0; item.rejectedQty = 1;
      item.category = ""; item.reasonCode = "";
    }
    updated[itemIndex] = item;
    setItems(updated);
    recalcSummary(updated);
    setErrors([]);
  };

  // Item field change
  const handleItemFieldChange = (itemIndex, field, value) => {
    const updated = [...items];
    const item = { ...updated[itemIndex] };
    item[field] = value;

    // Category-reason sync
    if (field === "category") {
      const reason = REASON_LIST.find((r) => r.code === item.reasonCode);
      if (reason && reason.categoryKey !== value) item.reasonCode = "";
    }
    if (field === "reasonCode") {
      const reason = REASON_LIST.find((r) => r.code === value);
      if (reason) {
        item.reasonText = reason.text;
        if (!item.category) item.category = reason.categoryKey;
      }
    }
    if (field === "rejectedQty") {
      let qty = parseInt(value) || 0;
      if (qty < 1) qty = 1;
      if (item.availableQty && qty > item.availableQty) qty = item.availableQty;
      item.rejectedQty = qty;
    }

    updated[itemIndex] = item;
    setItems(updated);
    recalcSummary(updated);
  };

  // Toggle item selection
  const toggleItemSelection = (index) => {
    setSelectedItemIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    if (!itemSearch) return true;
    const search = itemSearch.toLowerCase();
    return [item.partNo, item.materialCode, item.description, item.reasonCode, item.itemNo]
      .join(" ").toLowerCase().includes(search);
  });

  const handleSave = () => {
    onSave({ header, items });
  };

  const handleSubmit = () => {
    onSubmit({ header, items });
  };

  const dialogTitle = {
    CREATE: "Create Rejection Document",
    EDIT: "Edit Rejection Document",
    DISPLAY: "View Rejection Document",
    COPY: "Copy Rejection Document",
  }[mode] || "Rejection Document";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card w-full max-w-7xl max-h-[92vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <FileText size={20} className="text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{dialogTitle}</h2>
                  {header.rejectionNo && (
                    <span className="text-xs text-slate-500">{header.rejectionNo}</span>
                  )}
                </div>
                {header.status && <StatusBadge status={header.status} />}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5">
              {["header", "items"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab ? "text-white" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {tab === "header" ? "Header Details" : `Line Items (${items.length})`}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Errors */}
            <AnimatePresence>
              {errors.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-rose-500/10 border-b border-rose-500/20 px-5 py-3 overflow-hidden"
                >
                  <div className="flex items-start gap-2">
                    <X size={16} className="text-rose-400 mt-0.5 flex-shrink-0 cursor-pointer" onClick={() => setErrors([])} />
                    <ul className="text-sm text-rose-300 space-y-1">
                      {errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {activeTab === "header" ? (
                <HeaderForm
                  header={header}
                  editable={editable}
                  modelList={modelList}
                  availableBatches={availableBatches}
                  onModelChange={handleModelChange}
                  onBatchChange={handleBatchChange}
                  onRejectionTypeChange={handleRejectionTypeChange}
                  updateHeader={updateHeader}
                />
              ) : (
                <ItemsTab
                  items={filteredItems}
                  allItems={items}
                  editable={editable}
                  itemSearch={itemSearch}
                  availableParts={availableParts}
                  selectedItemIndices={selectedItemIndices}
                  onItemSearchChange={setItemSearch}
                  onAddItem={handleAddItem}
                  onRemoveItems={handleRemoveItems}
                  onPartChange={handlePartChange}
                  onItemFieldChange={handleItemFieldChange}
                  onToggleSelection={toggleItemSelection}
                />
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-5 border-t border-white/5">
              <div className="text-sm text-slate-400">
                <span className="text-white font-semibold">{header.totalItems || 0}</span> item(s)
                <span className="mx-2 text-slate-600">|</span>
                Rejected Qty: <span className="text-amber-400 font-semibold">{header.totalRejectedQty || 0}</span>
                <span className="mx-2 text-slate-600">|</span>
                Claimable: <span className="text-emerald-400 font-semibold">{header.claimableCount || 0}</span>
              </div>
              <div className="flex items-center gap-3">
                {editable && (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="btn btn-primary"
                    >
                      {saving ? <span className="loading-spinner" /> : <Save size={16} />}
                      Save as Draft
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={saving}
                      className="btn btn-success"
                    >
                      {saving ? <span className="loading-spinner" /> : <Send size={16} />}
                      Submit for Approval
                    </button>
                  </>
                )}
                <button onClick={onClose} className="btn btn-ghost">
                  {editable ? "Cancel" : "Close"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Header Form ─────────────────────────────────────────────────────────────
function HeaderForm({
  header, editable, modelList, availableBatches,
  onModelChange, onBatchChange, onRejectionTypeChange, updateHeader,
}) {
  return (
    <div className="space-y-6">
      {/* Section: Identification */}
      <FormSection title="Identification" icon={FileText}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField label="Rejection No." required>
            <input
              type="text"
              value={header.rejectionNo || ""}
              disabled
              className="form-input"
            />
          </FormField>
          <FormField label="Status">
            <div className="flex items-center h-[42px]">
              <StatusBadge status={header.status} />
            </div>
          </FormField>
          <FormField label="Exception Handling No." required>
            <input
              type="text"
              value={header.exceptionHandlingNo || ""}
              disabled
              placeholder="Auto-filled from batch"
              className="form-input"
            />
          </FormField>
        </div>
      </FormSection>

      {/* Section: Selection */}
      <FormSection title="Selection Details" icon={Package}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField label="Model Name" required>
            <select
              value={header.modelName || ""}
              onChange={(e) => onModelChange(e.target.value)}
              disabled={!editable}
              className="form-input form-select"
            >
              <option value="">Select Model</option>
              {modelList.map((m) => (
                <option key={m.key} value={m.key}>{m.label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Batch Number" required>
            <select
              value={header.batchNumber || ""}
              onChange={(e) => onBatchChange(e.target.value)}
              disabled={!editable}
              className="form-input form-select"
            >
              <option value="">Select Batch</option>
              {availableBatches.map((b) => (
                <option key={b.batchNumber} value={b.batchNumber}>
                  {b.batchNumber} ({b.exceptionHandlingNo})
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Department" required>
            <select
              value={header.department || ""}
              onChange={(e) => updateHeader("department", e.target.value)}
              disabled={!editable}
              className="form-input form-select"
            >
              <option value="">Select Department</option>
              {DEPARTMENT_LIST.map((d) => (
                <option key={d.key} value={d.key}>{d.label}</option>
              ))}
            </select>
          </FormField>
        </div>
      </FormSection>

      {/* Section: Location */}
      <FormSection title="Location & Type" icon={MapPin}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField label="Sub Inventory" required>
            <input
              type="text"
              value={header.subInventory || ""}
              onChange={(e) => updateHeader("subInventory", e.target.value)}
              disabled={!editable}
              placeholder="Enter sub inventory"
              maxLength={20}
              className="form-input"
            />
          </FormField>
          <FormField label="Locator" required>
            <select
              value={header.locator || ""}
              onChange={(e) => updateHeader("locator", e.target.value)}
              disabled={!editable}
              className="form-input form-select"
            >
              <option value="">Select Locator</option>
              {LOCATOR_LIST.map((l) => (
                <option key={l.key} value={l.key}>
                  {l.label} - {l.description}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Rejection Type" required>
            <select
              value={header.rejectionType || ""}
              onChange={(e) => onRejectionTypeChange(e.target.value)}
              disabled={!editable}
              className="form-input form-select"
            >
              <option value="">Select Type</option>
              {REJECTION_TYPE_LIST.map((t) => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
          </FormField>
        </div>
      </FormSection>

      {/* Section: Approver */}
      <FormSection title="Approval Info" icon={User}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Current Approver">
            <input
              type="text"
              value={header.currentApprover || ""}
              disabled
              placeholder="Derived from workflow configuration"
              className="form-input"
            />
          </FormField>
          <FormField label="Remarks">
            <textarea
              value={header.headerRemarks || ""}
              onChange={(e) => updateHeader("headerRemarks", e.target.value)}
              disabled={!editable}
              rows={3}
              maxLength={255}
              placeholder="Enter remarks..."
              className="form-input resize-none"
            />
          </FormField>
        </div>
      </FormSection>

      {/* Section: Audit */}
      <FormSection title="Audit Trail" icon={Calendar}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField label="Created By">
            <input type="text" value={header.createdBy || ""} disabled className="form-input" />
          </FormField>
          <FormField label="Created On">
            <input type="text" value={formatDateTime(header.createdOn)} disabled className="form-input" />
          </FormField>
          <FormField label="Changed By">
            <input type="text" value={header.changedBy || ""} disabled className="form-input" />
          </FormField>
          <FormField label="Changed On">
            <input type="text" value={formatDateTime(header.changedOn)} disabled className="form-input" />
          </FormField>
        </div>
      </FormSection>
    </div>
  );
}

function FormSection({ title, icon: Icon, children }) {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-card-light p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center">
          <Icon size={14} className="text-indigo-400" />
        </div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label className="block text-[11px] text-slate-400 font-medium mb-1.5 uppercase tracking-wider">
        {label}
        {required && <span className="text-rose-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Items Tab ───────────────────────────────────────────────────────────────
function ItemsTab({
  items, allItems, editable, itemSearch, availableParts, selectedItemIndices,
  onItemSearchChange, onAddItem, onRemoveItems, onPartChange,
  onItemFieldChange, onToggleSelection,
}) {
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={itemSearch}
            onChange={(e) => onItemSearchChange(e.target.value)}
            placeholder="Search by Part No / Material Code"
            className="form-input pl-9 text-sm"
          />
        </div>
        {editable && (
          <>
            <button onClick={onAddItem} className="btn btn-primary text-sm">
              <Plus size={15} /> Add Item
            </button>
            <button onClick={onRemoveItems} className="btn btn-ghost text-sm">
              <Minus size={15} /> Remove Selected
            </button>
          </>
        )}
        <span className="text-xs text-slate-500 ml-auto">
          {items.length} of {allItems.length} item(s) shown
        </span>
      </div>

      {/* Items table */}
      {items.length === 0 ? (
        <div className="glass-card-light p-8 text-center">
          <Layers size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400">
            No items yet. Add parts based on selected Model and Batch.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto glass-card-light">
          <table className="data-table">
            <thead>
              <tr>
                {editable && <th className="w-10" />}
                <th>Item</th>
                <th>Part No.</th>
                <th>Material</th>
                <th>Description</th>
                <th>UoM / Avl.</th>
                <th>Rejected Qty</th>
                <th>Category</th>
                <th>Reason</th>
                <th>Claimable</th>
                <th>Claim Ref.</th>
                <th>Robbing Ref.</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const realIndex = allItems.findIndex((ai) => ai.itemNo === item.itemNo);
                return (
                  <motion.tr
                    key={item.itemNo}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={selectedItemIndices.has(realIndex) ? "selected" : ""}
                  >
                    {editable && (
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedItemIndices.has(realIndex)}
                          onChange={() => onToggleSelection(realIndex)}
                        />
                      </td>
                    )}
                    <td>
                      <span className="text-xs font-mono text-slate-500">{item.itemNo}</span>
                    </td>
                    <td>
                      {editable ? (
                        <select
                          value={item.partNo || ""}
                          onChange={(e) => onPartChange(realIndex, e.target.value)}
                          className="form-input form-select text-sm min-w-[180px]"
                        >
                          <option value="">Select Part</option>
                          {availableParts.map((p) => (
                            <option key={p.partNo} value={p.partNo}>
                              {p.partNo} - {p.description}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-indigo-400 font-medium">{item.partNo}</span>
                      )}
                    </td>
                    <td>
                      <span className="text-xs text-slate-400 font-mono">{item.materialCode}</span>
                    </td>
                    <td>
                      <span className="text-sm text-slate-300 max-w-[160px] truncate block">{item.description}</span>
                    </td>
                    <td>
                      <div className="text-center">
                        <span className="text-sm text-white font-medium">{item.uom}</span>
                        <span className="block text-xs text-slate-500">Avl: {item.availableQty}</span>
                      </div>
                    </td>
                    <td>
                      {editable ? (
                        <input
                          type="number"
                          value={item.rejectedQty || ""}
                          onChange={(e) => onItemFieldChange(realIndex, "rejectedQty", e.target.value)}
                          min={1}
                          max={item.availableQty || 999}
                          className="form-input text-sm w-20 text-center"
                        />
                      ) : (
                        <span className="text-amber-400 font-semibold text-center block">{item.rejectedQty}</span>
                      )}
                    </td>
                    <td>
                      {editable ? (
                        <select
                          value={item.category || ""}
                          onChange={(e) => onItemFieldChange(realIndex, "category", e.target.value)}
                          className="form-input form-select text-sm min-w-[130px]"
                        >
                          <option value="">Select</option>
                          {CATEGORY_LIST.map((c) => (
                            <option key={c.key} value={c.key}>{c.label}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-sm">{item.category}</span>
                      )}
                    </td>
                    <td>
                      {editable ? (
                        <select
                          value={item.reasonCode || ""}
                          onChange={(e) => onItemFieldChange(realIndex, "reasonCode", e.target.value)}
                          className="form-input form-select text-sm min-w-[200px]"
                        >
                          <option value="">Select Reason</option>
                          {REASON_LIST.map((r) => (
                            <option key={r.code} value={r.code}>
                              {r.code} - {r.text}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-sm">{item.reasonCode} - {item.reasonText || getReasonText(item.reasonCode)}</span>
                      )}
                    </td>
                    <td className="text-center">
                      {editable ? (
                        <input
                          type="checkbox"
                          checked={item.claimable || false}
                          onChange={(e) => onItemFieldChange(realIndex, "claimable", e.target.checked)}
                        />
                      ) : (
                        <span className={item.claimable ? "text-emerald-400" : "text-slate-600"}>
                          {item.claimable ? "Yes" : "No"}
                        </span>
                      )}
                    </td>
                    <td>
                      {editable ? (
                        <input
                          type="text"
                          value={item.claimReferenceDoc || ""}
                          onChange={(e) => onItemFieldChange(realIndex, "claimReferenceDoc", e.target.value)}
                          className="form-input text-sm min-w-[120px]"
                        />
                      ) : (
                        <span className="text-sm text-slate-400">{item.claimReferenceDoc || "-"}</span>
                      )}
                    </td>
                    <td>
                      {editable ? (
                        <input
                          type="text"
                          value={item.robbingReferenceDoc || ""}
                          onChange={(e) => onItemFieldChange(realIndex, "robbingReferenceDoc", e.target.value)}
                          className="form-input text-sm min-w-[120px]"
                        />
                      ) : (
                        <span className="text-sm text-slate-400">{item.robbingReferenceDoc || "-"}</span>
                      )}
                    </td>
                    <td>
                      {editable ? (
                        <input
                          type="text"
                          value={item.itemRemarks || ""}
                          onChange={(e) => onItemFieldChange(realIndex, "itemRemarks", e.target.value)}
                          className="form-input text-sm min-w-[150px]"
                        />
                      ) : (
                        <span className="text-sm text-slate-400">{item.itemRemarks || "-"}</span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
