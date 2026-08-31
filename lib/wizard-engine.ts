import type { Paso, Playbook } from "@/playbooks/types";
import type { ResultadoPaso, Sesion } from "@/types/sesion";

export function obtenerPaso(playbook: Playbook, pasoId: string): Paso {
  const paso = playbook.pasos.find((p) => p.id === pasoId);
  if (!paso) {
    throw new Error(`Paso ${pasoId} no existe en el playbook ${playbook.id}`);
  }
  return paso;
}

export function primerPaso(playbook: Playbook): Paso {
  return playbook.pasos[0];
}

export function siguientePaso(playbook: Playbook, pasoActualId: string): Paso | null {
  const indice = playbook.pasos.findIndex((p) => p.id === pasoActualId);
  if (indice === -1 || indice === playbook.pasos.length - 1) return null;
  return playbook.pasos[indice + 1];
}

/**
 * Arma un resumen de los resultados previos de la sesión para dar contexto
 * al prompt del paso actual, sin tener que repetir todo el historial crudo.
 */
export function armarContexto(playbook: Playbook, resultados: ResultadoPaso[]): string {
  if (resultados.length === 0) return "(sin pasos previos todavía)";

  return resultados
    .map((r) => {
      const paso = playbook.pasos.find((p) => p.id === r.pasoId);
      const titulo = paso ? `${paso.faseId} — ${paso.titulo}` : r.pasoId;
      const cuerpo = r.analisis ?? r.input;
      return `### ${titulo}\n${cuerpo}`;
    })
    .join("\n\n");
}

export function armarPrompt(paso: Paso, input: string, contexto: string): string {
  if (!paso.promptAnalisis) {
    throw new Error(`El paso ${paso.id} no tiene promptAnalisis definido.`);
  }
  return paso.promptAnalisis
    .replace("{input}", input || "(el usuario no agregó nada en este paso)")
    .replace("{contexto}", contexto);
}

export function progresoSesion(playbook: Playbook, sesion: Sesion): { completados: number; total: number } {
  return { completados: sesion.resultados.length, total: playbook.pasos.length };
}
