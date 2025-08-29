"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Settings, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ConversionOptions as ConversionOptionsType } from "@/types/conversion";

interface ConversionOptionsProps {
  type: "to-pdf" | "from-pdf";
  options: ConversionOptionsType;
  onOptionsChange: (options: ConversionOptionsType) => void;
}

export const ConversionOptions = ({ type, options, onOptionsChange }: ConversionOptionsProps) => {
  const updateOptions = (newOptions: Partial<ConversionOptionsType>) => {
    onOptionsChange({ ...options, ...newOptions });
  };

  if (type === "to-pdf") {
    return (
      <Card className="p-6 shadow-soft">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">변환 옵션</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="quality">PDF 품질</Label>
            <div className="px-3">
              <Slider
                id="quality"
                min={1}
                max={100}
                step={1}
                value={options.quality}
                onValueChange={(value) => updateOptions({ quality: value })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>낮음</span>
                <span>{options.quality[0]}%</span>
                <span>높음</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="page-size">페이지 크기</Label>
            <Select value={options.pageSize} onValueChange={(value) => updateOptions({ pageSize: value as any })}>
              <SelectTrigger>
                <SelectValue placeholder="페이지 크기 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a4">A4</SelectItem>
                <SelectItem value="a3">A3</SelectItem>
                <SelectItem value="letter">Letter</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="orientation">페이지 방향</Label>
            <Select value={options.orientation} onValueChange={(value) => updateOptions({ orientation: value as any })}>
              <SelectTrigger>
                <SelectValue placeholder="방향 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="portrait">세로</SelectItem>
                <SelectItem value="landscape">가로</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password-protect">비밀번호 보호</Label>
              <Switch
                id="password-protect"
                checked={options.password}
                onCheckedChange={(checked) => updateOptions({ password: checked })}
              />
            </div>
            {options.password && (
              <div className="space-y-2">
                <Label htmlFor="password-input" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  비밀번호
                </Label>
                <Input
                  id="password-input"
                  type="password"
                  placeholder="PDF 보호 비밀번호를 입력하세요"
                  value={options.passwordValue}
                  onChange={(e) => updateOptions({ passwordValue: e.target.value })}
                />
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-soft">
      <div className="flex items-center space-x-2 mb-4">
        <Settings className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">변환 옵션</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="output-format">출력 형식</Label>
          <Select value={options.outputFormat} onValueChange={(value) => updateOptions({ outputFormat: value })}>
            <SelectTrigger>
              <SelectValue placeholder="출력 형식 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="docx">Word (.docx)</SelectItem>
              <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
              <SelectItem value="pptx">PowerPoint (.pptx)</SelectItem>
              <SelectItem value="jpg">JPG 이미지</SelectItem>
              <SelectItem value="png">PNG 이미지</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {(options.outputFormat === "jpg" || options.outputFormat === "png") && (
          <div className="space-y-2">
            <Label htmlFor="image-quality">이미지 품질</Label>
            <div className="px-3">
              <Slider
                id="image-quality"
                min={1}
                max={100}
                step={1}
                value={options.quality}
                onValueChange={(value) => updateOptions({ quality: value })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>낮음</span>
                <span>{options.quality[0]}%</span>
                <span>높음</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="page-range">페이지 범위</Label>
          <Select value={options.pageRange} onValueChange={(value) => updateOptions({ pageRange: value })}>
            <SelectTrigger>
              <SelectValue placeholder="페이지 범위 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 페이지</SelectItem>
              <SelectItem value="first">첫 페이지만</SelectItem>
              <SelectItem value="custom">사용자 지정</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="maintain-layout">레이아웃 유지</Label>
          <Switch 
            id="maintain-layout" 
            checked={options.maintainLayout}
            onCheckedChange={(checked) => updateOptions({ maintainLayout: checked })}
          />
        </div>
      </div>
    </Card>
  );
};