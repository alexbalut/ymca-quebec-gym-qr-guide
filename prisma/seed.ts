import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

function token() {
  return randomBytes(8).toString("hex");
}

const machines = [
  {
    nameEn: "Lat Pulldown",
    nameFr: "Tirage latéral",
    slug: "lat-pulldown",
    category: "Back",
    muscleGroups: "Lats, Biceps, Rear delts",
    descriptionEn:
      "Build a wider back by pulling the bar down to your upper chest with controlled form.",
    descriptionFr:
      "Développez un dos plus large en tirant la barre vers le haut de la poitrine avec un contrôle constant.",
    stepsEn: [
      "Adjust the thigh pad so your legs are firmly locked in place.",
      "Grip the bar slightly wider than shoulder-width, palms facing forward.",
      "Sit tall with chest up and a slight lean back (about 10–15°).",
      "Pull the bar down to your upper chest by driving elbows down and back.",
      "Squeeze your lats at the bottom for 1 second.",
      "Return the bar slowly to full arm extension without letting the weight slam.",
    ],
    stepsFr: [
      "Ajustez le coussin des cuisses pour verrouiller fermement vos jambes.",
      "Saisissez la barre un peu plus large que la largeur des épaules, paumes vers l'avant.",
      "Asseyez-vous droit, poitrine sortie, avec une légère inclinaison arrière (10–15°).",
      "Tirez la barre vers le haut de la poitrine en amenant les coudes vers le bas et l'arrière.",
      "Contractez les dorsaux en bas pendant 1 seconde.",
      "Remontez la barre lentement jusqu'à l'extension complète des bras sans laisser tomber les poids.",
    ],
    tipsEn: [
      "Think 'elbows to hips' rather than pulling with your hands.",
      "A medium grip often hits the lats better than an ultra-wide grip.",
    ],
    tipsFr: [
      "Pensez « coudes vers les hanches » plutôt que de tirer avec les mains.",
      "Une prise moyenne sollicite souvent mieux les dorsaux qu'une prise très large.",
    ],
    warningsEn: [
      "Do not yank the bar behind your neck — use a front pulldown.",
      "Avoid shrugging your shoulders toward your ears.",
    ],
    warningsFr: [
      "Ne tirez pas la barre derrière la nuque — privilégiez le tirage devant.",
      "Évitez de hausser les épaules vers les oreilles.",
    ],
    sortOrder: 1,
    imageUrls: [
      "/machines/lat-pulldown-1.jpg",
      "/machines/lat-pulldown-2.jpg",
      "/machines/lat-pulldown-3.jpg",
    ],
  },
  {
    nameEn: "Seated Cable Row",
    nameFr: "Rowing assis à la poulie",
    slug: "seated-cable-row",
    category: "Back",
    muscleGroups: "Mid-back, Lats, Biceps",
    descriptionEn:
      "Strengthen the middle back and improve posture with a horizontal pulling pattern.",
    descriptionFr:
      "Renforcez le milieu du dos et améliorez la posture avec un mouvement de tirage horizontal.",
    stepsEn: [
      "Sit on the bench and place your feet on the platform with soft knees.",
      "Grab the handle and sit upright with arms extended.",
      "Pull the handle to your lower abdomen while keeping torso stable.",
      "Squeeze shoulder blades together at the end of the pull.",
      "Extend arms forward under control to the starting position.",
    ],
    stepsFr: [
      "Asseyez-vous et placez vos pieds sur la plateforme, genoux légèrement fléchis.",
      "Saisissez la poignée et redressez-vous, bras tendus.",
      "Tirez la poignée vers le bas de l'abdomen en gardant le torse stable.",
      "Serrez les omoplates à la fin du tirage.",
      "Revenez en avant sous contrôle jusqu'à la position de départ.",
    ],
    tipsEn: [
      "Keep your core braced — avoid rocking back and forth for momentum.",
      "Start each rep with shoulders packed down, not shrugged.",
    ],
    tipsFr: [
      "Gardez le tronc gainé — évitez de balancer le corps pour créer de l'élan.",
      "Commencez chaque répétition avec les épaules abaissées, pas haussées.",
    ],
    warningsEn: [
      "Do not round your lower back at full stretch.",
      "Stop if you feel sharp pain in the elbows or shoulders.",
    ],
    warningsFr: [
      "Ne rondissez pas le bas du dos en fin d'extension.",
      "Arrêtez si vous ressentez une douleur vive aux coudes ou aux épaules.",
    ],
    sortOrder: 2,
  },
  {
    nameEn: "Leg Press",
    nameFr: "Presse à cuisses",
    slug: "leg-press",
    category: "Legs",
    muscleGroups: "Quads, Glutes, Hamstrings",
    descriptionEn:
      "Heavy compound lower-body strength with back support — great for building leg mass safely.",
    descriptionFr:
      "Exercice polyarticulaire des jambes avec support du dos — idéal pour développer la masse en sécurité.",
    stepsEn: [
      "Sit fully back with lower back and head against the pad.",
      "Place feet shoulder-width on the platform, mid-foot contact.",
      "Unlock the safety handles and lower the platform by bending knees to ~90°.",
      "Press through mid-foot and heels to extend legs without locking knees hard.",
      "Control the descent on every rep — 2–3 seconds down.",
    ],
    stepsFr: [
      "Asseyez-vous complètement, bas du dos et tête contre le dossier.",
      "Placez les pieds à largeur d'épaules sur la plateforme, contact mi-pied.",
      "Déverrouillez les sécurités et descendez jusqu'à ~90° aux genoux.",
      "Poussez par le mi-pied et les talons pour étendre les jambes sans verrouiller durement les genoux.",
      "Contrôlez la descente à chaque répétition — 2–3 secondes.",
    ],
    tipsEn: [
      "Higher foot placement emphasizes glutes/hamstrings; lower emphasizes quads.",
      "Keep knees tracking over toes — don't let them cave inward.",
    ],
    tipsFr: [
      "Pieds plus hauts = fessiers/ischios; pieds plus bas = quadriceps.",
      "Gardez les genoux alignés avec les orteils — ne les laissez pas rentrer.",
    ],
    warningsEn: [
      "Never let your lower back lift off the pad at the bottom.",
      "Do not fully lock out the knees aggressively under heavy load.",
    ],
    warningsFr: [
      "Ne laissez jamais le bas du dos décoller du dossier en bas du mouvement.",
      "Ne verrouillez pas agressivement les genoux sous charge lourde.",
    ],
    sortOrder: 3,
    imageUrls: ["/machines/leg-press-1.jpg", "/machines/leg-press-2.jpg"],
  },
  {
    nameEn: "Chest Press Machine",
    nameFr: "Développé couché machine",
    slug: "chest-press",
    category: "Chest",
    muscleGroups: "Chest, Triceps, Front delts",
    descriptionEn:
      "A stable pressing pattern to build chest strength with guided path and less setup than free weights.",
    descriptionFr:
      "Mouvement de poussée stable pour développer la poitrine avec un trajet guidé, plus simple que les haltères.",
    stepsEn: [
      "Adjust the seat so handles are at mid-chest height.",
      "Sit with back flat against the pad, feet planted.",
      "Grip handles and press forward until arms are nearly extended.",
      "Pause briefly without locking elbows hard.",
      "Return slowly until you feel a mild stretch across the chest.",
    ],
    stepsFr: [
      "Ajustez le siège pour que les poignées soient à hauteur mi-poitrine.",
      "Asseyez-vous le dos plat contre le dossier, pieds au sol.",
      "Saisissez les poignées et poussez jusqu'à quasi-extension des bras.",
      "Marquez une pause sans verrouiller durement les coudes.",
      "Revenez lentement jusqu'à sentir un léger étirement de la poitrine.",
    ],
    tipsEn: [
      "Exhale on the press, inhale on the return.",
      "Keep shoulders down and back — don't shrug into the movement.",
    ],
    tipsFr: [
      "Expirez à la poussée, inspirez au retour.",
      "Gardez les épaules basses et en arrière — ne haussez pas les épaules.",
    ],
    warningsEn: [
      "Stop if you feel pinching in the front of the shoulder.",
      "Don't bounce at the bottom of the rep.",
    ],
    warningsFr: [
      "Arrêtez si vous sentez un pincement à l'avant de l'épaule.",
      "Ne rebondissez pas en bas du mouvement.",
    ],
    sortOrder: 4,
    imageUrls: ["/machines/chest-press-1.jpg", "/machines/chest-press-2.jpg"],
  },
  {
    nameEn: "Shoulder Press Machine",
    nameFr: "Développé épaules machine",
    slug: "shoulder-press",
    category: "Shoulders",
    muscleGroups: "Front & side delts, Triceps",
    descriptionEn:
      "Build stronger, more stable shoulders with a supported overhead press path.",
    descriptionFr:
      "Développez des épaules plus fortes et stables avec un développé vertical guidé.",
    stepsEn: [
      "Set the seat so handles start roughly at ear / upper-shoulder height.",
      "Keep core braced and back against the pad.",
      "Press the handles overhead until arms are almost straight.",
      "Lower under control to the starting height.",
      "Keep wrists stacked over elbows throughout.",
    ],
    stepsFr: [
      "Réglez le siège pour que les poignées démarrent à hauteur d'oreille / haut d'épaule.",
      "Gainez le tronc et gardez le dos contre le dossier.",
      "Poussez les poignées au-dessus de la tête jusqu'à quasi-extension.",
      "Descendez sous contrôle jusqu'à la hauteur de départ.",
      "Gardez les poignets alignés au-dessus des coudes.",
    ],
    tipsEn: [
      "A slight forward path of the elbows is often more shoulder-friendly.",
      "Use a full but comfortable range — don't force deep stretch if painful.",
    ],
    tipsFr: [
      "Une légère trajectoire des coudes vers l'avant est souvent plus confortable pour les épaules.",
      "Utilisez une amplitude complète mais confortable — ne forcez pas si douleur.",
    ],
    warningsEn: [
      "Avoid excessive arching of the lower back to finish the press.",
      "Do not press behind the neck.",
    ],
    warningsFr: [
      "Évitez de cambrer excessivement le bas du dos pour finir la répétition.",
      "Ne développez pas derrière la nuque.",
    ],
    sortOrder: 5,
  },
  {
    nameEn: "Cable Triceps Pushdown",
    nameFr: "Extension triceps à la poulie",
    slug: "triceps-pushdown",
    category: "Arms",
    muscleGroups: "Triceps",
    descriptionEn:
      "Isolate the triceps with a cable pushdown — excellent finisher for arm days.",
    descriptionFr:
      "Isolez les triceps avec une extension à la poulie — excellent finisher pour les bras.",
    stepsEn: [
      "Attach a straight or V-bar to the high pulley.",
      "Stand tall, elbows pinned near your sides.",
      "Push the bar down until arms are fully extended.",
      "Squeeze triceps hard at the bottom.",
      "Return slowly until forearms are just above parallel.",
    ],
    stepsFr: [
      "Fixez une barre droite ou en V à la poulie haute.",
      "Tenez-vous droit, coudes collés près du corps.",
      "Poussez la barre vers le bas jusqu'à l'extension complète.",
      "Contractez fort les triceps en bas.",
      "Remontez lentement jusqu'à ce que les avant-bras soient juste au-dessus de l'horizontale.",
    ],
    tipsEn: [
      "Keep upper arms still — only the forearms should move.",
      "A rope attachment allows a nicer peak contraction at the bottom.",
    ],
    tipsFr: [
      "Gardez les bras immobiles — seuls les avant-bras bougent.",
      "Une corde permet une meilleure contraction en bas du mouvement.",
    ],
    warningsEn: [
      "Don't lean heavily over the bar or use body English for heavy reps.",
      "Wrist pain? Switch to a rope or neutral grip.",
    ],
    warningsFr: [
      "Ne vous penchez pas lourdement sur la barre ni n'utilisez l'élan du corps.",
      "Douleur au poignet ? Passez à une corde ou prise neutre.",
    ],
    sortOrder: 6,
  },
  {
    nameEn: "Leg Curl (Seated)",
    nameFr: "Curl jambes assis",
    slug: "leg-curl",
    category: "Legs",
    muscleGroups: "Hamstrings",
    descriptionEn:
      "Isolate the hamstrings to balance quad-dominant training and support knee health.",
    descriptionFr:
      "Isolez les ischio-jambiers pour équilibrer le travail des quads et soutenir la santé des genoux.",
    stepsEn: [
      "Adjust the back pad and ankle roller so the pivot aligns with your knees.",
      "Sit upright and grip the side handles.",
      "Curl your heels down and under the seat in a smooth arc.",
      "Squeeze hamstrings at peak contraction for 1 second.",
      "Return slowly without letting the stack slam.",
    ],
    stepsFr: [
      "Ajustez le dossier et le rouleau pour aligner le pivot avec vos genoux.",
      "Asseyez-vous droit et saisissez les poignées latérales.",
      "Ramenez les talons vers le bas et sous le siège en un arc fluide.",
      "Contractez les ischio-jambiers 1 seconde en haut de la contraction.",
      "Revenez lentement sans laisser claquer la pile de poids.",
    ],
    tipsEn: [
      "Point toes slightly toward you (dorsiflex) to emphasize hamstrings.",
      "Use a controlled tempo — hamstrings respond well to slow eccentrics.",
    ],
    tipsFr: [
      "Pointez légèrement les orteils vers vous pour mieux cibler les ischios.",
      "Utilisez un tempo contrôlé — les ischios aiment les excentriques lents.",
    ],
    warningsEn: [
      "Don't hyperextend the knees at the top of the return.",
      "Reduce load if you feel sharp pain behind the knee.",
    ],
    warningsFr: [
      "Ne sur-étendez pas les genoux en haut du retour.",
      "Réduisez la charge si vous sentez une douleur vive derrière le genou.",
    ],
    sortOrder: 7,
  },
  {
    nameEn: "Cable Crossover / Fly",
    nameFr: "Écarté à la poulie",
    slug: "cable-crossover",
    category: "Chest",
    muscleGroups: "Chest (inner & outer)",
    descriptionEn:
      "Stretch and squeeze the chest through a wide arc — great for definition and mind-muscle connection.",
    descriptionFr:
      "Étirez et contractez la poitrine sur un large arc — idéal pour la définition et la connexion esprit-muscle.",
    stepsEn: [
      "Set both pulleys to roughly shoulder height (or slightly above).",
      "Grab handles and step forward into a staggered stance.",
      "With a soft elbow bend, bring hands together in front of your chest.",
      "Squeeze the chest hard at the midline.",
      "Open arms slowly back to a comfortable stretch.",
    ],
    stepsFr: [
      "Réglez les deux poulies à hauteur d'épaules (ou un peu plus haut).",
      "Saisissez les poignées et avancez en fente légère.",
      "Coudes légèrement fléchis, ramenez les mains devant la poitrine.",
      "Contractez fort la poitrine au milieu.",
      "Ouvrez les bras lentement jusqu'à un étirement confortable.",
    ],
    tipsEn: [
      "Keep the same elbow angle throughout — don't turn it into a press.",
      "Slightly lower pulley height shifts emphasis to upper chest.",
    ],
    tipsFr: [
      "Gardez le même angle de coude — n'en faites pas un développé.",
      "Des poulies un peu plus basses insistent davantage sur le haut de poitrine.",
    ],
    warningsEn: [
      "Avoid going into a painful stretch at the bottom/open position.",
      "Don't let cables yank your shoulders forward.",
    ],
    warningsFr: [
      "Évitez un étirement douloureux en position ouverte.",
      "Ne laissez pas les câbles tirer vos épaules vers l'avant.",
    ],
    sortOrder: 8,
  },
  {
    nameEn: "Smith Machine Squat",
    nameFr: "Squat à la Smith machine",
    slug: "smith-squat",
    category: "Legs",
    muscleGroups: "Quads, Glutes, Core",
    descriptionEn:
      "Guided-bar squat ideal for learning depth and loading legs when free-bar balance is a limiter.",
    descriptionFr:
      "Squat guidé idéal pour apprendre la profondeur et charger les jambes quand l'équilibre barre libre limite.",
    stepsEn: [
      "Position the bar across upper traps (not on the neck).",
      "Set feet slightly forward of the bar, shoulder-width, toes out ~15°.",
      "Unrack, brace core, and descend by pushing hips back and bending knees.",
      "Go to at least parallel if mobility allows, keeping heels down.",
      "Drive up through mid-foot and re-rack carefully.",
    ],
    stepsFr: [
      "Placez la barre sur le haut des trapèzes (pas sur la nuque).",
      "Pieds légèrement devant la barre, largeur d'épaules, orteils ~15° vers l'extérieur.",
      "Déverrouillez, gainez, descendez en poussant les hanches en arrière.",
      "Descendez au moins à parallèle si la mobilité le permet, talons au sol.",
      "Remontez en poussant par le mi-pied et re-verrouillez avec soin.",
    ],
    tipsEn: [
      "Because the bar path is fixed, foot placement is your main adjustment lever.",
      "Use the safety stops set just below your deepest comfortable squat.",
    ],
    tipsFr: [
      "Le trajet de barre étant fixe, le placement des pieds est votre principal réglage.",
      "Placez les sécurités juste sous votre squat le plus profond confortable.",
    ],
    warningsEn: [
      "Do not bounce out of the hole.",
      "Keep knees tracking over toes — avoid collapsing inward.",
    ],
    warningsFr: [
      "Ne rebondissez pas en bas du squat.",
      "Gardez les genoux alignés — évitez qu'ils rentrent vers l'intérieur.",
    ],
    sortOrder: 9,
  },
  {
    nameEn: "Treadmill",
    nameFr: "Tapis de course",
    slug: "treadmill",
    category: "Cardio",
    muscleGroups: "Full body cardio",
    descriptionEn:
      "Cardio staple for warm-ups, steady-state, or intervals. Start easy and progress gradually.",
    descriptionFr:
      "Base cardio pour échauffements, endurance ou intervalles. Commencez doucement et progressez.",
    stepsEn: [
      "Step onto the side rails first, then start the belt at a slow walk (3–4 km/h).",
      "Hold the rails briefly if needed, then walk naturally with upright posture.",
      "Increase speed or incline gradually once comfortable.",
      "For intervals: alternate 1 min faster / 1–2 min easy recovery.",
      "Slow to a walk before stopping, then step off onto the side rails.",
    ],
    stepsFr: [
      "Montez d'abord sur les rails latéraux, puis démarrez à marche lente (3–4 km/h).",
      "Tenez les barres brièvement si besoin, puis marchez naturellement, posture droite.",
      "Augmentez vitesse ou inclinaison progressivement une fois à l'aise.",
      "Intervalles : alternez 1 min plus rapide / 1–2 min récupération facile.",
      "Ralentissez avant d'arrêter, puis descendez sur les rails latéraux.",
    ],
    tipsEn: [
      "A 1–2% incline better mimics outdoor running.",
      "Use the emergency clip if available — especially for beginners.",
    ],
    tipsFr: [
      "Une inclinaison de 1–2 % imite mieux la course en extérieur.",
      "Utilisez le clip d'urgence s'il est disponible — surtout pour débutants.",
    ],
    warningsEn: [
      "Never step off a moving belt onto the floor suddenly.",
      "If dizzy, slow down immediately and use the rails.",
    ],
    warningsFr: [
      "Ne descendez jamais brusquement d'un tapis en mouvement.",
      "Si vous avez des vertiges, ralentissez immédiatement et tenez les barres.",
    ],
    sortOrder: 10,
    imageUrls: ["/machines/treadmill-1.jpg", "/machines/treadmill-2.jpg"],
  },
];

