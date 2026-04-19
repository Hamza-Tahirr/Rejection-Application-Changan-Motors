import { NextResponse } from "next/server";
import { sapGet, sapPost, sapDelete, guidPath, REJECTION_SERVICE } from "@/lib/sap-client";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rejectionId = searchParams.get("rejectionId");

    const params = {};
    if (rejectionId) {
      params.$filter = `REJECTION_ID eq '${rejectionId}'`;
    }

    const data = await sapGet(REJECTION_SERVICE, "/YY1_YY1_REJ_ITM_REJECTION_DOC", params);
    const results = data?.d?.results || [];
    return NextResponse.json({ results });
  } catch (error) {
    console.error("GET /api/rejection-items error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { parentUuid, items } = await request.json();

    // First delete existing items
    const existingData = await sapGet(REJECTION_SERVICE, "/YY1_YY1_REJ_ITM_REJECTION_DOC", {
      $filter: `SAP_PARENT_UUID eq guid'${parentUuid}'`,
    });

    const existingItems = existingData?.d?.results || [];
    for (const item of existingItems) {
      const path = guidPath("YY1_YY1_REJ_ITM_REJECTION_DOC", item.SAP_UUID);
      await sapDelete(REJECTION_SERVICE, path);
    }

    // Create new items via navigation property
    const navPath = `${guidPath("YY1_REJECTION_DOC", parentUuid)}/to_YY1_REJ_ITM`;
    const createdItems = [];
    for (const item of items) {
      const result = await sapPost(REJECTION_SERVICE, navPath, item);
      createdItems.push(result);
    }

    return NextResponse.json({ success: true, items: createdItems });
  } catch (error) {
    console.error("POST /api/rejection-items error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
