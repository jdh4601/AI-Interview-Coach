# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server at http://localhost:5173
npm run build      # Type-check + production build (tsc -b && vite build)
npm run lint       # ESLint
npm run preview    # Preview production build
```

No test runner is configured yet.

## Environment

Requires `VITE_OPENAI_API_KEY` in `.env`. All OpenAI calls go directly from the browser (no backend).

## Architecture

### Flow

```
Landing → CompanySelect → ResumeUpload → SessionConfig → Interview → Complete → Report
   /              /setup/company         /setup/resume    /setup/config    /interview   /interview/complete  /report
```

### State Management (3 Zustand stores)

| Store | File | Owns |
|-------|------|------|
| `useSessionStore` | `src/stores/useSessionStore.ts` | companyId, jobId, resumeText, questionCount, interviewStyle, voiceGender, **status** |
| `useInterviewStore` | `src/stores/useInterviewStore.ts` | questions[], ttsBlobs (Map), answers (Map), currentIndex |
| `useReportStore` | `src/stores/useReportStore.ts` | report |

Route guards in `src/router.tsx` check store state: `/interview` requires `status === 'in_progress'`, `/report` requires a non-null report.

### API Facade Pattern

`src/services/api.ts` is the **only** file that imports from `services/openai/`. When a backend is added, only this file changes — all pages and hooks call `api.*`.

```
Page/Hook → api.ts (facade) → services/openai/{questionGenerator, ttsService, sttService, reportGenerator}
```

OpenAI client is initialized in `src/services/openai/client.ts` using `env.openaiApiKey`.

### TTS Pre-generation

On interview start (`InterviewPage`), all question TTS audio is generated in parallel via `Promise.all` before the first question plays — eliminating mid-interview latency.

Voice selection matrix (`ttsService.ts`):
- male + friendly → `onyx`, male + pressure → `echo`
- female + friendly → `nova`, female + pressure → `alloy`

### Korean WPM Calculation

`src/lib/wpmCalculator.ts`: counts Hangul syllable blocks (U+AC00–U+D7A3), divides by 2.5 to approximate word count.
- fast: >180 WPM | normal: 120–180 | slow: <120

### Company Data

`src/data/companies.ts` is hardcoded. Add new companies by extending the `companies` array following the `Company` type (`src/types/company.ts`). Jobs with `active: false` are hidden from selection.

### Styling

Tailwind CSS v4 via `@tailwindcss/vite` plugin. Dark theme (`bg-[#0D0D12]` / Obsidian) throughout. No `tailwind.config.js` — configuration is inline via the Vite plugin.

### Animation & UI
- **GSAP 3**: Core animation engine. Always use `gsap.context()` inside `useEffect` and return `ctx.revert()` in the cleanup function.
- **Aesthetic Foundation ("Clinical Precision")**: 
  - Global CSS noise overlay via SVG `<feTurbulence>` (opacity 0.05).
  - Heavy use of `rounded-[2rem]` to `rounded-[3rem]` and glassmorphism (`backdrop-blur-xl`, `bg-white/5`).
- **Micro-interactions**: Magnetic buttons with slight scaling (`scale(1.03)`) on hover, using `cubic-bezier(0.25, 0.46, 0.45, 0.94)`.

### Media & Audio Processing
- **Recording**: Browser `MediaRecorder` API captures user voice.
- **STT Pipeline**: Recorded audio is converted to text using OpenAI Whisper API.
- **Visualizer**: Real-time microphone input visualization using Canvas/SVG during the interview.

### Core Interview Mechanics
- **Timer**: Fixed 120 seconds. Color logic: Electric Blue (`#3B82F6`) for 0-90s → Signal Red (`#EF4444`) for 90-120s with a heartbeat pulse.
- **Structure Guide**: Time-based active states: 도입 (0-30s) → 핵심 경험 (30-90s) → 결과/배운 점 (90-120s).
