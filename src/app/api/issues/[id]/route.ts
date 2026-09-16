import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(_req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;

  const issue = await prisma.issueReport.findFirst({
    where: { id, machine: { gymId: session.gymId } },
  });
  if (!issue) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.issueReport.update({
    where: { id },
    data: { status: "RESOLVED" },
  });
  return NextResponse.json({ ok: true });
}
