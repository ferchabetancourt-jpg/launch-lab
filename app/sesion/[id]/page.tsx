"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { radarNichosPev } from "@/playbooks/radar-nichos-pev";
import type { Sesion } from "@/types/sesion";

export default function SesionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [cargando, setCargando] = useState(true);
  const [valorInput, setValorInput] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [pendienteConfirmacion, setPendienteConfirmacion] = useState(false);
  const [mostrarAnalisis, setMostrarAnalisis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/sesion?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setSesion(data);
        }
        setCargando(false);
      });
  }, [id]);

  if (cargando) return <p className="subtitle">Cargando...</p>;
  if (error || !sesion) return <p className="subtitle">No se encontró la sesión. {error}</p>;

  const playbook = radarNichosPev;
  const pasoActual = playbook.pasos.find((p) => p.id === sesion.pasoActualId)!;
  const fase = playbook.fases.find((f) => f.id === pasoActual.faseId)!;
  const esUltimoPaso = playbook.pasos[playbook.pasos.length - 1].id === pasoActual.id;
  const yaCompletadoUltimo = esUltimoPaso && sesion.resultados.some((r) => r.pasoId === pasoActual.id);

  async function enviar(confirmado: boolean) {
    setEnviando(true);
    const res = await fetch("/api/analizar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sesionId: sesion!.id, input: valorInput, confirmado }),
    });
    const data = await res.json();
    setEnviando(false);

    if (data.requiereConfirmacion) {
      setPendienteConfirmacion(true);
      return;
    }
    setPendienteConfirmacion(false);
    const resultadoDeEsteP = data.sesion.resultados.find((r: { pasoId: string }) => r.pasoId === pasoActual.id);
    setSesion(data.sesion);
    setValorInput("");
    if (resultadoDeEsteP?.analisis) {
      setMostrarAnalisis(resultadoDeEsteP.analisis);
    }
  }

  if (yaCompletadoUltimo && !mostrarAnalisis) {
    return (
      <>
        <h1>{radarNichosPev.nombre}</h1>
        <div className="card">
          <h2>Análisis completo</h2>
          <p className="instrucciones">Terminaste las 5 fases. El reporte final está listo.</p>
          <button onClick={() => router.push(`/reporte/${sesion.id}`)}>Ver reporte final</button>
        </div>
      </>
    );
  }

  if (mostrarAnalisis) {
    return (
      <>
        <h1>{radarNichosPev.nombre}</h1>
        <div className="progress">
          Fase {fase.numero} de {playbook.fases.length} — {fase.nombre}
        </div>
        <div className="card">
          <h2>{pasoActual.titulo}</h2>
          <div className="analisis">{mostrarAnalisis}</div>
          <div className="acciones">
            <button
              onClick={() => {
                setMostrarAnalisis(null);
              }}
            >
              {esUltimoPaso ? "Ir al reporte" : "Continuar al siguiente paso"}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <h1>{radarNichosPev.nombre}</h1>
      <div className="progress">
        Fase {fase.numero} de {playbook.fases.length} — {fase.nombre} · modelo: {pasoActual.modelo}
      </div>
      <div className="card">
        <span className="badge">Paso {pasoActual.id}</span>
        <h2 style={{ marginTop: 10 }}>{pasoActual.titulo}</h2>
        <p className="instrucciones">{pasoActual.instrucciones}</p>

        {pasoActual.tipoInput === "texto-largo" ? (
          <textarea
            value={valorInput}
            onChange={(e) => setValorInput(e.target.value)}
            placeholder={pasoActual.placeholder}
          />
        ) : (
          <input
            type="text"
            value={valorInput}
            onChange={(e) => setValorInput(e.target.value)}
            placeholder={pasoActual.placeholder}
          />
        )}

        {pendienteConfirmacion && (
          <div className="aviso-opus">
            Este análisis usa <strong>Opus</strong> (el modelo más profundo, con costo más alto de API). ¿Procedes?
            <div className="acciones">
              <button onClick={() => enviar(true)} disabled={enviando}>
                {enviando ? "Analizando..." : "Sí, procede"}
              </button>
              <button className="secundario" onClick={() => setPendienteConfirmacion(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {!pendienteConfirmacion && (
          <div className="acciones">
            <button
              onClick={() => enviar(false)}
              disabled={enviando || (!pasoActual.entradaOpcional && valorInput.trim() === "")}
            >
              {enviando ? "Procesando..." : pasoActual.requiereAnalisis ? "Analizar y continuar" : "Guardar y continuar"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
