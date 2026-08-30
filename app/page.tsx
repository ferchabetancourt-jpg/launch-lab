"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { radarNichosPev } from "@/playbooks/radar-nichos-pev";

const ULTIMA_SESION_KEY = "radar-nichos:ultima-sesion";

export default function InicioPage() {
  const router = useRouter();
  const [creando, setCreando] = useState(false);
  const [ultimaSesion, setUltimaSesion] = useState<string | null>(null);

  useEffect(() => {
    setUltimaSesion(localStorage.getItem(ULTIMA_SESION_KEY));
  }, []);

  async function crearSesion() {
    setCreando(true);
    const res = await fetch("/api/sesion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playbookId: radarNichosPev.id }),
    });
    const sesion = await res.json();
    localStorage.setItem(ULTIMA_SESION_KEY, sesion.id);
    router.push(`/sesion/${sesion.id}`);
  }

  return (
    <>
      <h1>Radar de Nichos</h1>
      <p className="subtitle">Herramienta interna PEV — te guía paso a paso, tú pegas lo que investigas.</p>

      <div className="card">
        <span className="badge">Playbook</span>
        <h2 style={{ marginTop: 10 }}>{radarNichosPev.nombre}</h2>
        <p className="instrucciones">{radarNichosPev.descripcion}</p>
        <button onClick={crearSesion} disabled={creando}>
          {creando ? "Creando..." : "Empezar análisis nuevo"}
        </button>
      </div>

      {ultimaSesion && (
        <div className="card">
          <h2>Retomar</h2>
          <p className="instrucciones">Tienes una sesión reciente en este navegador.</p>
          <button className="secundario" onClick={() => router.push(`/sesion/${ultimaSesion}`)}>
            Continuar donde quedé
          </button>
        </div>
      )}
    </>
  );
}
