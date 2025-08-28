import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Maeng PDF - PDF 변환 및 편집 도구",
  description: "다양한 파일 형식을 PDF로 변환하고, PDF를 다른 형식으로 변환하며, PDF 병합 및 분할 기능을 제공하는 웹 애플리케이션입니다.",
  keywords: ["PDF", "변환", "병합", "분할", "Word", "Excel", "PowerPoint", "이미지"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}