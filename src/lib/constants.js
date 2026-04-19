export const CURRENT_USER = "HAMZA.TAHIR";
export const REJECTION_DOC_TYPE = "02";

export const STATUS_LIST = [
  { key: "", label: "All" },
  { key: "DRAFT", label: "Draft" },
  { key: "PENDING_APPROVAL", label: "Pending Approval" },
  { key: "IN_APPROVAL", label: "In Approval" },
  { key: "APPROVED", label: "Approved" },
  { key: "REJECTED", label: "Rejected" },
];

export const DEPARTMENT_LIST = [
  { key: "ED", label: "ED" },
  { key: "NOT_IN_USE", label: "NOT IN USE" },
  { key: "BODY_SHOP", label: "BODY SHOP" },
  { key: "WAREHOUSE", label: "WAREHOUSE" },
  { key: "WH_UNBOXING", label: "WH UNBOXING" },
  { key: "ASSEMBLY", label: "ASSEMBLY" },
  { key: "PAINT", label: "PAINT" },
];

export const LOCATOR_LIST = [
  { key: "CH01-RM01-A01", label: "CH01-RM01-A01", description: "Plant CH01 / Storage RM01" },
  { key: "CH01-RM01-B02", label: "CH01-RM01-B02", description: "Plant CH01 / Storage RM01" },
  { key: "CH01-UNBX-C03", label: "CH01-UNBX-C03", description: "Plant CH01 / Storage UNBX" },
  { key: "CH01-BODY-D01", label: "CH01-BODY-D01", description: "Plant CH01 / Storage BODY" },
  { key: "CH01-PAINT-E01", label: "CH01-PAINT-E01", description: "Plant CH01 / Storage PNT1" },
];

export const REJECTION_TYPE_LIST = [
  { key: "SUPPLY_SIDE", label: "Supply Side" },
  { key: "LINE_SIDE", label: "Line Side" },
  { key: "WRONG_SUPP_WH", label: "Wrong -SUPP (WH)" },
  { key: "DAMAGE_SUPP_WH", label: "Damage -SUPP (WH)" },
  { key: "DEFECTIVE_SUPP_WH", label: "Defective -SUPP (WH)" },
  { key: "RUSTED_SUPP_WH", label: "Rusted -SUPP (WH)" },
];

export const CATEGORY_LIST = [
  { key: "QUALITY", label: "QUALITY" },
  { key: "DAMAGE", label: "DAMAGE" },
  { key: "SHORT", label: "SHORT" },
  { key: "RUSTED", label: "RUSTED" },
  { key: "WRONG", label: "WRONG" },
  { key: "WARRANTY", label: "WARRANTY" },
  { key: "LINE_SIDE", label: "LINE SIDE" },
  { key: "SUPPLY_SIDE", label: "SUPPLY SIDE" },
  { key: "OTHER", label: "OTHER" },
  { key: "REPAIR_ACTION", label: "REPAIR ACTION" },
];

