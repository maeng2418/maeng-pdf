import { PDFDocument } from 'pdf-lib-with-encrypt';

export class PDFMerger {
  static async mergePDFs(files: File[]): Promise<Blob> {
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const pdfBytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(pdfBytes);
      const pageCount = pdf.getPageCount();

      for (let i = 0; i < pageCount; i++) {
        const [copiedPage] = await mergedPdf.copyPages(pdf, [i]);
        mergedPdf.addPage(copiedPage);
      }
    }

    const mergedPdfBytes = await mergedPdf.save();
    return new Blob([new Uint8Array(mergedPdfBytes)], { type: 'application/pdf' });
  }

  static async validatePDFFile(file: File): Promise<boolean> {
    try {
      const bytes = await file.arrayBuffer();
      await PDFDocument.load(bytes);
      return true;
    } catch (error: unknown) {
      console.warn('PDF validation failed:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }
}