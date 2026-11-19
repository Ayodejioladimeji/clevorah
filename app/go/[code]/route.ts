import { NextResponse } from "next/server";
import { outboundUrl } from "@/lib/affiliate";
import { addClick, brandById, loadStore } from "@/lib/repository";

export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ code: string }> }) {
  const { code } = await context.params;
  const url = new URL(request.url);
  const role = url.searchParams.get("role");
  const page = url.searchParams.get("page") || "";
  if ((role !== "favorite" && role !== "alternative") || !page) {
    return new NextResponse("Not found", { status: 404 });
  }
  const store = await loadStore();
  const brand = brandById(store, decodeURIComponent(code));
  if (!brand || brand.paused || !brand.affiliateUrl) {
    return new NextResponse("Not found", { status: 404 });
  }
  let destination = "";
  try {
    destination = outboundUrl(brand, page.slice(0, 200), role);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
  const purpose = [
    request.headers.get("purpose"),
    request.headers.get("sec-purpose"),
    request.headers.get("next-router-prefetch"),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  if (!purpose.includes("prefetch")) await addClick(page.slice(0, 200), brand.id, role);
  return new NextResponse(null, {
    status: 302,
    headers: { Location: destination, "Cache-Control": "no-store" },
  });
}
