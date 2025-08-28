import { PDFConverter } from "@/components/PDFConverter";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* 테마 토글 버튼 */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            PDF 변환기
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Word, Excel, PowerPoint, 이미지를 PDF로 변환하거나, PDF를 다른
            형식으로 변환하고 병합·분할까지 한 번에 해결하세요
          </p>
        </div>

        <PDFConverter />
      </main>
    </div>
  );
}
