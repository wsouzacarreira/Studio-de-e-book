// netlify/functions/generate-image.js
// Endpoint: POST /.netlify/functions/generate-image
// Body JSON: { prompt: string, model?: string, size?: string }

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "OpenRouter API key not configured on server." }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const prompt = body.prompt || "Capa de e-book minimalista e moderna sobre tecnologia.";
  const model = body.model || process.env.OPENROUTER_MODEL || "gpt-image-1";
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
            content: [
              { type: "text", text: `Generate an e-book cover image (${size}). ${prompt}` }
            ]
          }
        ],
      }),
    });

    const data = await resp.json();

    const findImage = (obj) => {
      if (!obj) return null;
      if (typeof obj === "string") {
        if (obj.startsWith("data:image/")) return obj;
        if (/^(?:[A-Za-z0-9+/=]+)$/.test(obj) && obj.length > 200) return obj;
        if (obj.startsWith("http")) return obj;
      }
      if (Array.isArray(obj)) {
        for (const item of obj) {
          const r = findImage(item);
          if (r) return r;
        }
      } else if (typeof obj === "object") {
        if (obj.image_url && (obj.image_url.url || obj.image_url)) return obj.image_url.url || obj.image_url;
        if (obj.base64) return obj.base64;
        if (obj.url && (obj.url.includes(".png") || obj.url.includes(".jpg") || obj.url.includes("data:image"))) return obj.url;
        for (const k of Object.keys(obj)) {
          const r = findImage(obj[k]);
          if (r) return r;
        }
      }
      return null;
    };

    const imageCandidate = findImage(data) || findImage(data.output) || findImage(data.choices) || findImage(data.result);

    if (!imageCandidate) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "No image found in OpenRouter response", debug: data }),
      };
    }

    if (typeof imageCandidate === "string" && imageCandidate.startsWith("http")) {
      const imgResp = await fetch(imageCandidate);
      const arrayBuffer = await imgResp.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const ext = imageCandidate.split(".").pop().toLowerCase();
      const mime = ext === "png" ? "image/png" : "image/jpeg";
      return {
        statusCode: 200,
        body: JSON.stringify({ imageBase64: base64, mime }),
      };
    }

    if (typeof imageCandidate === "string" && imageCandidate.startsWith("data:image/")) {
      const [meta, base64] = imageCandidate.split(",");
      const mime = meta.split(":")[1].split(";")[0];
      return {
        statusCode: 200,
        body: JSON.stringify({ imageBase64: base64, mime }),
      };
    }

    if (typeof imageCandidate === "string") {
      return {
        statusCode: 200,
        body: JSON.stringify({ imageBase64: imageCandidate, mime: "image/png" }),
      };
    }

    return { statusCode: 500, body: JSON.stringify({ error: "Unhandled image format", debug: imageCandidate }) };

  } catch (err) {
    console.error("generate-image error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Server error", message: err.message }) };
  }
};
