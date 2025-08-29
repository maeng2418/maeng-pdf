# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `pnpm dev` (runs on http://localhost:3000)
- **Build**: `pnpm build`
- **Production server**: `pnpm start`  
- **Linting**: `pnpm lint`
- **Type checking**: `pnpm type-check`

## Project Architecture

This is a Next.js 15 application built with TypeScript that provides PDF conversion, merging, and splitting functionality. The application uses the App Router structure.

### Core Architecture

- **Framework**: Next.js 15 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS with custom theme system supporting light/dark modes
- **UI Components**: shadcn/ui (Radix UI primitives with custom styling)
- **PDF Processing**: Multiple libraries for different operations:
  - `jspdf` - PDF creation from images and documents
  - `pdf-lib-with-encrypt` - Advanced PDF manipulation with encryption support for merging/splitting
  - `pdfjs-dist` - PDF rendering and text extraction
  - `mammoth` - Word document conversion
  - `xlsx` - Excel document processing

### File Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes for PDF processing  
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Home page with main converter
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui base components
│   ├── PDFConverter.tsx  # Main tabbed interface component
│   ├── FileUpload.tsx    # Drag-and-drop file upload
│   ├── PDFMerger.tsx     # PDF merging functionality
│   ├── PDFSplitter.tsx   # PDF splitting functionality
│   ├── ConversionOptions.tsx # Conversion settings with password protection
│   ├── theme-provider.tsx # Dark/light theme context
│   └── theme-toggle.tsx  # Theme switching button
├── lib/                  # Utility libraries
│   ├── pdf-converter.ts  # Core PDF conversion logic with encryption
│   ├── pdf-merger.ts     # PDF merging utilities
│   ├── pdf-splitter.ts   # PDF splitting utilities
│   └── utils.ts          # Tailwind class utilities
├── hooks/                # Custom React hooks
│   ├── use-mobile.tsx    # Mobile detection hook
│   └── use-toast.ts      # Toast notification hook
└── types/                # TypeScript type definitions
```

### Key Features

1. **File to PDF Conversion**: Supports Word (.doc, .docx), Excel (.xls, .xlsx), PowerPoint (.ppt, .pptx), and images
2. **PDF Password Protection**: Encrypt generated PDFs with user-specified passwords
3. **PDF to Other Formats**: Convert PDF back to Word, Excel, PowerPoint, or images
4. **PDF Merging**: Combine multiple PDFs with drag-and-drop reordering
5. **PDF Splitting**: Split PDFs by page ranges or individual pages
6. **Theme System**: Light/dark mode with persistent user preference

### TypeScript Configuration

The project uses TypeScript in strict mode with Next.js optimizations. Key settings:
- Strict mode enabled for better type safety
- Path aliases: `@/*` maps to `./src/*` directory
- Some strict checks disabled for compatibility (`noImplicitAny`, `strictNullChecks`)

### Styling System

- Custom Tailwind configuration with extensive color system
- CSS custom properties for theme variables
- shadcn/ui component system with consistent design tokens
- Responsive design with mobile-first approach

### Development Notes

- The app is primarily client-side rendered ("use client" components)
- File processing happens entirely in the browser using Web APIs
- No server-side storage - all operations are client-side
- Webpack configuration excludes Node.js modules for browser compatibility
- Korean language UI with comprehensive error handling
- PDF encryption is handled client-side using pdf-lib-with-encrypt
- Password protection includes configurable permissions (printing, copying, modifying)

### PDF Encryption Features

- **Password Protection**: Users can enable password protection in ConversionOptions
- **Secure Encryption**: Uses pdf-lib-with-encrypt for robust PDF security
- **Permission Control**: Encrypted PDFs have restricted permissions:
  - High-resolution printing allowed
  - Content modification disabled
  - Text/image copying disabled
  - Form filling disabled
  - Content accessibility enabled for screen readers
- **User Experience**: Password input field appears when encryption is enabled

### Component Patterns

- Functional components with TypeScript interfaces
- Custom hooks for reusable logic
- Consistent error handling with user-friendly messages
- File type detection based on extensions and MIME types
- Progress tracking for long-running operations