export const REASON_LIST = [
  { code: "901", text: "Curvature problem", categoryKey: "QUALITY" },
  { code: "902", text: "Crack", categoryKey: "DAMAGE" },
  { code: "903", text: "Defective Material", categoryKey: "QUALITY" },
  { code: "904", text: "Defective In Assembling", categoryKey: "LINE_SIDE" },
  { code: "905", text: "Defective In Adhesive", categoryKey: "QUALITY" },
  { code: "906", text: "Deforming", categoryKey: "DAMAGE" },
  { code: "907", text: "Discoloration", categoryKey: "QUALITY" },
  { code: "908", text: "Dent", categoryKey: "DAMAGE" },
  { code: "909", text: "Flange Problem", categoryKey: "QUALITY" },
  { code: "910", text: "Hemming Problem", categoryKey: "QUALITY" },
  { code: "911", text: "Hole Missing", categoryKey: "QUALITY" },
  { code: "912", text: "Leaking (Water, Gas, Oil)", categoryKey: "QUALITY" },
  { code: "913", text: "Malfunction", categoryKey: "QUALITY" },
  { code: "914", text: "Noise", categoryKey: "QUALITY" },
  { code: "915", text: "Paint Missing", categoryKey: "DAMAGE" },
  { code: "916", text: "Paint Problem", categoryKey: "DAMAGE" },
  { code: "917", text: "Part Missing", categoryKey: "SHORT" },
  { code: "918", text: "Rust", categoryKey: "RUSTED" },
  { code: "919", text: "Welding Problem", categoryKey: "QUALITY" },
  { code: "920", text: "Wrong Dimension", categoryKey: "WRONG" },
  { code: "921", text: "Scratch", categoryKey: "DAMAGE" },
  { code: "922", text: "Shortage (By Changan)", categoryKey: "SHORT" },
  { code: "923", text: "Adhesive Adding", categoryKey: "REPAIR_ACTION" },
  { code: "924", text: "Cleaning", categoryKey: "REPAIR_ACTION" },
  { code: "925", text: "Cutting", categoryKey: "REPAIR_ACTION" },
  { code: "926", text: "Grinding", categoryKey: "REPAIR_ACTION" },
  { code: "927", text: "Hammering", categoryKey: "REPAIR_ACTION" },
  { code: "928", text: "Hole Piercing", categoryKey: "REPAIR_ACTION" },
  { code: "929", text: "Lubricating", categoryKey: "REPAIR_ACTION" },
  { code: "930", text: "Part Adding", categoryKey: "REPAIR_ACTION" },
  { code: "931", text: "Part Replacement", categoryKey: "REPAIR_ACTION" },
  { code: "932", text: "Painting", categoryKey: "REPAIR_ACTION" },
  { code: "933", text: "Reassembling", categoryKey: "REPAIR_ACTION" },
  { code: "934", text: "Reforming", categoryKey: "REPAIR_ACTION" },
  { code: "935", text: "Retorque", categoryKey: "REPAIR_ACTION" },
  { code: "936", text: "Rust Removal", categoryKey: "REPAIR_ACTION" },
  { code: "937", text: "Welding", categoryKey: "REPAIR_ACTION" },
  { code: "938", text: "Supply Side", categoryKey: "SUPPLY_SIDE" },
  { code: "939", text: "Line Side", categoryKey: "LINE_SIDE" },
  { code: "940", text: "Wrong -SUPP (WH)", categoryKey: "WRONG" },
  { code: "941", text: "Damage -SUPP (WH)", categoryKey: "DAMAGE" },
  { code: "942", text: "Defective -SUPP (WH)", categoryKey: "QUALITY" },
  { code: "943", text: "Rusted -SUPP (WH)", categoryKey: "RUSTED" },
  { code: "944", text: "DAMAGE", categoryKey: "DAMAGE" },
  { code: "945", text: "DEFFECTIVE", categoryKey: "QUALITY" },
  { code: "946", text: "DENTED", categoryKey: "DAMAGE" },
  { code: "947", text: "ORDERING", categoryKey: "OTHER" },
  { code: "948", text: "OTHER", categoryKey: "OTHER" },
  { code: "949", text: "QUALITY", categoryKey: "QUALITY" },
  { code: "950", text: "RUSTED", categoryKey: "RUSTED" },
  { code: "951", text: "SALES", categoryKey: "OTHER" },
  { code: "952", text: "SHORT", categoryKey: "SHORT" },
  { code: "953", text: "WARRANTY", categoryKey: "WARRANTY" },
  { code: "954", text: "WET", categoryKey: "OTHER" },
  { code: "955", text: "WRONG", categoryKey: "WRONG" },
  { code: "956", text: "RE-PDI VEHICLE", categoryKey: "OTHER" },
  { code: "957", text: "CURVATURE PROBLEM", categoryKey: "QUALITY" },
  { code: "958", text: "CRACK", categoryKey: "DAMAGE" },
  { code: "959", text: "DEFECTIVE MATERIAL", categoryKey: "QUALITY" },
  { code: "960", text: "DEFECTIVE IN ASSEMBLING", categoryKey: "LINE_SIDE" },
  { code: "961", text: "DEFECTIVE IN ADHESIVE", categoryKey: "QUALITY" },
  { code: "962", text: "DEFORMING", categoryKey: "DAMAGE" },
  { code: "963", text: "DISCOLORATION", categoryKey: "QUALITY" },
  { code: "964", text: "DENT", categoryKey: "DAMAGE" },
  { code: "965", text: "FLANGE PROBLEM", categoryKey: "QUALITY" },
  { code: "966", text: "HEMMING PROBLEM", categoryKey: "QUALITY" },
  { code: "967", text: "HOLE MISSING", categoryKey: "QUALITY" },
  { code: "968", text: "LEAKING (WATER, GAS, OIL)", categoryKey: "QUALITY" },
  { code: "969", text: "MALFUNCTION", categoryKey: "QUALITY" },
  { code: "970", text: "NOISE", categoryKey: "QUALITY" },
  { code: "971", text: "PAINT MISSING", categoryKey: "DAMAGE" },
  { code: "972", text: "PAINT PROBLEM", categoryKey: "DAMAGE" },
  { code: "973", text: "PART MISSING", categoryKey: "SHORT" },
  { code: "974", text: "WELDING PROBLEM", categoryKey: "QUALITY" },
  { code: "975", text: "WRONG DIMENSION", categoryKey: "WRONG" },
  { code: "976", text: "SCRATCH", categoryKey: "DAMAGE" },
  { code: "977", text: "SHORTAGE (BY CHANGAN)", categoryKey: "SHORT" },
  { code: "978", text: "DEFECTIVE", categoryKey: "QUALITY" },
  { code: "979", text: "EXPIRED", categoryKey: "OTHER" },
  { code: "980", text: "RUST", categoryKey: "RUSTED" },
  { code: "981", text: "PAINT NG", categoryKey: "DAMAGE" },
  { code: "982", text: "WASHER MISS", categoryKey: "SHORT" },
  { code: "983", text: "SCRATCH FOUND", categoryKey: "DAMAGE" },
  { code: "984", text: "PEDAL RUBBER DAMAGE", categoryKey: "WARRANTY" },
  { code: "985", text: "BRAKE PEDAL FOUND TILT", categoryKey: "WARRANTY" },
  { code: "986", text: "PAPER STUCK", categoryKey: "OTHER" },
  { code: "987", text: "EXCESS POWDER CODING", categoryKey: "QUALITY" },
  { code: "988", text: "HOLE OFFSET", categoryKey: "QUALITY" },
  { code: "989", text: "DIMENSION NOT AS PER STANDARD", categoryKey: "WRONG" },
  { code: "990", text: "WRONG INFORMATION EMBOSSED", categoryKey: "WRONG" },
  { code: "991", text: "LEVER MECHANISM JAM", categoryKey: "QUALITY" },
  { code: "992", text: "SWITCH DAMAGE", categoryKey: "WARRANTY" },
  { code: "993", text: "FOUND EXCESS KNOB LENGTH", categoryKey: "QUALITY" },
  { code: "994", text: "KNOB STUCK", categoryKey: "QUALITY" },
];

