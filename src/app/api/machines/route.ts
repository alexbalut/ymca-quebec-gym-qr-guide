import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
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

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const nameEn = String(body.nameEn || "").trim();
  const nameFr = String(body.nameFr || "").trim();
  const slug = String(body.slug || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "");
  const category = String(body.category || "General").trim();

  if (!nameEn || !nameFr || !slug) {
    return NextResponse.json({ error: "nameEn, nameFr, slug required" }, { status: 400 });
  }

  const stepsEn = arr(body.stepsEn);
  const stepsFr = arr(body.stepsFr);
  if (stepsEn.length === 0 || stepsFr.length === 0) {
    return NextResponse.json({ error: "At least one step EN and FR required" }, { status: 400 });
  }

  try {
    const machine = await prisma.machine.create({
      data: {
        gymId: session.gymId,
        nameEn,
        nameFr,
        slug,
        token: randomBytes(8).toString("hex"),
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
        active: body.active !== false,
        sortOrder: Number(body.sortOrder) || 0,
        imageUrls: (() => {
          const urls = normalizeImageUrls(body.imageUrls);
          return urls.length ? JSON.stringify(urls) : null;
        })(),
      },
    });
    return NextResponse.json({ ok: true, machine });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Create failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
