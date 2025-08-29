"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, File, X, GripVertical, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface PDFFile {
  file: File;
  id: string;
  order: number;
}

export const PDFMerger = () => {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeProgress, setMergeProgress] = useState(0);
  const [mergedFile, setMergedFile] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;
    
    const uploadedFiles = Array.from(fileList);
    const pdfFiles = uploadedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== uploadedFiles.length) {
      toast({
        title: "경고",
        description: "PDF 파일만 업로드할 수 있습니다.",
        variant: "destructive",
      });
    }

    const newFiles = pdfFiles.map((file, index) => ({
      file,
      id: Math.random().toString(36).substring(2, 11),
      order: files.length + index,
    }));

    setFiles(prev => [...prev, ...newFiles]);
    
    // Reset input value to allow selecting the same files again
    event.target.value = '';
  };

  const triggerFileSelect = () => {
    const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id).map((f, index) => ({ ...f, order: index })));
  };

  const moveFile = (id: string, direction: 'up' | 'down') => {
    const currentIndex = files.findIndex(f => f.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === files.length - 1)
    ) {
      return;
    }

    const newFiles = [...files];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newFiles[currentIndex], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[currentIndex]];
    
    // 순서 재정렬
    newFiles.forEach((file, index) => {
      file.order = index;
    });

    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({
        title: "파일이 부족합니다",
        description: "병합하려면 최소 2개의 PDF 파일이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    setIsMerging(true);
    setMergeProgress(0);

    try {
      const { PDFMerger } = await import("@/lib/pdf-merger");
      
      const sortedFiles = files.sort((a, b) => a.order - b.order);
      const fileList = sortedFiles.map(f => f.file);

      // 진행률 시뮬레이션
      const progressInterval = setInterval(() => {
        setMergeProgress(prev => Math.min(prev + Math.random() * 15, 90));
      }, 200);

      const mergedBlob = await PDFMerger.mergePDFs(fileList);
      
      clearInterval(progressInterval);
      setMergeProgress(100);

      const url = URL.createObjectURL(mergedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged-document.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsMerging(false);
      setMergedFile("merged-document.pdf");
      
      toast({
        title: "병합 완료!",
        description: "PDF 파일이 성공적으로 병합되었습니다.",
      });
    } catch (error) {
      setIsMerging(false);
      setMergeProgress(0);
      
      toast({
        title: "병합 실패",
        description: error instanceof Error ? error.message : "병합 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const downloadMerged = () => {
    // 다운로드 시뮬레이션
    toast({
      title: "다운로드 시작",
      description: "병합된 PDF 파일을 다운로드합니다.",
    });
  };

  return (
    <div className="space-y-6">
      {/* 파일 업로드 영역 */}
      <Card className="shadow-card border-2 border-dashed border-upload-border bg-upload-zone">
        <div className="p-8 text-center">
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">PDF 파일 선택</h3>
          <p className="text-muted-foreground mb-4">
            병합할 PDF 파일들을 선택하세요 (최소 2개)
          </p>
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileUpload}
            className="sr-only"
            id="pdf-upload"
          />
          <Button 
            variant="outline" 
            size="lg" 
            onClick={triggerFileSelect}
            type="button"
          >
            PDF 파일 선택
          </Button>
        </div>
      </Card>

      {/* 업로드된 파일 목록 */}
      {files.length > 0 && (
        <Card className="p-6 shadow-soft">
          <h3 className="text-lg font-semibold mb-4">병합할 파일 순서</h3>
          <div className="space-y-2">
            {files.sort((a, b) => a.order - b.order).map((pdfFile, index) => (
              <div
                key={pdfFile.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                  <span className="text-sm font-medium bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center">
                    {index + 1}
                  </span>
                  <File className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{pdfFile.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(pdfFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveFile(pdfFile.id, 'up')}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveFile(pdfFile.id, 'down')}
                    disabled={index === files.length - 1}
                  >
                    ↓
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(pdfFile.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* 병합 진행률 */}
          {isMerging && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>병합 진행중...</span>
                <span>{Math.round(mergeProgress)}%</span>
              </div>
              <Progress value={mergeProgress} className="h-2" />
            </div>
          )}

          {/* 병합 버튼 */}
          <div className="mt-6 flex justify-center">
            <Button 
              onClick={handleMerge}
              disabled={isMerging || files.length < 2}
              size="lg"
              className="min-w-32"
            >
              {isMerging ? "병합 중..." : `${files.length}개 파일 병합`}
            </Button>
          </div>
        </Card>
      )}

      {/* 병합 완료 결과 */}
      {mergedFile && (
        <Card className="p-6 shadow-soft bg-success/5 border-success/20">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center mx-auto">
              <File className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-success">병합 완료!</h3>
              <p className="text-muted-foreground">{mergedFile}</p>
            </div>
            <Button onClick={downloadMerged} size="lg" className="bg-success hover:bg-success/90">
              <Download className="w-4 h-4 mr-2" />
              다운로드
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};