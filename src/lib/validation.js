import { REASON_LIST } from "./constants";

export function validateDocument(header, items, action) {
  const errors = [];

  if (!header.modelName) errors.push("Model Name is required.");
  if (!header.batchNumber) errors.push("Batch Number is required.");
  if (!header.exceptionHandlingNo) errors.push("Exception Handling No is required (derived from batch).");
  if (!header.department) errors.push("Department is required.");
  if (!header.subInventory) errors.push("Sub Inventory is required.");
  if (!header.locator) errors.push("Locator is required.");
  if (!header.rejectionType) errors.push("Rejection Type is required.");

  if (action !== "SAVE" && !items.length) {
    errors.push("At least one line item is required.");
  }

  const seenParts = {};
  items.forEach((item, index) => {
    const prefix = `Item ${index + 1}:`;
    if (!item.partNo) errors.push(`${prefix} Part No is required.`);
    if (!item.materialCode) errors.push(`${prefix} Material Code is required.`);
    if (!item.category) errors.push(`${prefix} Category is required.`);
    if (!item.reasonCode) errors.push(`${prefix} Rejection Reason is required.`);
    if (!item.rejectedQty || parseInt(item.rejectedQty) <= 0) {
      errors.push(`${prefix} Rejected Qty must be greater than zero.`);
    }
    if (parseInt(item.rejectedQty) > parseInt(item.availableQty)) {
      errors.push(`${prefix} Rejected Qty cannot exceed available quantity.`);
    }
    if (item.partNo) {
      if (seenParts[item.partNo]) {
        errors.push(`${prefix} Duplicate Part No is not allowed.`);
      }
      seenParts[item.partNo] = true;
    }
    const reason = REASON_LIST.find((r) => r.code === item.reasonCode);
    if (reason && item.category && reason.categoryKey !== item.category) {
      errors.push(`${prefix} Selected reason does not match the chosen category.`);
    }
  });

  return errors;
}
