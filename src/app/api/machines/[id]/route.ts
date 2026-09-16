import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeImageUrls } from "@/lib/utils";

function arr(v: unknown) {
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  if (typeof v === "string")
    return v
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;

  const existing = await prisma.machine.findFirst({ where: { id, gymId: session.gymId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const nameEn = String(body.nameEn || "").trim();
  const nameFr = String(body.nameFr || "").trim();
  const slug = String(body.slug || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "");
  const category = String(body.category || "General").trim();
  const stepsEn = arr(body.stepsEn);
  const stepsFr = arr(body.stepsFr);

  if (!nameEn || !nameFr || !slug || stepsEn.length === 0 || stepsFr.length === 0) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const machine = await prisma.machine.update({
      where: { id },
      data: {
        nameEn,
        nameFr,
        slug,
        category,
        muscleGroups: body.muscleGroups ? String(body.muscleGroups) : null,
        descriptionEn: body.descriptionEn ? String(body.descriptionEn) : null,
        descriptionFr: body.descriptionFr ? String(body.descriptionFr) : null,
        stepsEn: JSON.stringify(stepsEn),
        stepsFr: JSON.stringify(stepsFr),
        tipsEn: JSON.stringify(arr(body.tipsEn)),
        tipsFr: JSON.stringify(arr(body.tipsFr)),
        warningsEn: JSON.stringify(arr(body.warningsEn)),
        warningsFr: JSON.stringify(arr(body.warningsFr)),
        active: body.active !== false && body.active !== "false",
        sortOrder: Number(body.sortOrder) || 0,
        imageUrls: (() => {
          const urls = normalizeImageUrls(body.imageUrls);
          return urls.length ? JSON.stringify(urls) : null;
        })(),
      },
    });
    return NextResponse.json({ ok: true, machine });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const existing = await prisma.machine.findFirst({ where: { id, gymId: session.gymId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.machine.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
