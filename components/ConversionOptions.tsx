"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";

interface ConversionOptionsProps {
  type: "to-pdf" | "from-pdf";
}

export const ConversionOptions = ({ type }: ConversionOptionsProps) => {
  const [quality, setQuality] = useState([80]);
  const [password, setPassword] = useState(false);
  const [outputFormat, setOutputFormat] = useState("");

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
                value={quality}
                onValueChange={setQuality}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>낮음</span>
                <span>{quality[0]}%</span>
                <span>높음</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="page-size">페이지 크기</Label>
            <Select>
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
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="방향 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="portrait">세로</SelectItem>
                <SelectItem value="landscape">가로</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="password-protect">비밀번호 보호</Label>
            <Switch
              id="password-protect"
              checked={password}
              onCheckedChange={setPassword}
            />
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
          <Select value={outputFormat} onValueChange={setOutputFormat}>
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
        
        {(outputFormat === "jpg" || outputFormat === "png") && (
          <div className="space-y-2">
            <Label htmlFor="image-quality">이미지 품질</Label>
            <div className="px-3">
              <Slider
                id="image-quality"
                min={1}
                max={100}
                step={1}
                value={quality}
                onValueChange={setQuality}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>낮음</span>
                <span>{quality[0]}%</span>
                <span>높음</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="page-range">페이지 범위</Label>
          <Select>
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
          <Switch id="maintain-layout" defaultChecked />
        </div>
      </div>
    </Card>
  );
};