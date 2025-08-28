import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, File, Download, Scissors } from "lucide-react";

interface SplitResult {
  fileName: string;
  pages: string;
  size: string;
}

export const PDFSplitter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [splitMode, setSplitMode] = useState("");
  const [pageRanges, setPageRanges] = useState("");
  const [pagesPerFile, setPagesPerFile] = useState(1);
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitProgress, setSplitProgress] = useState(0);
  const [splitResults, setSplitResults] = useState<SplitResult[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setSplitResults([]);
    } else {
      toast({
        title: "잘못된 파일 형식",
        description: "PDF 파일만 업로드할 수 있습니다.",
        variant: "destructive",
      });
    }
  };

  const handleSplit = async () => {
    if (!selectedFile || !splitMode) {
      toast({
        title: "설정을 확인해주세요",
        description: "PDF 파일과 분할 방식을 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsSplitting(true);
    setSplitProgress(0);

    // 분할 시뮬레이션
    const interval = setInterval(() => {
      setSplitProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSplitting(false);
          
          // 분할 결과 시뮬레이션
          const results: SplitResult[] = [];
          if (splitMode === "pages") {
            const numFiles = Math.ceil(10 / pagesPerFile); // 가정: 10페이지 PDF
            for (let i = 0; i < numFiles; i++) {
              const startPage = i * pagesPerFile + 1;
              const endPage = Math.min((i + 1) * pagesPerFile, 10);
              results.push({
                fileName: `${selectedFile.name.replace('.pdf', '')}_part${i + 1}.pdf`,
                pages: `${startPage}-${endPage}`,
                size: `${(Math.random() * 500 + 100).toFixed(0)} KB`
              });
            }
          } else if (splitMode === "range") {
            const ranges = pageRanges.split(',').map(r => r.trim());
            ranges.forEach((range, index) => {
              results.push({
                fileName: `${selectedFile.name.replace('.pdf', '')}_range${index + 1}.pdf`,
                pages: range,
                size: `${(Math.random() * 500 + 100).toFixed(0)} KB`
              });
            });
          } else if (splitMode === "single") {
            for (let i = 1; i <= 10; i++) { // 가정: 10페이지
              results.push({
                fileName: `${selectedFile.name.replace('.pdf', '')}_page${i}.pdf`,
                pages: `${i}`,
                size: `${(Math.random() * 200 + 50).toFixed(0)} KB`
              });
            }
          }
          
          setSplitResults(results);
          toast({
            title: "분할 완료!",
            description: `PDF가 ${results.length}개 파일로 분할되었습니다.`,
          });
          return 100;
        }
        return prev + Math.random() * 12;
      });
    }, 300);
  };

  const downloadFile = (fileName: string) => {
    toast({
      title: "다운로드 시작",
      description: `${fileName}을 다운로드합니다.`,
    });
  };

  const downloadAll = () => {
    toast({
      title: "전체 다운로드",
      description: "모든 분할된 파일을 ZIP으로 다운로드합니다.",
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
            분할할 PDF 파일을 선택하세요
          </p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="pdf-split-upload"
          />
          <label htmlFor="pdf-split-upload">
            <Button variant="outline" size="lg" className="cursor-pointer">
              PDF 파일 선택
            </Button>
          </label>
        </div>
      </Card>

      {/* 선택된 파일 정보 */}
      {selectedFile && (
        <Card className="p-6 shadow-soft">
          <div className="flex items-center space-x-3 mb-6">
            <File className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-semibold">{selectedFile.name}</h3>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          {/* 분할 옵션 */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="split-mode">분할 방식</Label>
              <Select value={splitMode} onValueChange={setSplitMode}>
                <SelectTrigger>
                  <SelectValue placeholder="분할 방식 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">개별 페이지로 분할</SelectItem>
                  <SelectItem value="pages">페이지 수로 분할</SelectItem>
                  <SelectItem value="range">페이지 범위로 분할</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {splitMode === "pages" && (
              <div>
                <Label htmlFor="pages-per-file">파일당 페이지 수</Label>
                <Input
                  id="pages-per-file"
                  type="number"
                  min="1"
                  value={pagesPerFile}
                  onChange={(e) => setPagesPerFile(parseInt(e.target.value) || 1)}
                  placeholder="예: 2"
                />
              </div>
            )}

            {splitMode === "range" && (
              <div>
                <Label htmlFor="page-ranges">페이지 범위</Label>
                <Input
                  id="page-ranges"
                  value={pageRanges}
                  onChange={(e) => setPageRanges(e.target.value)}
                  placeholder="예: 1-3, 5-7, 9-10"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  쉼표로 구분하여 여러 범위를 입력하세요
                </p>
              </div>
            )}
          </div>

          {/* 분할 진행률 */}
          {isSplitting && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>분할 진행중...</span>
                <span>{Math.round(splitProgress)}%</span>
              </div>
              <Progress value={splitProgress} className="h-2" />
            </div>
          )}

          {/* 분할 버튼 */}
          <div className="mt-6 flex justify-center">
            <Button 
              onClick={handleSplit}
              disabled={isSplitting || !splitMode}
              size="lg"
              className="min-w-32"
            >
              <Scissors className="w-4 h-4 mr-2" />
              {isSplitting ? "분할 중..." : "PDF 분할"}
            </Button>
          </div>
        </Card>
      )}

      {/* 분할 결과 */}
      {splitResults.length > 0 && (
        <Card className="p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">분할 결과</h3>
            <Button onClick={downloadAll} variant="outline">
              전체 다운로드 (ZIP)
            </Button>
          </div>
          
          <div className="space-y-2">
            {splitResults.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <File className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{result.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      페이지 {result.pages} • {result.size}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => downloadFile(result.fileName)}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};