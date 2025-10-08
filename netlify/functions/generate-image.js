exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "OpenRouter API key not configured" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const prompt = body.prompt || "Capa de e-book minimalista e moderna";
  const model = body.model || "gpt-image-1";
  const size = body.size || "1024x1024";

  try {
    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        modalities: ["text", "image"],
        messages: [
          {
            role: "user",
            content: [{ type: "text", text: `Generate an e-book cover image (${size}). ${prompt}` }],
          },
        ],
      }),
    });

    const data = await resp.json();
    const base64 = data?.choices?.[0]?.message?.content?.[0]?.image_url?.base64;
    if (!base64) {
      return { statusCode: 500, body: JSON.stringify({ error: "No image in response", debug: data }) };
    }

    return { statusCode: 200, body: JSON.stringify({ imageBase64: base64, mime: "image/png" }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
