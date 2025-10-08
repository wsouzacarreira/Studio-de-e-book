import { jsPDF } from "jspdf";
import { generateCoverImage } from "./imageService";
import { generateEbookContent } from "./geminiService"; // já deve existir

export async function createPdfWithCover(formData: any) {
  // 1. Gera texto do e-book
  const ebookText = await generateEbookContent(formData);

  // 2. Gera imagem da capa via OpenRouter
  const promptForCover = `Minimal, modern e-book cover for "${formData.title || 'E-book'}" in Portuguese, clean typography, abstract background.`;
  const { imageBase64, mime } = await generateCoverImage(promptForCover, undefined, "1024x1024");

  // 3. Monta PDF
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const imgDataUrl = `data:${mime};base64,${imageBase64}`;

  // Página de capa
  doc.addImage(imgDataUrl, mime.includes("png") ? "PNG" : "JPEG", 0, 0, 595, 842);

  // Conteúdo
  doc.addPage();
  doc.setFontSize(12);
  const lines = doc.splitTextToSize(ebookText.content, 560);
  doc.text(lines, 20, 40);

  // Salvar PDF
  doc.save(`${formData.title || "ebook"}.pdf`);
}
