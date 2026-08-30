export type ModeloClaude = "sonnet" | "opus";

export type TipoInput = "texto" | "texto-largo";

export interface Paso {
  id: string;
  faseId: string;
  titulo: string;
  /** Instrucciones para el usuario: qué buscar y dónde, en lenguaje no técnico. */
  instrucciones: string;
  tipoInput: TipoInput;
  placeholder?: string;
  /** Si es false, el paso no llama a Claude — solo guarda el input (ej: el input inicial). */
  requiereAnalisis: boolean;
  /** Pasos de síntesis pura donde el input es una nota opcional, no obligatoria. */
  entradaOpcional?: boolean;
  modelo: ModeloClaude;
  /**
   * Prompt de análisis para Claude. Puede usar los placeholders {input} (lo que
   * pegó el usuario en este paso) y {contexto} (resumen de resultados previos
   * de la sesión, armado por el wizard-engine).
   */
  promptAnalisis?: string;
}

export interface Fase {
  id: string;
  numero: number;
  nombre: string;
  descripcion: string;
  modelo: ModeloClaude;
}

export interface Playbook {
  id: string;
  nombre: string;
  descripcion: string;
  fases: Fase[];
  pasos: Paso[];
}
