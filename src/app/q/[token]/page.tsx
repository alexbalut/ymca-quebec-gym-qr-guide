import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { MachineGuide } from "@/components/MachineGuide";
import { getMachineByToken, incrementViews, localizeMachine } from "@/lib/machines";
import { parseImageUrls } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Props) {
  const { token } = await params;
  const m = await getMachineByToken(token);
  if (!m) return { title: "Machine not found" };
  return { title: `${m.nameEn} · ${m.gym.name}` };
}

export default async function TokenGuidePage({ params }: Props) {
  const { token } = await params;
  const m = await getMachineByToken(token);
  if (!m || !m.active) notFound();
  await incrementViews(m.id);
  const refreshed = { ...m, viewCount: m.viewCount + 1 };

  return (
    <>
      <SiteHeader compact />
      <main className="flex-1">
        <MachineGuide
          gymName={m.gym.name}
          gymColor={m.gym.primaryColor}
          gymSlug={m.gym.slug}
          token={m.token}
          machineId={m.id}
          machineSlug={m.slug}
          nameEn={m.nameEn}
          nameFr={m.nameFr}
          category={m.category}
          imageUrls={parseImageUrls(m.imageUrls)}
          en={localizeMachine(refreshed, "en")}
          fr={localizeMachine(refreshed, "fr")}
        />
      </main>
    </>
  );
}
