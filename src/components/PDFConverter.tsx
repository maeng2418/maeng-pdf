"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ConversionOptions as ConversionOptionsType,
  defaultConversionOptions,
} from "@/types/conversion";
import { ArrowRightLeft, FileText, Merge, Split } from "lucide-react";
import { useState } from "react";
import { ConversionOptions } from "./ConversionOptions";
import { FileUpload } from "./FileUpload";
import { PDFMerger } from "./PDFMerger";
import { PDFSplitter } from "./PDFSplitter";

export const PDFConverter = () => {
  const [activeTab, setActiveTab] = useState("convert");
  const [toPdfOptions, setToPdfOptions] = useState<ConversionOptionsType>(
    defaultConversionOptions
  );
  const [fromPdfOptions, setFromPdfOptions] = useState<ConversionOptionsType>(
    defaultConversionOptions
  );

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-card shadow-soft rounded-xl">
          <TabsTrigger
            value="convert"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <ArrowRightLeft className="w-4 h-4" />
            파일 변환
          </TabsTrigger>
          <TabsTrigger
            value="to-other"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <FileText className="w-4 h-4" />
            PDF 변환
          </TabsTrigger>
          <TabsTrigger
            value="merge"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Merge className="w-4 h-4" />
            PDF 병합
          </TabsTrigger>
          <TabsTrigger
            value="split"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Split className="w-4 h-4" />
            PDF 분할
          </TabsTrigger>
        </TabsList>

        <TabsContent value="convert" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2">파일을 PDF로 변환</h2>
            <p className="text-muted-foreground">
              Word, Excel, PowerPoint, 이미지 파일을 PDF로 변환하세요
            </p>
          </div>
          <FileUpload
            acceptedTypes=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.bmp,.tiff"
            conversionType="to-pdf"
            conversionOptions={toPdfOptions}
          />
          <ConversionOptions
            type="to-pdf"
            options={toPdfOptions}
            onOptionsChange={setToPdfOptions}
          />
        </TabsContent>

        <TabsContent value="to-other" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2">
              PDF를 다른 형식으로 변환
            </h2>
            <p className="text-muted-foreground">
              PDF 파일을 Word, Excel, PowerPoint, 이미지로 변환하세요
            </p>
          </div>
          <FileUpload
            acceptedTypes=".pdf"
            conversionType="from-pdf"
            conversionOptions={fromPdfOptions}
          />
          <ConversionOptions
            type="from-pdf"
            options={fromPdfOptions}
            onOptionsChange={setFromPdfOptions}
          />
        </TabsContent>

        <TabsContent value="merge" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2">PDF 파일 병합</h2>
            <p className="text-muted-foreground">
              여러 PDF 파일을 하나로 합치세요
            </p>
          </div>
          <PDFMerger />
        </TabsContent>

        <TabsContent value="split" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2">PDF 파일 분할</h2>
            <p className="text-muted-foreground">
              하나의 PDF를 여러 파일로 나누세요
            </p>
          </div>
          <PDFSplitter />
        </TabsContent>
      </Tabs>
    </div>
  );
};
