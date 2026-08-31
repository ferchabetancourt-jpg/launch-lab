"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { radarNichosPev } from "@/playbooks/radar-nichos-pev";
import type { Sesion } from "@/types/sesion";

export default function ReportePage() {
  const { id } = useParams<{ id: string }>();
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`/api/sesion?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        setSesion(data.error ? null : data);
        setCargando(false);
      });
  }, [id]);

  if (cargando) return <p className="subtitle">Cargando...</p>;
  if (!sesion) return <p className="subtitle">No se encontró la sesión.</p>;

  const reporteFinal = sesion.resultados.find((r) => r.pasoId === "5.1")?.analisis;

  function descargar() {
    if (!reporteFinal) return;
    const blob = new Blob([reporteFinal], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte-nicho-${sesion!.id.slice(0, 8)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <h1>{radarNichosPev.nombre} — Reporte</h1>
      {reporteFinal ? (
        <div className="card">
          <div className="acciones" style={{ marginBottom: 16, marginTop: 0 }}>
            <button onClick={descargar}>Descargar .md</button>
          </div>
          <div className="analisis">{reporteFinal}</div>
        </div>
      ) : (
        <p className="subtitle">Esta sesión todavía no llegó a la Fase 5 (Reporte final).</p>
      )}
    </>
  );
}
