import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { MachineForm } from "@/components/admin/MachineForm";

export default async function NewMachinePage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add machine</h1>
      <MachineForm />
    </main>
  );
}
