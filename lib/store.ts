import { promises as fs } from "fs";
import path from "path";
import type { Sesion } from "@/types/sesion";

const usaKv = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
const DIR_LOCAL = path.join(process.cwd(), ".data");

async function archivoLocal(id: string): Promise<string> {
  await fs.mkdir(DIR_LOCAL, { recursive: true });
  return path.join(DIR_LOCAL, `${id}.json`);
}

export async function guardarSesion(sesion: Sesion): Promise<void> {
  if (usaKv) {
    const { kv } = await import("@vercel/kv");
    await kv.set(`sesion:${sesion.id}`, sesion);
    return;
  }
  const ruta = await archivoLocal(sesion.id);
  await fs.writeFile(ruta, JSON.stringify(sesion, null, 2), "utf-8");
}

export async function leerSesion(id: string): Promise<Sesion | null> {
  if (usaKv) {
    const { kv } = await import("@vercel/kv");
    const sesion = await kv.get<Sesion>(`sesion:${id}`);
    return sesion ?? null;
  }
  try {
    const ruta = await archivoLocal(id);
    const contenido = await fs.readFile(ruta, "utf-8");
    return JSON.parse(contenido) as Sesion;
  } catch {
    return null;
  }
}
