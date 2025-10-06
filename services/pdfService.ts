import { FontFamily } from '../types';
declare const jspdf: any;

const mapFontToPdf = (font: FontFamily): string => {
    switch (font) {
        case FontFamily.MERRIWEATHER:
            return 'times'; // Serif
        case FontFamily.INTER:
        case FontFamily.ROBOTO:
        case FontFamily.LATO:
        default:
            return 'helvetica'; // Sans-serif
    }
}

export const downloadPdf = (content: string, font: FontFamily, title: string) => {
    if (!content) return;
    
    // eslint-disable-next-line new-cap
    const doc = new jspdf.jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    });

    const pdfFont = mapFontToPdf(font);
    doc.setFont(pdfFont);

    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const usableWidth = pageWidth - 2 * margin;

    // Use a smaller font size for better fitting
    doc.setFontSize(11);

    const lines = doc.splitTextToSize(content, usableWidth);
    
    let cursorY = margin;
    const lineHeight = 6; // Adjust line height for 11pt font
    let pageNumber = 1;

    // Function to add page number
    const addPageNumber = (pageNum: number) => {
        doc.setFontSize(9); // Smaller font for page number
        doc.text(`${pageNum}`, pageWidth / 2, pageHeight - margin / 2, { align: 'center' });
        doc.setFontSize(11); // Reset to content font size
    };

    // Add page number to the first page
    addPageNumber(pageNumber);

    lines.forEach((line: string) => {
        if (cursorY + lineHeight > pageHeight - margin) { // Check if new page is needed
            doc.addPage();
            pageNumber++;
            addPageNumber(pageNumber); // Add page number to new page
            cursorY = margin; // Reset cursorY for new page
        }
        doc.text(line, margin, cursorY);
        cursorY += lineHeight; 
    });
    
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`${safeTitle || 'ebook'}.pdf`);
};