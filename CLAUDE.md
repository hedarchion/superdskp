# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DSKP Explorer is a React-based SPA for browsing the Malaysian secondary school English language curriculum (KSSM - Kurikulum Standard Sekolah Menengah). It provides an interactive interface to explore curriculum standards, skills, syllabus content, and performance metrics.

## Tech Stack

- **Framework**: React 19.2 + TypeScript 5.9
- **Build Tool**: Vite 7.2
- **Styling**: Tailwind CSS 4.1 (CSS-based config, no tailwind.config.js)
- **Icons**: lucide-react
- **Path Aliases**: `@/` maps to `./src/`

## Commands

```bash
# Development
npm run dev          # Start Vite dev server

# Build
npm run build        # TypeScript compile + Vite build
npm run preview      # Preview production build locally

# Lint
npm run lint         # ESLint check
```

## Architecture

### Data Flow
- Static curriculum data is loaded from `/curriculum.json` at runtime via `fetch()`
- The `useCurriculum()` hook in `src/hooks/useCurriculum.ts` manages data fetching and exposes transformation utilities
- View components receive data through props and do not fetch directly

### View Routing
- Simple client-side view switching in `App.tsx` using React state (no React Router)
- Five views: `overview`, `forms`, `skills`, `syllabus`, `performance`
- `Navigation.tsx` handles view switching via the `onViewChange` callback

### Type System
- Curriculum types defined in `src/types/curriculum.ts`
- Key types: `CurriculumData`, `FormData`, `ContentStandard`, `SkillType`, `SyllabusContent`
- Strict TypeScript mode is enabled

### Styling Conventions
- Tailwind CSS v4 uses CSS-based configuration in `src/index.css` via `@theme`
- Custom color palette with lime accent (`#c8ff3d`)
- Custom pastel color classes: `bg-pastel-lime`, `bg-pastel-blue`, etc.
- Grid background pattern via `.grid-bg` class
- Component classes: `.bento-card`, `.pill-btn`, `.card-hover`

### Project Structure
```
src/
├── main.tsx              # Entry point
├── App.tsx               # Root component with view routing
├── types/curriculum.ts   # TypeScript interfaces
├── hooks/useCurriculum.ts # Data fetching & transformation hooks
├── lib/utils.ts          # Utility functions (cn, clipboard)
├── components/           # View components and UI
│   ├── Navigation.tsx
│   ├── OverviewView.tsx
│   ├── FormsView.tsx
│   ├── SkillsView.tsx
│   ├── SyllabusView.tsx
│   ├── PerformanceView.tsx
│   └── ui/               # shadcn/ui components
└── index.css             # Tailwind imports + custom styles
```

## ESLint Configuration

Uses flat config (`eslint.config.js`) with:
- `@eslint/js` recommended rules
- `typescript-eslint` recommended rules
- `eslint-plugin-react-hooks` (flat config)
- `eslint-plugin-react-refresh` (Vite config)
- Ignores `dist/` directory

## Notes

- No testing framework is currently configured
- shadcn/ui is configured but minimally used
- The app uses React 19 with strict TypeScript checking
