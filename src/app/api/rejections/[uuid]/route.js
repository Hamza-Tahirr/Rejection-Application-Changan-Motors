import { NextResponse } from "next/server";
import { sapPatch, sapDelete, sapGet, guidPath, REJECTION_SERVICE } from "@/lib/sap-client";

export async function PATCH(request, { params }) {
  try {
    const { uuid } = await params;
    const payload = await request.json();
    const path = guidPath("YY1_REJECTION_DOC", uuid);
    await sapPatch(REJECTION_SERVICE, path, payload);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/rejections/[uuid] error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { uuid } = await params;
    const path = guidPath("YY1_REJECTION_DOC", uuid);
    await sapDelete(REJECTION_SERVICE, path);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/rejections/[uuid] error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    const { uuid } = await params;
    const path = guidPath("YY1_REJECTION_DOC", uuid);
    const data = await sapGet(REJECTION_SERVICE, path, {
      $expand: "to_YY1_REJ_ITM",
    });
    return NextResponse.json(data?.d || {});
  } catch (error) {
    console.error("GET /api/rejections/[uuid] error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
