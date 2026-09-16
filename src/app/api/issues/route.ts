import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const token = String(body.token || "");
  const note = String(body.note || "").trim();
  if (!token || !note) {
    return NextResponse.json({ error: "token and note required" }, { status: 400 });
  }
  const machine = await prisma.machine.findUnique({ where: { token } });
  if (!machine) return NextResponse.json({ error: "Machine not found" }, { status: 404 });
  const issue = await prisma.issueReport.create({
    data: { machineId: machine.id, note: note.slice(0, 1000) },
  });
  return NextResponse.json({ ok: true, id: issue.id });
}