async function main() {
  console.log("Seeding YMCA Notre-Dame-de-Grâce...");

  await prisma.issueReport.deleteMany();
  await prisma.machine.deleteMany();
  await prisma.user.deleteMany();
  await prisma.gym.deleteMany();

  const gym = await prisma.gym.create({
    data: {
      name: "YMCA Notre-Dame-de-Grâce",
      slug: "ymca-quebec",
      tagline: "We build strong kids, families, communities",
      primaryColor: "#0060A9",
      secondaryColor: "#003366",
      city: "Montréal, QC",
    },
  });

  const passwordHash = await bcrypt.hash("demo1234", 10);
  await prisma.user.create({
    data: {
      email: "admin@ymca-quebec.demo",
      passwordHash,
      name: "Alex Admin",
      role: "ADMIN",
      gymId: gym.id,
    },
  });

  // Deterministic demo views: a few zeroes for ROI "content gap", others ranked.
  const viewBySlug: Record<string, number> = {
    "lat-pulldown": 86,
    "seated-cable-row": 54,
    "leg-press": 71,
    "chest-press": 42,
    "shoulder-press": 28,
    "triceps-pushdown": 19,
    "leg-curl": 0,
    "cable-crossover": 33,
    "smith-squat": 0,
    treadmill: 61,
  };

  const created: { id: string; slug: string }[] = [];
  for (const m of machines) {
    const imageUrls =
      "imageUrls" in m && Array.isArray((m as { imageUrls?: string[] }).imageUrls)
        ? JSON.stringify((m as { imageUrls: string[] }).imageUrls)
        : null;
    const row = await prisma.machine.create({
      data: {
        gymId: gym.id,
        nameEn: m.nameEn,
        nameFr: m.nameFr,
        slug: m.slug,
        token: token(),
        category: m.category,
        muscleGroups: m.muscleGroups,
        descriptionEn: m.descriptionEn,
        descriptionFr: m.descriptionFr,
        stepsEn: JSON.stringify(m.stepsEn),
        stepsFr: JSON.stringify(m.stepsFr),
        tipsEn: JSON.stringify(m.tipsEn),
        tipsFr: JSON.stringify(m.tipsFr),
        warningsEn: JSON.stringify(m.warningsEn),
        warningsFr: JSON.stringify(m.warningsFr),
        sortOrder: m.sortOrder,
        active: true,
        viewCount: viewBySlug[m.slug] ?? 10,
        imageUrls,
      },
    });
    created.push({ id: row.id, slug: row.slug });
  }

  const bySlug = Object.fromEntries(created.map((c) => [c.slug, c.id]));
  const sampleIssues: { slug: string; note: string; status: string }[] = [
    { slug: "lat-pulldown", note: "Thigh pad feels loose on the right side.", status: "OPEN" },
    { slug: "leg-press", note: "Safety catch sticks when unlocking.", status: "OPEN" },
    { slug: "treadmill", note: "Emergency stop clip missing.", status: "RESOLVED" },
    { slug: "chest-press", note: "Seat adjustment pin hard to pull.", status: "RESOLVED" },
  ];
  for (const issue of sampleIssues) {
    const machineId = bySlug[issue.slug];
    if (!machineId) continue;
    await prisma.issueReport.create({
      data: { machineId, note: issue.note, status: issue.status },
    });
  }

  console.log("✅ Seed complete");
  console.log("   Gym: YMCA Notre-Dame-de-Grâce");
  console.log("   Login: admin@ymca-quebec.demo / demo1234");
  console.log(`   Machines: ${machines.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
