import { PDFDocument } from 'pdf-lib-with-encrypt';

export interface SplitOptions {
  mode: 'pages' | 'range' | 'single';
  pagesPerFile?: number;
  ranges?: string;
}

export interface SplitResult {
  fileName: string;
  blob: Blob;
  pageInfo: string;
}

export class PDFSplitter {
  static async splitPDF(file: File, options: SplitOptions): Promise<SplitResult[]> {
    const pdfBytes = await file.arrayBuffer();
    const sourcePdf = await PDFDocument.load(pdfBytes);
    const totalPages = sourcePdf.getPageCount();
    const baseName = file.name.replace('.pdf', '');

    switch (options.mode) {
      case 'single':
        return this.splitIntoSinglePages(sourcePdf, baseName, totalPages);
      
      case 'pages':
        return this.splitByPagesPerFile(sourcePdf, baseName, totalPages, options.pagesPerFile || 1);
      
      case 'range':
        return this.splitByRanges(sourcePdf, baseName, options.ranges || '');
      
      default:
        throw new Error('잘못된 분할 모드입니다.');
    }
  }

  private static async splitIntoSinglePages(
    sourcePdf: PDFDocument,
    baseName: string,
    totalPages: number
  ): Promise<SplitResult[]> {
    const results: SplitResult[] = [];

    for (let i = 0; i < totalPages; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(sourcePdf, [i]);
      newPdf.addPage(copiedPage);

      const pdfBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });

      results.push({
        fileName: `${baseName}_page${i + 1}.pdf`,
        blob,
        pageInfo: `${i + 1}`
      });
    }

    return results;
  }

  private static async splitByPagesPerFile(
    sourcePdf: PDFDocument,
    baseName: string,
    totalPages: number,
    pagesPerFile: number
  ): Promise<SplitResult[]> {
    const results: SplitResult[] = [];
    let partNumber = 1;

    for (let startPage = 0; startPage < totalPages; startPage += pagesPerFile) {
      const endPage = Math.min(startPage + pagesPerFile - 1, totalPages - 1);
      const pageIndices = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
      
      for (const page of copiedPages) {
        newPdf.addPage(page);
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });

      results.push({
        fileName: `${baseName}_part${partNumber}.pdf`,
        blob,
        pageInfo: `${startPage + 1}-${endPage + 1}`
      });

      partNumber++;
    }

    return results;
  }

  private static async splitByRanges(
    sourcePdf: PDFDocument,
    baseName: string,
    ranges: string
  ): Promise<SplitResult[]> {
    const results: SplitResult[] = [];
    const rangeArray = ranges.split(',').map(r => r.trim());

    for (let i = 0; i < rangeArray.length; i++) {
      const range = rangeArray[i];
      const pageIndices = this.parsePageRange(range);

      if (pageIndices.length === 0) continue;

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
      
      for (const page of copiedPages) {
        newPdf.addPage(page);
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });

      results.push({
        fileName: `${baseName}_range${i + 1}.pdf`,
        blob,
        pageInfo: range
      });
    }

    return results;
  }

  private static parsePageRange(range: string): number[] {
    const pageIndices: number[] = [];

    if (range.includes('-')) {
      const parts = range.split('-');
      if (parts.length >= 2) {
        const start = parseInt(parts[0]?.trim() || '0') - 1;
        const end = parseInt(parts[1]?.trim() || '0') - 1;
        if (!isNaN(start) && !isNaN(end) && start <= end && start >= 0) {
          for (let i = start; i <= end; i++) {
            pageIndices.push(i);
          }
        }
      }
    } else {
      const pageNum = parseInt(range.trim()) - 1;
      if (!isNaN(pageNum) && pageNum >= 0) {
        pageIndices.push(pageNum);
      }
    }

    return pageIndices;
  }

  static async getPDFInfo(file: File): Promise<{ pageCount: number; size: string }> {
    try {
      const pdfBytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(pdfBytes);
      const pageCount = pdf.getPageCount();
      const size = `${(file.size / 1024 / 1024).toFixed(2)} MB`;

      return { pageCount, size };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`PDF 파일 정보를 가져올 수 없습니다: ${errorMessage}`);
    }
  }
}