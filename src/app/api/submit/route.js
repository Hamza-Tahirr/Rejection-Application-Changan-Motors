import { NextResponse } from "next/server";
import { sapPatch, guidPath, REJECTION_SERVICE } from "@/lib/sap-client";

export async function POST(request) {
  try {
    const { uuid, workflowInfo, currentUser } = await request.json();
    const path = guidPath("YY1_REJECTION_DOC", uuid);
    const now = new Date().toISOString();

    await sapPatch(REJECTION_SERVICE, path, {
      DOC_STATUS: "PENDING_APPROVAL",
      APPROVAL_STATUS: "LEVEL_1_PENDING",
      CURRENT_LEVEL: String(workflowInfo.currentLevel),
      TOTAL_LEVEL: String(workflowInfo.totalLevel),
      CURRENT_APPROVER_ID: workflowInfo.currentApproverId,
      CURRENT_APPROVER_NAME: workflowInfo.currentApproverName,
      LAST_ACTION: "SUBMITTED",
      LAST_ACTION_BY: currentUser,
      LAST_ACTION_NAME: currentUser,
      LAST_ACTION_DATE: now,
      LAST_ACTION_TIME: now,
      LAST_ACTION_REMARKS: "Submitted for approval.",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/submit error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
