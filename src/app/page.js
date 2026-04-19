"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  Plus, Pencil, Eye, Copy, Trash2, Send, RefreshCw,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import StatsCards from "@/components/StatsCards";
import FilterBar from "@/components/FilterBar";
import RejectionTable from "@/components/RejectionTable";
import RejectionDialog from "@/components/RejectionDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "@/components/Toast";
import PageLoader from "@/components/PageLoader";
import { CURRENT_USER } from "@/lib/constants";
import { validateDocument } from "@/lib/validation";
import {
  mapSapHeader, generateNextRejectionNo,
  buildHeaderPayload, buildItemPayload,
} from "@/lib/utils";

export default function DashboardPage() {
  // ─── State ─────────────────────────────────────────────────────────────
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [workflowLevels, setWorkflowLevels] = useState([]);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({
    search: "", rejectionNo: "", exceptionHandlingNo: "",
    modelName: "", batchNumber: "", department: "",
    rejectionType: "", status: "",
  });

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("CREATE");
  const [dialogData, setDialogData] = useState(null);

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const toastTimeout = useRef(null);

  // ─── Toast helper ──────────────────────────────────────────────────────
  const showToast = useCallback((type, message) => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast({ type, message });
    toastTimeout.current = setTimeout(() => setToast(null), 4000);
  }, []);

  // ─── Data Loading ──────────────────────────────────────────────────────
  const loadDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rejections");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const mapped = (data.results || []).map(mapSapHeader);
      setDocuments(mapped);
      return mapped;
    } catch (error) {
      console.error("Load error:", error);
      showToast("error", "Failed to load documents: " + error.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const loadWorkflow = useCallback(async () => {
    try {
      const res = await fetch("/api/workflow");
      const data = await res.json();
      setWorkflowLevels(data.results || []);
    } catch (error) {
      console.error("Workflow load error:", error);
    }
  }, []);

  useEffect(() => {
    Promise.all([loadDocuments(), loadWorkflow()]).then(() => {
      setTimeout(() => setPageLoading(false), 1500);
    });
  }, [loadDocuments, loadWorkflow]);

  // ─── Filtering ─────────────────────────────────────────────────────────
  useEffect(() => {
    let filtered = [...documents];
    const search = (filters.search || "").trim().toLowerCase();

    if (search) {
      filtered = filtered.filter((doc) =>
        [doc.rejectionNo, doc.exceptionHandlingNo, doc.modelName,
          doc.batchNumber, doc.department, doc.rejectionType,
          doc.claimNo, doc.status].join(" ").toLowerCase().includes(search)
      );
    }

    if (filters.rejectionNo) {
      filtered = filtered.filter((d) =>
        (d.rejectionNo || "").toLowerCase().includes(filters.rejectionNo.toLowerCase())
      );
    }
    if (filters.exceptionHandlingNo) {
      filtered = filtered.filter((d) =>
        (d.exceptionHandlingNo || "").toLowerCase().includes(filters.exceptionHandlingNo.toLowerCase())
      );
    }
    if (filters.modelName) {
      filtered = filtered.filter((d) => d.modelName === filters.modelName);
    }
    if (filters.batchNumber) {
      filtered = filtered.filter((d) =>
        (d.batchNumber || "").toLowerCase().includes(filters.batchNumber.toLowerCase())
      );
    }
    if (filters.department) {
      filtered = filtered.filter((d) => d.department === filters.department);
    }
    if (filters.rejectionType) {
      filtered = filtered.filter((d) => d.rejectionType === filters.rejectionType);
    }
    if (filters.status) {
      filtered = filtered.filter((d) => d.status === filters.status);
    }

    // Sort by created date descending
    filtered.sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime());

    setFilteredDocuments(filtered);
    setSelectedIndex(-1);
  }, [documents, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "", rejectionNo: "", exceptionHandlingNo: "",
      modelName: "", batchNumber: "", department: "",
      rejectionType: "", status: "",
    });
  };

  // ─── Get Selected Document ─────────────────────────────────────────────
  const getSelected = () => {
    if (selectedIndex < 0 || selectedIndex >= filteredDocuments.length) return null;
    return JSON.parse(JSON.stringify(filteredDocuments[selectedIndex]));
  };

  // ─── CRUD Actions ──────────────────────────────────────────────────────
  const handleCreate = () => {
    const rejectionNo = generateNextRejectionNo(documents);
    setDialogMode("CREATE");
    setDialogData({
      header: {
        sapUuid: "", rejectionNo, exceptionHandlingNo: "",
        modelName: "", batchNumber: "", department: "",
        subInventory: "", locator: "", rejectionType: "",
        status: "DRAFT", approvalStatus: "NOT_SUBMITTED",
        currentApprover: "", currentApproverId: "",
        headerRemarks: "", reasonSummary: "", claimNo: "",
        createdBy: CURRENT_USER, createdOn: "",
        changedBy: "", changedOn: "",
        totalItems: 0, totalRejectedQty: 0, claimableCount: 0,
      },
      items: [],
    });
    setDialogOpen(true);
  };

  const handleEdit = () => {
    const doc = getSelected();
    if (!doc) { showToast("info", "Please select a rejection document first."); return; }
    if (doc.status === "APPROVED") { showToast("error", "Approved documents are display-only."); return; }
    setDialogMode("EDIT");
    setDialogData({ header: doc, items: doc.items || [] });
    setDialogOpen(true);
  };

  const handleDisplay = () => {
    const doc = getSelected();
    if (!doc) { showToast("info", "Please select a rejection document first."); return; }
    setDialogMode("DISPLAY");
    setDialogData({ header: doc, items: doc.items || [] });
    setDialogOpen(true);
  };

  const handleCopy = () => {
    const doc = getSelected();
    if (!doc) { showToast("info", "Please select a rejection document first."); return; }
    const copy = JSON.parse(JSON.stringify(doc));
    copy.sapUuid = "";
    copy.rejectionNo = generateNextRejectionNo(documents);
    copy.status = "DRAFT";
    copy.approvalStatus = "NOT_SUBMITTED";
    copy.currentApprover = "";
    copy.currentApproverId = "";
    copy.claimNo = "";
    (copy.items || []).forEach((item) => { item.sapUuid = ""; });
    setDialogMode("COPY");
    setDialogData({ header: copy, items: copy.items || [] });
    setDialogOpen(true);
  };

  const handleDelete = () => {
    const doc = getSelected();
    if (!doc) { showToast("info", "Please select a rejection document first."); return; }
    if (["APPROVED", "PENDING_APPROVAL", "IN_APPROVAL"].includes(doc.status)) {
      showToast("error", "Cannot delete documents in approval or approved state.");
      return;
    }
    if (doc.claimNo) {
      showToast("error", "A warranty claim exists. Deletion not allowed.");
      return;
    }
    setConfirmAction(() => async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/rejections/${doc.sapUuid}`, { method: "DELETE" });
        const result = await res.json();
        if (result.error) throw new Error(result.error);
        await loadDocuments();
        showToast("success", "Rejection document deleted.");
      } catch (error) {
        showToast("error", "Delete failed: " + error.message);
      } finally {
        setLoading(false);
        setConfirmOpen(false);
      }
    });
    setConfirmOpen(true);
  };

  const handleSubmitSelected = async () => {
    const doc = getSelected();
    if (!doc) { showToast("info", "Please select a rejection document first."); return; }
    if (doc.status === "APPROVED") { showToast("info", "Already approved."); return; }
    if (["PENDING_APPROVAL", "IN_APPROVAL"].includes(doc.status)) {
      showToast("info", "Already in approval."); return;
    }
    const errors = validateDocument(doc, doc.items || [], "SUBMIT");
    if (errors.length) { showToast("error", errors[0]); return; }

    if (!workflowLevels.length) {
      showToast("error", "No active workflow levels found."); return;
    }
    const firstLevel = workflowLevels.find((l) => l.levelNo === 1) || workflowLevels[0];
    const workflowInfo = {
      totalLevel: workflowLevels.length,
      currentLevel: firstLevel.levelNo || 1,
      currentApproverId: firstLevel.effectiveApproverId || "",
      currentApproverName: firstLevel.effectiveApproverName || "",
    };

    try {
      setLoading(true);
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uuid: doc.sapUuid,
          workflowInfo,
          currentUser: CURRENT_USER,
        }),
      });
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      await loadDocuments();
      showToast("success", "Rejection submitted for approval.");
    } catch (error) {
      showToast("error", "Submit failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadDocuments();
    showToast("success", "Data refreshed.");
  };

  // ─── Dialog Save/Submit ────────────────────────────────────────────────
  const handleDialogSave = async ({ header, items }) => {
    const errors = validateDocument(header, items, "SAVE");
    if (errors.length) { showToast("error", errors.join("\n")); return; }

    setSaving(true);
    try {
      const totalItems = items.length;
      const totalRejectedQty = items.reduce((sum, it) => sum + (parseInt(it.rejectedQty) || 0), 0);
      const claimableCount = items.filter((it) => it.claimable).length;

      const payload = buildHeaderPayload(header, {
        status: header.sapUuid ? (header.status || "DRAFT") : "DRAFT",
        approvalStatus: header.sapUuid ? (header.approvalStatus || "NOT_SUBMITTED") : "NOT_SUBMITTED",
        totalItems, totalRejectedQty, claimableCount,
        lastAction: "SAVED",
        lastActionBy: CURRENT_USER,
        lastActionRemarks: "Saved as draft.",
      });

      let savedUuid = header.sapUuid;

      if (header.sapUuid) {
        await fetch(`/api/rejections/${header.sapUuid}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        const res = await fetch("/api/rejections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await res.json();
        savedUuid = result?.d?.SAP_UUID || header.sapUuid;
      }

      // Save items
      if (savedUuid && items.length) {
        const itemPayloads = items.map((item) =>
          buildItemPayload(savedUuid, header.rejectionNo, item, "Draft")
        );
        await fetch("/api/rejection-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ parentUuid: savedUuid, items: itemPayloads }),
        });
      }

      await loadDocuments();
      setDialogOpen(false);
      showToast("success", "Rejection saved successfully.");
    } catch (error) {
      showToast("error", "Save failed: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDialogSubmit = async ({ header, items }) => {
    const errors = validateDocument(header, items, "SUBMIT");
    if (errors.length) { showToast("error", errors.join("\n")); return; }

    if (!workflowLevels.length) {
      showToast("error", "No active workflow levels found."); return;
    }

    setSaving(true);
    try {
      const totalItems = items.length;
      const totalRejectedQty = items.reduce((sum, it) => sum + (parseInt(it.rejectedQty) || 0), 0);
      const claimableCount = items.filter((it) => it.claimable).length;

      // First save as draft
      const savePayload = buildHeaderPayload(header, {
        status: "DRAFT", approvalStatus: "NOT_SUBMITTED",
        totalItems, totalRejectedQty, claimableCount,
        lastAction: "SAVED", lastActionBy: CURRENT_USER,
        lastActionRemarks: "Saved before submission.",
      });

      let savedUuid = header.sapUuid;

      if (header.sapUuid) {
        await fetch(`/api/rejections/${header.sapUuid}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(savePayload),
        });
      } else {
        const res = await fetch("/api/rejections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(savePayload),
        });
        const result = await res.json();
        savedUuid = result?.d?.SAP_UUID || header.sapUuid;
      }

      // Save items
      if (savedUuid && items.length) {
        const itemPayloads = items.map((item) =>
          buildItemPayload(savedUuid, header.rejectionNo, item, "Pending Approval")
        );
        await fetch("/api/rejection-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ parentUuid: savedUuid, items: itemPayloads }),
        });
      }

      // Then submit for approval
      if (savedUuid) {
        const firstLevel = workflowLevels.find((l) => l.levelNo === 1) || workflowLevels[0];
        await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uuid: savedUuid,
            workflowInfo: {
              totalLevel: workflowLevels.length,
              currentLevel: firstLevel.levelNo || 1,
              currentApproverId: firstLevel.effectiveApproverId || "",
              currentApproverName: firstLevel.effectiveApproverName || "",
            },
            currentUser: CURRENT_USER,
          }),
        });
      }

      await loadDocuments();
      setDialogOpen(false);
      showToast("success", "Rejection submitted for approval.");
    } catch (error) {
      showToast("error", "Submit failed: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <>
      <PageLoader loading={pageLoading} />
      <Navbar />

      <main className="max-w-[1920px] mx-auto px-6 py-6 space-y-6">
        {/* Page Title + Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">
              Rejection <span className="gradient-text">Documents</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage quality rejection documents with workflow approval
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button onClick={handleCreate} className="btn btn-primary">
              <Plus size={16} /> Create
            </button>
            <button onClick={handleEdit} className="btn btn-ghost">
              <Pencil size={16} /> Edit
            </button>
            <button onClick={handleDisplay} className="btn btn-ghost">
              <Eye size={16} /> Display
            </button>
            <button onClick={handleCopy} className="btn btn-ghost">
              <Copy size={16} /> Copy
            </button>
            <button onClick={handleDelete} className="btn btn-danger">
              <Trash2 size={16} /> Delete
            </button>
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            <button onClick={handleSubmitSelected} className="btn btn-success">
              <Send size={16} /> Submit
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="btn btn-ghost"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <StatsCards documents={documents} />

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={() => {}}
          onClear={handleClearFilters}
          totalCount={filteredDocuments.length}
        />

        {/* Table */}
        <RejectionTable
          documents={filteredDocuments}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          loading={loading && !documents.length}
        />
      </main>

      {/* Dialog */}
      <RejectionDialog
        open={dialogOpen}
        mode={dialogMode}
        data={dialogData}
        onClose={() => setDialogOpen(false)}
        onSave={handleDialogSave}
        onSubmit={handleDialogSubmit}
        saving={saving}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Rejection Document"
        message={`Are you sure you want to delete rejection ${getSelected()?.rejectionNo || ""}? This action cannot be undone.`}
        onConfirm={() => confirmAction && confirmAction()}
        onCancel={() => setConfirmOpen(false)}
        confirmLabel="Delete"
        type="danger"
      />

      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