export const DPL_BATCHES = [
  {
    exceptionHandlingNo: "EH-2026-00021",
    modelName: "OUSHAN X7",
    batchNumber: "BATCH-X7-001",
    defaultLocator: "CH01-RM01-A01",
    parts: [
      { partNo: "X7-ENG-001", materialCode: "100000001", description: "Engine Mount Front", uom: "EA", availableQty: 12, defaultCategory: "QUALITY" },
      { partNo: "X7-BDY-014", materialCode: "100000014", description: "Rear Door Inner Panel", uom: "EA", availableQty: 6, defaultCategory: "DAMAGE" },
      { partNo: "X7-PAI-021", materialCode: "100000021", description: "Front Fender Painted RH", uom: "EA", availableQty: 8, defaultCategory: "DAMAGE" },
      { partNo: "X7-ELC-031", materialCode: "100000031", description: "Power Window Switch", uom: "EA", availableQty: 20, defaultCategory: "QUALITY" },
      { partNo: "X7-ASM-045", materialCode: "100000045", description: "Dashboard Main Assembly", uom: "EA", availableQty: 5, defaultCategory: "LINE_SIDE" },
    ],
  },
  {
    exceptionHandlingNo: "EH-2026-00034",
    modelName: "ALSVIN",
    batchNumber: "BATCH-ALS-003",
    defaultLocator: "CH01-BODY-D01",
    parts: [
      { partNo: "ALS-BDY-003", materialCode: "100000103", description: "Bonnet Panel", uom: "EA", availableQty: 7, defaultCategory: "DAMAGE" },
      { partNo: "ALS-ASM-011", materialCode: "100000111", description: "Instrument Cluster Frame", uom: "EA", availableQty: 15, defaultCategory: "QUALITY" },
      { partNo: "ALS-WHS-017", materialCode: "100000117", description: "Main Wiring Harness", uom: "EA", availableQty: 9, defaultCategory: "QUALITY" },
      { partNo: "ALS-PAI-022", materialCode: "100000122", description: "Door Trim Painted LH", uom: "EA", availableQty: 13, defaultCategory: "DAMAGE" },
      { partNo: "ALS-RUB-031", materialCode: "100000131", description: "Pedal Rubber Cover", uom: "EA", availableQty: 25, defaultCategory: "WARRANTY" },
    ],
  },
  {
    exceptionHandlingNo: "EH-2026-00055",
    modelName: "KARVAAN",
    batchNumber: "BATCH-KRV-007",
    defaultLocator: "CH01-UNBX-C03",
    parts: [
      { partNo: "KRV-BDY-004", materialCode: "100000204", description: "Sliding Door Shell", uom: "EA", availableQty: 4, defaultCategory: "DAMAGE" },
      { partNo: "KRV-ENG-008", materialCode: "100000208", description: "Air Filter Housing", uom: "EA", availableQty: 18, defaultCategory: "QUALITY" },
      { partNo: "KRV-WHL-016", materialCode: "100000216", description: "Wheel Arch Liner", uom: "EA", availableQty: 16, defaultCategory: "SUPPLY_SIDE" },
      { partNo: "KRV-PAI-026", materialCode: "100000226", description: "Front Bumper Painted", uom: "EA", availableQty: 10, defaultCategory: "DAMAGE" },
      { partNo: "KRV-GLS-034", materialCode: "100000234", description: "Quarter Glass", uom: "EA", availableQty: 11, defaultCategory: "QUALITY" },
    ],
  },
];

export function getModelList() {
  const seen = {};
  return DPL_BATCHES.filter((b) => {
    if (seen[b.modelName]) return false;
    seen[b.modelName] = true;
    return true;
  }).map((b) => ({ key: b.modelName, label: b.modelName }));
}

export function getBatchesForModel(modelName) {
  return DPL_BATCHES.filter((b) => !modelName || b.modelName === modelName).map((b) => ({
    modelName: b.modelName,
    batchNumber: b.batchNumber,
    exceptionHandlingNo: b.exceptionHandlingNo,
    defaultLocator: b.defaultLocator,
  }));
}

export function getPartsForBatch(modelName, batchNumber) {
  const batch = DPL_BATCHES.find((b) => b.modelName === modelName && b.batchNumber === batchNumber);
  return batch ? JSON.parse(JSON.stringify(batch.parts)) : [];
}

export function getReasonText(code) {
  const reason = REASON_LIST.find((r) => r.code === code);
  return reason ? reason.text : "";
}

export function normalizeCategory(category) {
  return category === "PAINT" ? "DAMAGE" : category || "";
}
