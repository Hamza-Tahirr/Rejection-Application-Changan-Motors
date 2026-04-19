import { NextResponse } from "next/server";
import { sapGet, sapPost, REJECTION_SERVICE } from "@/lib/sap-client";

export async function GET() {
  try {
    const data = await sapGet(REJECTION_SERVICE, "/YY1_REJECTION_DOC", {
      $expand: "to_YY1_REJ_ITM",
    });
    const results = data?.d?.results || [];
    return NextResponse.json({ results });
  } catch (error) {
    console.error("GET /api/rejections error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const data = await sapPost(REJECTION_SERVICE, "/YY1_REJECTION_DOC", payload);
    return NextResponse.json(data);
  } catch (error) {
    console.error("POST /api/rejections error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
