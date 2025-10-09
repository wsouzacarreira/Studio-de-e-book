export async function generateCoverImage(
  prompt: string,
  model: string = "gryphe/mythomax-l2-13b", // ou outro que você definiu no OpenRouter
  size: string = "1024x1024"
) {
  const response = await fetch("https://openrouter.ai/api/v1/images", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt,
      model,
      size,
      response_format: "b64_json"
    })
  });

  if (!response.ok) {
    throw new Error(`Erro ao gerar imagem: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    imageBase64: data.data[0].b64_json,
    mime: "image/png"
  };
}
