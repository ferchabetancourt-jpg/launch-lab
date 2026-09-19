import Anthropic from "@anthropic-ai/sdk";
import type { ModeloClaude } from "@/playbooks/types";

const MODEL_IDS: Record<ModeloClaude, string> = {
  sonnet: "claude-sonnet-5",
  opus: "claude-opus-5",
};

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "Falta ANTHROPIC_API_KEY. Configúrala en .env.local (desarrollo) o en las variables de entorno de Vercel (producción)."
    );
  }
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export async function analizarConClaude(modelo: ModeloClaude, prompt: string): Promise<string> {
  const anthropic = getClient();
  const respuesta = await anthropic.messages.create({
    model: MODEL_IDS[modelo],
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const bloqueTexto = respuesta.content.find((bloque) => bloque.type === "text");
  if (!bloqueTexto || bloqueTexto.type !== "text") {
    throw new Error("Claude no devolvió texto en la respuesta.");
  }
  return bloqueTexto.text;
}
