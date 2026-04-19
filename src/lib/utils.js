import { clsx } from "clsx";

export function cn(...inputs) {
  return clsx(inputs);
}

export function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export function formatStatusState(status) {
  switch (status) {
    case "APPROVED":
      return "success";
    case "PENDING_APPROVAL":
    case "IN_APPROVAL":
      return "warning";
    case "REJECTED":
      return "error";
    default:
      return "info";
  }
}

export function getStatusColor(status) {
  switch (status) {
    case "APPROVED":
      return { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", dot: "bg-emerald-400" };
    case "PENDING_APPROVAL":
      return { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30", dot: "bg-amber-400" };
    case "IN_APPROVAL":
      return { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30", dot: "bg-orange-400" };
    case "REJECTED":
      return { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30", dot: "bg-rose-400" };
    default:
      return { bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/30", dot: "bg-sky-400" };
  }
}

export function generateNextRejectionNo(headers) {
  let max = 0;
  (headers || []).forEach((item) => {
    const match = /RJ-\d{4}-(\d+)/.exec(item.rejectionNo || "");
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > max) max = num;
    }
  });
  return `RJ-${new Date().getFullYear()}-${String(max + 1).padStart(5, "0")}`;
}

export function mapSapHeader(root) {
  const items = root.to_YY1_REJ_ITM?.results
    ? root.to_YY1_REJ_ITM.results.map(mapSapItem)
    : [];
  return {
    sapUuid: root.SAP_UUID || "",
    rejectionNo: root.REJECTION_ID || "",
    exceptionHandlingNo: root.EXCEPTION_NO || "",
    modelName: root.MODEL_NAME || "",
    batchNumber: root.BATCH_NO || "",
    department: root.DEPARTMENT || "",
    subInventory: root.SUB_INVENTORY || "",
    locator: root.LOCATOR || "",
    rejectionType: root.REJECTION_TYPE || "",
    status: root.DOC_STATUS || "DRAFT",
    approvalStatus: root.APPROVAL_STATUS || "NOT_SUBMITTED",
    currentLevel: root.CURRENT_LEVEL || "",
    totalLevel: root.TOTAL_LEVEL || "",
    currentApproverId: root.CURRENT_APPROVER_ID || "",
    currentApprover: root.CURRENT_APPROVER_NAME || root.CURRENT_APPROVER_ID || "",
    headerRemarks: root.HEADER_REMARKS || "",
    reasonSummary: root.REASON_SUMMARY || "",
    claimNo: root.CLAIM_NO || "",
    createdBy: root.SAP_CreatedByUser_Text || root.SAP_CreatedByUser || "",
    createdOn: root.SAP_CreatedDateTime || "",
    changedBy: root.SAP_LastChangedByUser_Text || root.SAP_LastChangedByUser || "",
    changedOn: root.SAP_LastChangedDateTime || "",
    totalItems: Number(root.TOTAL_ITEMS || items.length || 0),
    totalRejectedQty: Number(root.TOTAL_REJECTED_QTY || 0),
    claimableCount: Number(root.CLAIMABLE_COUNT || 0),
    items,
  };
}

export function mapSapItem(item) {
  return {
    sapUuid: item.SAP_UUID || "",
    itemNo: item.ITEM_ID || "",
    partNo: item.PART_NO || "",
    materialCode: item.MATERIAL_CODE || "",
    description: item.DESCRIPTION || "",
    uom: item.UOM || "",
    availableQty: Number(item.AVAILABLE_QTY || 0),
    rejectedQty: Number(item.REJECTED_QTY || 0),
    category: item.CATEGORY || "",
    reasonCode: item.REASON_CODE || "",
    reasonText: item.REASON_TEXT || "",
    claimable: item.CLAIMABLE === "X",
    claimReferenceDoc: item.CLAIM_REF_DOC || "",
    robbingReferenceDoc: item.ROBBING_REF_DOC || "",
    itemRemarks: item.ITEM_REMARKS || "",
    lineStatus: item.LINE_STATUS || "",
  };
}

export function buildHeaderPayload(header, override = {}) {
  const data = { ...header, ...override };
  return {
    REJECTION_ID: data.rejectionNo,
    EXCEPTION_NO: data.exceptionHandlingNo,
    MODEL_NAME: data.modelName,
    BATCH_NO: data.batchNumber,
    DEPARTMENT: data.department,
    SUB_INVENTORY: data.subInventory,
    LOCATOR: data.locator,
    REJECTION_TYPE: data.rejectionType,
    DOC_STATUS: data.status,
    APPROVAL_STATUS: data.approvalStatus || "NOT_SUBMITTED",
    CURRENT_LEVEL: String(data.currentLevel || ""),
    TOTAL_LEVEL: String(data.totalLevel || ""),
    CURRENT_APPROVER_ID: data.currentApproverId || "",
    CURRENT_APPROVER_NAME: data.currentApprover || "",
    HEADER_REMARKS: data.headerRemarks || "",
    REASON_SUMMARY: data.reasonSummary || "",
    TOTAL_ITEMS: String(data.totalItems || 0),
    TOTAL_REJECTED_QTY: String(data.totalRejectedQty || 0),
    CLAIMABLE_COUNT: String(data.claimableCount || 0),
    CLAIM_CREATED: data.claimNo ? "X" : "",
    CLAIM_NO: data.claimNo || "",
    LAST_ACTION: data.lastAction || "",
    LAST_ACTION_BY: data.lastActionBy || "",
    LAST_ACTION_NAME: data.lastActionBy || "",
    LAST_ACTION_DATE: new Date().toISOString(),
    LAST_ACTION_TIME: new Date().toISOString(),
    LAST_ACTION_REMARKS: data.lastActionRemarks || "",
  };
}

export function buildItemPayload(parentUuid, rejectionId, item, lineStatus) {
  return {
    SAP_PARENT_UUID: parentUuid,
    REJECTION_ID: rejectionId,
    ITEM_ID: item.itemNo,
    PART_NO: item.partNo,
    MATERIAL_CODE: item.materialCode,
    DESCRIPTION: item.description,
    UOM: item.uom,
    AVAILABLE_QTY: String(item.availableQty || 0),
    REJECTED_QTY: String(item.rejectedQty || 0),
    CATEGORY: item.category || "",
    REASON_CODE: item.reasonCode || "",
    REASON_TEXT: item.reasonText || "",
    CLAIMABLE: item.claimable ? "X" : "",
    CLAIM_REF_DOC: item.claimReferenceDoc || "",
    ROBBING_REF_DOC: item.robbingReferenceDoc || "",
    ITEM_REMARKS: item.itemRemarks || "",
    LINE_STATUS: lineStatus || "",
  };
}
