# Maeng PDF - PDF 변환 및 편집 도구

다양한 파일 형식을 PDF로 변환하고, PDF를 다른 형식으로 변환하며, PDF 병합 및 분할 기능을 제공하는 웹 애플리케이션입니다.

## 주요 기능

### 📄 파일을 PDF로 변환
- **Word 문서** (.doc, .docx) → PDF
- **Excel 스프레드시트** (.xls, .xlsx) → PDF  
- **PowerPoint 프레젠테이션** (.ppt, .pptx) → PDF
- **이미지 파일** (.jpg, .jpeg, .png, .bmp, .tiff) → PDF
- **🔒 비밀번호 보호**: 생성되는 PDF에 암호화 적용 가능

### 🔄 PDF를 다른 형식으로 변환
- PDF → Word 문서
- PDF → Excel 스프레드시트
- PDF → PowerPoint 프레젠테이션
- PDF → 이미지 파일

### 🔗 PDF 병합
- 여러 PDF 파일을 하나로 합치기
- 드래그 앤 드롭으로 파일 순서 변경
- 미리보기 기능 제공

### ✂️ PDF 분할
- 하나의 PDF를 여러 파일로 나누기
- 페이지별 분할
- 특정 페이지 범위로 분할

## 기술 스택

- **프론트엔드**: React 18, TypeScript, Next.js 15
- **UI 라이브러리**: shadcn/ui, Tailwind CSS
- **상태 관리**: React Hooks
- **파일 업로드**: react-dropzone
- **PDF 처리**: pdf-lib-with-encrypt, jsPDF, pdfjs-dist
- **문서 변환**: mammoth (Word), xlsx (Excel)
- **아이콘**: Lucide React
- **테마**: next-themes (라이트/다크 모드)

## 설치 및 실행

### 요구사항
- Node.js 18.0.0 이상
- pnpm (권장) 또는 npm

### 설치 방법

```bash
# 저장소 클론
git clone <repository-url>
cd maeng-pdf

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start
```

### 개발 환경 설정
개발 서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## 사용법

1. **파일 업로드**: 변환하고자 하는 파일을 드래그 앤 드롭하거나 클릭하여 선택
2. **변환 옵션 선택**: 
   - PDF 품질, 페이지 크기, 방향 설정
   - 🔒 **비밀번호 보호**: 스위치를 활성화하고 비밀번호 입력
3. **변환 실행**: '변환 시작' 버튼을 클릭하여 변환 진행
4. **파일 다운로드**: 변환 완료 후 결과 파일 다운로드 (암호화된 경우 비밀번호 필요)

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── api/               # API 라우트 (PDF 처리)
│   ├── layout.tsx         # 루트 레이아웃 (테마 제공자 포함)
│   ├── page.tsx           # 홈페이지
│   └── globals.css        # 전역 스타일
├── components/            # React 컴포넌트
│   ├── ui/               # shadcn/ui 기본 컴포넌트
│   ├── PDFConverter.tsx  # 메인 탭 인터페이스 컴포넌트
│   ├── FileUpload.tsx    # 드래그 앤 드롭 파일 업로드
│   ├── ConversionOptions.tsx # 변환 설정 (비밀번호 보호 포함)
│   ├── PDFMerger.tsx     # PDF 병합 기능
│   ├── PDFSplitter.tsx   # PDF 분할 기능
│   ├── theme-provider.tsx # 다크/라이트 테마 컨텍스트
│   └── theme-toggle.tsx  # 테마 전환 버튼
├── lib/                  # 유틸리티 라이브러리
│   ├── pdf-converter.ts  # 핵심 PDF 변환 로직 (암호화 포함)
│   ├── pdf-merger.ts     # PDF 병합 유틸리티
│   ├── pdf-splitter.ts   # PDF 분할 유틸리티
│   └── utils.ts          # Tailwind 클래스 유틸리티
├── hooks/                # 커스텀 React 훅
│   ├── use-mobile.tsx    # 모바일 감지 훅
│   └── use-toast.ts      # 토스트 알림 훅
└── types/                # TypeScript 타입 정의
    └── conversion.ts     # 변환 옵션 타입
```

## 기여하기

1. 이 저장소를 포크합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 문의 및 지원

문제가 발생하거나 기능 요청이 있으시면 [Issues](../../issues)를 통해 알려주세요.
