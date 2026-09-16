import { prisma } from "./prisma";
import { parseJsonArray, pickLang, type Lang } from "./utils";

export async function getMachineByToken(token: string) {
  return prisma.machine.findUnique({
    where: { token },
    include: { gym: true },
  });
}

export async function getMachineBySlug(gymSlug: string, machineSlug: string) {
  const gym = await prisma.gym.findUnique({ where: { slug: gymSlug } });
  if (!gym) return null;
  return prisma.machine.findFirst({
    where: { gymId: gym.id, slug: machineSlug, active: true },
    include: { gym: true },
  });
}

export async function incrementViews(id: string) {
  await prisma.machine.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });
}

export function localizeMachine(
  m: {
    nameEn: string;
    nameFr: string;
    descriptionEn: string | null;
    descriptionFr: string | null;
    stepsEn: string;
    stepsFr: string;
    tipsEn: string | null;
    tipsFr: string | null;
    warningsEn: string | null;
    warningsFr: string | null;
    category: string;
    muscleGroups: string | null;
    slug: string;
    token: string;
    viewCount: number;
    id: string;
  },
  lang: Lang
) {
  return {
    id: m.id,
    slug: m.slug,
    token: m.token,
    category: m.category,
    muscleGroups: m.muscleGroups,
    viewCount: m.viewCount,
    name: pickLang(m.nameEn, m.nameFr, lang),
    description: pickLang(m.descriptionEn, m.descriptionFr, lang),
    steps: parseJsonArray(pickLang(m.stepsEn, m.stepsFr, lang)),
    tips: parseJsonArray(pickLang(m.tipsEn, m.tipsFr, lang)),
    warnings: parseJsonArray(pickLang(m.warningsEn, m.warningsFr, lang)),
  };
}
