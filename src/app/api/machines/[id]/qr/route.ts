import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { machineQrUrl } from "@/lib/utils";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const machine = await prisma.machine.findFirst({ where: { id, gymId: session.gymId } });
  if (!machine) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const url = new URL(req.url);
  const format = url.searchParams.get("format") || "png";
  const target = machineQrUrl(machine.token);

  if (format === "svg") {
    const svg = await QRCode.toString(target, { type: "svg", margin: 1, width: 512 });
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Content-Disposition": `attachment; filename="${machine.slug}-qr.svg"`,
      },
    });
  }

  const png = await QRCode.toBuffer(target, { type: "png", margin: 1, width: 512 });
  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="${machine.slug}-qr.png"`,
    },
  });
}
