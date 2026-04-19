import { NextResponse } from "next/server";
import { sapGet, WORKFLOW_SERVICE } from "@/lib/sap-client";

export async function GET() {
  try {
    const data = await sapGet(WORKFLOW_SERVICE, "/YY1_ZPXP_WF_CONFIG", {
      $filter: "DocType eq '02'",
    });
    const results = (data?.d?.results || [])
      .filter((row) => row.IsActive === true || row.IsActive === "true" || row.IsActive === "X")
      .map((row) => ({
        levelNo: Number(row.LevelNo || 0),
        levelDesc: row.LevelDesc || `Level ${row.LevelNo}`,
        approverId: row.ApproverID || "",
        approverName: row.ApproverName || "",
        substituteId: row.SubstituteID || "",
        substituteName: row.SubstituteName || "",
        effectiveApproverId: row.ApproverID || row.SubstituteID || "",
        effectiveApproverName: row.ApproverName || row.SubstituteName || "",
      }))
      .sort((a, b) => a.levelNo - b.levelNo);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("GET /api/workflow error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
