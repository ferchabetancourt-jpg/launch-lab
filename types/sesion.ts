export interface ResultadoPaso {
  pasoId: string;
  /** Lo que el usuario pegó/escribió en este paso. */
  input: string;
  /** La síntesis devuelta por Claude, si el paso requería análisis. */
  analisis?: string;
  completadoEn: string;
}

export interface Sesion {
  id: string;
  playbookId: string;
  /** Id del paso actual a mostrar. */
  pasoActualId: string;
  resultados: ResultadoPaso[];
  creadaEn: string;
  actualizadaEn: string;
}
