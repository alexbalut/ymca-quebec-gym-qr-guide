import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MachineForm } from "@/components/admin/MachineForm";
import { parseJsonArray, parseImageUrls } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export default async function EditMachinePage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  const m = await prisma.machine.findFirst({ where: { id, gymId: session.gymId } });
  if (!m) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Edit machine</h1>
      <p className="text-slate-400 mb-6">
        {m.nameEn} · token <code className="text-yellow-300">{m.token}</code>
      </p>
      <MachineForm
        machineId={m.id}
        initial={{
          nameEn: m.nameEn,
          nameFr: m.nameFr,
          slug: m.slug,
          category: m.category,
          muscleGroups: m.muscleGroups || "",
          descriptionEn: m.descriptionEn || "",
          descriptionFr: m.descriptionFr || "",
          stepsEn: parseJsonArray(m.stepsEn).join("\n"),
          stepsFr: parseJsonArray(m.stepsFr).join("\n"),
          tipsEn: parseJsonArray(m.tipsEn).join("\n"),
          tipsFr: parseJsonArray(m.tipsFr).join("\n"),
          warningsEn: parseJsonArray(m.warningsEn).join("\n"),
          warningsFr: parseJsonArray(m.warningsFr).join("\n"),
          sortOrder: m.sortOrder,
          active: m.active,
          imageUrls: parseImageUrls(m.imageUrls).join("\n"),
        }}
      />
    </main>
  );
}
