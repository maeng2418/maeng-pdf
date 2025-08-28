import jsPDF from 'jspdf';
import { PDFDocument, rgb } from 'pdf-lib';

export interface ConversionOptions {
  quality?: number;
  pageSize?: 'a4' | 'a3' | 'letter' | 'legal';
  orientation?: 'portrait' | 'landscape';
  password?: string;
}

export interface ImageToPdfOptions extends ConversionOptions {
  mergeIntoOne?: boolean;
}

export class PDFConverter {
  static async imagesToPDF(files: File[], options: ImageToPdfOptions = {}): Promise<Blob> {
    const {
      quality = 80,
      pageSize = 'a4',
      orientation = 'portrait',
      mergeIntoOne = true
    } = options;

    if (mergeIntoOne) {
      return this.createSinglePDFFromImages(files, { quality, pageSize, orientation });
    } else {
      return this.createMultiplePDFsFromImages(files, { quality, pageSize, orientation });
    }
  }

  private static async createSinglePDFFromImages(
    files: File[],
    options: ConversionOptions
  ): Promise<Blob> {
    const { pageSize = 'a4', orientation = 'portrait', quality = 80 } = options;
    
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: pageSize
    });

    let isFirstPage = true;

    for (const file of files) {
      const imageDataUrl = await this.fileToDataURL(file);
      
      if (!isFirstPage) {
        pdf.addPage();
      }

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('이미지 로드 실패'));
        img.src = imageDataUrl;
      });

      const imgAspectRatio = img.width / img.height;
      const pageAspectRatio = pageWidth / pageHeight;

      let width, height;
      if (imgAspectRatio > pageAspectRatio) {
        width = pageWidth - 20;
        height = width / imgAspectRatio;
      } else {
        height = pageHeight - 20;
        width = height * imgAspectRatio;
      }

      const x = (pageWidth - width) / 2;
      const y = (pageHeight - height) / 2;

      pdf.addImage(imageDataUrl, 'JPEG', x, y, width, height);
      isFirstPage = false;
    }

    return new Blob([pdf.output('blob')], { type: 'application/pdf' });
  }

  private static async createMultiplePDFsFromImages(
    files: File[],
    options: ConversionOptions
  ): Promise<Blob> {
    const zipModule = await import('jszip');
    const JSZip = zipModule.default;
    const zip = new JSZip();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const pdfBlob = await this.createSinglePDFFromImages([file], options);
      const baseName = file.name.split('.')[0] || 'converted';
      const fileName = `${baseName}.pdf`;
      zip.file(fileName, pdfBlob);
    }

    return await zip.generateAsync({ type: 'blob' });
  }

  private static fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('파일을 읽는데 실패했습니다.'));
        }
      };
      reader.onerror = () => reject(new Error('파일 읽기 중 오류가 발생했습니다.'));
      reader.readAsDataURL(file);
    });
  }

  static async wordToPDF(file: File): Promise<Blob> {
    try {
      const mammoth = await import('mammoth');
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      
      const pdf = new jsPDF();
      
      const lines = result.value.split('\n');
      let y = 20;
      
      for (const line of lines) {
        const textContent = line.replace(/<[^>]*>/g, '');
        if (textContent.trim()) {
          pdf.text(textContent, 20, y);
          y += 10;
          
          if (y > 280) {
            pdf.addPage();
            y = 20;
          }
        }
      }

      return new Blob([pdf.output('blob')], { type: 'application/pdf' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      throw new Error(`Word 변환 중 오류가 발생했습니다: ${errorMessage}`);
    }
  }

  static async excelToPDF(file: File): Promise<Blob> {
    try {
      const XLSX = await import('xlsx');
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      
      const pdf = new jsPDF();
      let isFirstSheet = true;

      for (const sheetName of workbook.SheetNames) {
        if (!isFirstSheet) pdf.addPage();
        
        const sheet = workbook.Sheets[sheetName];
        const csv = XLSX.utils.sheet_to_csv(sheet);
        const rows = csv.split('\n');
        
        pdf.setFontSize(14);
        pdf.text(sheetName, 20, 20);
        
        let y = 35;
        for (const row of rows) {
          const cells = row.split(',');
          let x = 20;
          
          for (const cell of cells) {
            if (cell.trim()) {
              pdf.setFontSize(10);
              pdf.text(cell, x, y);
              x += 40;
            }
          }
          
          y += 8;
          if (y > 280) {
            pdf.addPage();
            y = 20;
          }
        }
        
        isFirstSheet = false;
      }

      return new Blob([pdf.output('blob')], { type: 'application/pdf' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      throw new Error(`Excel 변환 중 오류가 발생했습니다: ${errorMessage}`);
    }
  }

  static getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }

  static isImageFile(file: File): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'bmp', 'tiff', 'gif'];
    const extension = this.getFileExtension(file.name);
    return imageExtensions.includes(extension) || file.type.startsWith('image/');
  }

  static isWordFile(file: File): boolean {
    const wordExtensions = ['doc', 'docx'];
    const extension = this.getFileExtension(file.name);
    return wordExtensions.includes(extension) || 
           file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }

  static isExcelFile(file: File): boolean {
    const excelExtensions = ['xls', 'xlsx'];
    const extension = this.getFileExtension(file.name);
    return excelExtensions.includes(extension) ||
           file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  }
}