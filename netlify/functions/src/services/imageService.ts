// src/services/imageService.ts
export async function generateCoverImage(prompt: string, model?: string, size?: string) {
  const res = await fetch("/.netlify/functions/generate-image", {
    method: "POST",
    body: JSON.stringify({ prompt, model, size }),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error("Erro gerando imagem: " + text);
  }

  const json = await res.json();
  if (json.error) throw new Error(json.error);

  return json as { imageBase64: string; mime: string };
}
