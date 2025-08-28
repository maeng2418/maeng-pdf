# Maeng PDF - PDF 변환 및 편집 도구

다양한 파일 형식을 PDF로 변환하고, PDF를 다른 형식으로 변환하며, PDF 병합 및 분할 기능을 제공하는 웹 애플리케이션입니다.

## 주요 기능

### 📄 파일을 PDF로 변환
- **Word 문서** (.doc, .docx) → PDF
- **Excel 스프레드시트** (.xls, .xlsx) → PDF  
- **PowerPoint 프레젠테이션** (.ppt, .pptx) → PDF
- **이미지 파일** (.jpg, .jpeg, .png, .bmp, .tiff) → PDF

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

- **프론트엔드**: React 18, TypeScript
- **빌드 도구**: Vite
- **UI 라이브러리**: shadcn/ui, Tailwind CSS
- **상태 관리**: React Hooks
- **파일 업로드**: react-dropzone
- **아이콘**: Lucide React

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
pnpm preview
```

### 개발 환경 설정
개발 서버는 기본적으로 `http://localhost:8080`에서 실행됩니다.

## 사용법

1. **파일 업로드**: 변환하고자 하는 파일을 드래그 앤 드롭하거나 클릭하여 선택
2. **변환 옵션 선택**: 원하는 출력 형식 및 품질 설정
3. **변환 실행**: '변환 시작' 버튼을 클릭하여 변환 진행
4. **파일 다운로드**: 변환 완료 후 결과 파일 다운로드

## 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── ui/             # shadcn/ui 기본 컴포넌트
│   ├── FileUpload.tsx  # 파일 업로드 컴포넌트
│   ├── PDFConverter.tsx # 메인 변환기 컴포넌트
│   ├── PDFMerger.tsx   # PDF 병합 컴포넌트
│   └── PDFSplitter.tsx # PDF 분할 컴포넌트
├── hooks/              # 커스텀 React 훅
├── lib/                # 유틸리티 함수
└── pages/              # 페이지 컴포넌트
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
