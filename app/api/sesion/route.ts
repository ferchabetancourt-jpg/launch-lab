import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { playbooks } from "@/playbooks/radar-nichos-pev";
import { primerPaso } from "@/lib/wizard-engine";
import { guardarSesion, leerSesion } from "@/lib/store";
import type { Sesion } from "@/types/sesion";

export async function POST(req: NextRequest) {
  const { playbookId } = await req.json();
  const playbook = playbooks[playbookId as keyof typeof playbooks];
  if (!playbook) {
    return NextResponse.json({ error: "Playbook no encontrado" }, { status: 404 });
  }

  const ahora = new Date().toISOString();
  const sesion: Sesion = {
    id: randomUUID(),
    playbookId,
    pasoActualId: primerPaso(playbook).id,
    resultados: [],
    creadaEn: ahora,
    actualizadaEn: ahora,
  };
  await guardarSesion(sesion);
  return NextResponse.json(sesion);
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Falta el parámetro id" }, { status: 400 });
  }
  const sesion = await leerSesion(id);
  if (!sesion) {
    return NextResponse.json({ error: "Sesión no encontrada" }, { status: 404 });
  }
  return NextResponse.json(sesion);
}
