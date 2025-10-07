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
    if (!content) {
        console.warn("Content is empty, cannot generate PDF.");
        return;
    }
    
    // Ensure jspdf is available
    if (typeof jspdf === 'undefined' || !jspdf.jsPDF) {
        console.error("jsPDF library not loaded.");
        return;
    }

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

    doc.setFontSize(11);

    const lines = doc.splitTextToSize(content, usableWidth);
    
    let cursorY = margin;
    const lineHeight = 6; 
    let pageNumber = 1;

    // Function to add page number at the bottom center
    const addPageNumber = (pageNum: number) => {
        doc.setFontSize(9); 
        // Adjusted vertical position to be 15mm from the bottom edge for more clearance
        doc.text(`${pageNum}`, pageWidth / 2, pageHeight - 15, { align: 'center' });
        doc.setFontSize(11); 
    };

    // Add page number to the first page before any content is added
    addPageNumber(pageNumber);

    lines.forEach((line: string) => {
        // Check if the current line will exceed the page height
        if (cursorY + lineHeight > pageHeight - margin) {
            doc.addPage(); // Add a new page
            pageNumber++; // Increment page number
            addPageNumber(pageNumber); // Add page number to the *new* page
            cursorY = margin; // Reset cursorY for new page
        }
        doc.text(line, margin, cursorY);
        cursorY += lineHeight; 
    });
    
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`${safeTitle || 'ebook'}.pdf`);
};