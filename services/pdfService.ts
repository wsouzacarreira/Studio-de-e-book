import { jsPDF } from "jspdf";
import { FontFamily } from "../types";
import { generateCoverImage } from "./imageService";
import { generateEbookContent } from "./geminiService";

export async function createPdfWithCover(formData: any, font: FontFamily) {
  // 1. Gera o texto do e-book
  const ebookText = await generateEbookContent(formData);

  // 2. Gera a capa
  const promptForCover = `Minimal, modern e-book cover for "${formData.title || 'E-book'}" in Portuguese, clean typography, abstract background.`;
  const { imageBase64, mime } = await generateCoverImage(promptForCover);

  // 3. Cria PDF
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const imgDataUrl = `data:${mime};base64,${imageBase64}`;

  // Página de capa
  doc.addImage(imgDataUrl, "PNG", 0, 0, 595, 842);

  // Página de conteúdo
  doc.addPage();

  let pdfFontName = "Roboto";
  if (font === FontFamily.MERRIWEATHER) {
    pdfFontName = "times";
  }

  doc.setFont(pdfFontName);
  doc.setFontSize(11);

  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const usableWidth = pageWidth - 2 * margin;
  const lines = doc.splitTextToSize(ebookText.content, usableWidth);

  let cursorY = margin;
  const lineHeight = 16;

  lines.forEach((line: string) => {
    if (cursorY + lineHeight > 800) {
      doc.addPage();
      cursorY = margin;
    }
    doc.text(line, margin, cursorY);
    cursorY += lineHeight;
  });

  const safeTitle = formData.title?.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  doc.save(`${safeTitle || "ebook"}.pdf`);
}
