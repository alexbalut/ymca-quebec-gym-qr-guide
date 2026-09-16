import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { machineQrUrl } from "@/lib/utils";
import QRCode from "qrcode";
import { PrintActions } from "@/components/admin/PrintActions";

export const dynamic = "force-dynamic";

export default async function PrintSheetPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const gym = await prisma.gym.findUnique({ where: { id: session.gymId } });
  const machines = await prisma.machine.findMany({
    where: { gymId: session.gymId, active: true },
    orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
  });

  const cards = await Promise.all(
    machines.map(async (m) => {
      const url = machineQrUrl(m.token);
      const dataUrl = await QRCode.toDataURL(url, { margin: 1, width: 280, errorCorrectionLevel: "M" });
      return { ...m, url, dataUrl };
    })
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="no-print flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Printable QR sheet</h1>
          <p className="text-slate-400 mt-1">
            Cut and stick on machines. Uses opaque /q/token URLs.
          </p>
        </div>
        <PrintActions />
      </div>

      <div className="mb-6 print:mb-4">
        <h2 className="text-xl font-semibold">{gym?.name}</h2>
        <p className="text-sm text-slate-400 print:text-black">
          Scan for EN/FR how-to guides · {cards.length} machines
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 print:grid-cols-3 print:gap-3">
        {cards.map((m) => (
          <div
            key={m.id}
            className="card p-4 flex flex-col items-center text-center print:break-inside-avoid print:shadow-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.dataUrl} alt={`QR ${m.nameEn}`} className="w-40 h-40 print:w-36 print:h-36" />
            <p className="mt-3 font-semibold leading-tight">{m.nameEn}</p>
            <p className="text-xs text-slate-400 print:text-slate-600">{m.nameFr}</p>
            <p className="mt-1 badge print:border-slate-300 print:text-slate-700 print:bg-slate-100">
              {m.category}
            </p>
            <p className="mt-2 text-[10px] font-mono text-slate-500 break-all print:text-slate-600">
              {m.token}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
