import { NextRequest, NextResponse } from "next/server";
import { playbooks } from "@/playbooks/radar-nichos-pev";
import { armarContexto, armarPrompt, obtenerPaso, siguientePaso } from "@/lib/wizard-engine";
import { analizarConClaude } from "@/lib/claude";
import { guardarSesion, leerSesion } from "@/lib/store";
import type { ResultadoPaso } from "@/types/sesion";

export async function POST(req: NextRequest) {
  const { sesionId, input, confirmado } = await req.json();

  const sesion = await leerSesion(sesionId);
  if (!sesion) {
    return NextResponse.json({ error: "Sesión no encontrada" }, { status: 404 });
  }

  const playbook = playbooks[sesion.playbookId as keyof typeof playbooks];
  if (!playbook) {
    return NextResponse.json({ error: "Playbook no encontrado" }, { status: 404 });
  }

  const paso = obtenerPaso(playbook, sesion.pasoActualId);

  // Paso de gasto (Opus): exige confirmación explícita del usuario antes de llamar a la API.
  if (paso.modelo === "opus" && !confirmado) {
    return NextResponse.json({ requiereConfirmacion: true, modelo: paso.modelo });
  }

  let analisis: string | undefined;
  if (paso.requiereAnalisis) {
    const contexto = armarContexto(playbook, sesion.resultados);
    const prompt = armarPrompt(paso, input ?? "", contexto);
    analisis = await analizarConClaude(paso.modelo, prompt);
  }

  const resultado: ResultadoPaso = {
    pasoId: paso.id,
    input: input ?? "",
    analisis,
    completadoEn: new Date().toISOString(),
  };

  const siguiente = siguientePaso(playbook, paso.id);
  sesion.resultados = [...sesion.resultados.filter((r) => r.pasoId !== paso.id), resultado];
  sesion.pasoActualId = siguiente ? siguiente.id : paso.id;
  sesion.actualizadaEn = new Date().toISOString();

  await guardarSesion(sesion);

  return NextResponse.json({ sesion, terminado: siguiente === null });
}
