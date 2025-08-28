import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, File, X, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  acceptedTypes: string;
  conversionType: "to-pdf" | "from-pdf";
}

interface UploadedFile {
  file: File;
  id: string;
  progress: number;
  status: "uploading" | "success" | "error";
}

export const FileUpload = ({ acceptedTypes, conversionType }: FileUploadProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        progress: 0,
        status: "uploading" as const,
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      // 시뮬레이션된 업로드 진행률
      newFiles.forEach((uploadFile) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 20;
          if (progress >= 100) {
            progress = 100;
            setFiles((prev) =>
              prev.map((f) =>
                f.id === uploadFile.id
                  ? { ...f, progress: 100, status: "success" }
                  : f
              )
            );
            clearInterval(interval);
          } else {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === uploadFile.id ? { ...f, progress } : f
              )
            );
          }
        }, 200);
      });
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.split(",").reduce((acc, type) => {
      acc[type.trim()] = [];
      return acc;
    }, {} as Record<string, string[]>),
    multiple: true,
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      toast({
        title: "파일을 선택해주세요",
        description: "변환할 파일을 먼저 업로드해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);
    
    // 변환 시뮬레이션
    setTimeout(() => {
      setIsConverting(false);
      toast({
        title: "변환 완료!",
        description: "파일이 성공적으로 변환되었습니다.",
      });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card border-2 border-dashed border-upload-border bg-upload-zone">
        <div
          {...getRootProps()}
          className={cn(
            "p-12 text-center cursor-pointer transition-all duration-300 rounded-lg",
            isDragActive && "border-primary bg-primary/5 scale-105"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <Upload className={cn(
              "w-16 h-16 transition-colors duration-300",
              isDragActive ? "text-primary" : "text-muted-foreground"
            )} />
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {isDragActive
                  ? "파일을 여기에 놓으세요"
                  : "파일을 드래그하거나 클릭하여 업로드"}
              </h3>
              <p className="text-muted-foreground">
                지원 형식: {acceptedTypes.replace(/\./g, "").toUpperCase()}
              </p>
            </div>
            <Button variant="outline" size="lg">
              파일 선택
            </Button>
          </div>
        </div>
      </Card>

      {files.length > 0 && (
        <Card className="p-6 shadow-soft">
          <h3 className="text-lg font-semibold mb-4">업로드된 파일</h3>
          <div className="space-y-3">
            {files.map((uploadFile) => (
              <div
                key={uploadFile.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <File className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {uploadFile.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {uploadFile.status === "uploading" && (
                    <div className="w-24">
                      <Progress value={uploadFile.progress} className="h-2" />
                    </div>
                  )}
                  {uploadFile.status === "success" && (
                    <CheckCircle className="w-5 h-5 text-success" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadFile.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button 
              onClick={handleConvert}
              disabled={isConverting || files.some(f => f.status === "uploading")}
              size="lg"
              className="min-w-32"
            >
              {isConverting ? "변환 중..." : "변환 시작"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};