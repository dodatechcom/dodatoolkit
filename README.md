# Doda Toolkit

**80 utilities in one desktop app.** A cross-platform toolkit for developers, designers, and everyday power users — every tool is self-contained, runs entirely in your browser, and respects your privacy.

Built with Electron + React + TypeScript + Tailwind CSS.

## Features

### Code & Data (22 tools)
`🛠️` QR Code Generator · JSON Formatter · UUID Generator · Base64 Encoder/Decoder · Hash Generator · Number Base Converter · Regex Tester · Fake Data Generator · YAML ↔ JSON Converter · SVG Viewer · JSON → TypeScript · CSV ↔ JSON · HTTP Status Codes · SQL Formatter · Calculator · Text to Slug · Text Cleaner · CSS Unit Converter · Unicode Inspector · Roman Numeral Converter · Cron Explainer · HTML/CSS/JS Playground

### Text Tools (8 tools)
`🔤` Case Converter · Character Counter · Lorem Ipsum Generator · Text Diff · Markdown Editor · Text to Speech · Morse Code Converter · Ebook Chapter Splitter

### Converters (5 tools)
`↔️` Temperature Converter · Data Size Converter · Currency Converter · Time Calculator · EMI / Loan Calculator

### Security (7 tools)
`🔒` Password Generator · JWT Decoder · Hash File Checker · QR Code Scanner · Password Strength Checker · Text Encrypt/Decrypt · RSA Key Generator · TOTP Generator · Metadata Cleaner

### Network (3 tools)
`🌐` URL Encoder/Decoder · IP Info · Link Preview

### Design (11 tools)
`🎨` Color Picker · Image to Text (OCR) · Color Palette from Image · Color Contrast Checker · CSS Gradient Generator · Box Shadow Generator · Image Compressor · Tailwind Color Reference · Image to Base64 · Placeholder Images · Color Converter · Image Format Converter

### Everyday Tools (23 tools)
`📌` Age Calculator · Date Calculator · Random Number Generator · List Randomizer · Percentage Calculator · Number to Words · Text Repeater · Emoji Picker · World Clock · Notes Pad · Typing Speed Test · Pomodoro Timer · Monthly Calendar · File Info · ASCII Art Generator · Decision Maker · Stopwatch · To-Do List · Dice Roller · Biorhythm · Random Quote Generator · Countdown Timer · Tip Calculator · Zodiac Compatibility · Periodic Table · Sorting Visualizer · Card Shuffler · Clipboard Manager

### System (1 tool)
`⚙️` Settings — theme (light/dark/system), clipboard auto-track, toolbar hints

## UI Features

- **Glassmorphism design** with gradient accents, smooth animations
- **Dark / Light / System theme** — persisted to localStorage
- **Search palette** (`⌘K` / `Ctrl+K`) with keyboard navigation and group badges
- **Sidebar** with collapsible groups, favorites, recents, auto-expand, collapse/expand all
- **Welcome screen** with quick-access grid and recently used tools
- **Keyboard shortcut reference** (press `?`)
- **Responsive grid** layout, frameless window on desktop
- **All data processed locally** — nothing sent to any server

## Getting Started

```bash
npm install
npm run dev          # Browser at localhost:5173
npm run electron:dev # Full desktop app (requires Electron)
npm run build        # Production build
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Desktop shell | Electron (frameless, titleBarStyle: hidden) |
| UI framework | React 18 + TypeScript |
| Bundler | Vite |
| Styling | Tailwind CSS (glassmorphism, dark mode) |
| Animations | Framer Motion |
| Icons | Native emoji (zero bundle size) |
| Code splitting | React.lazy — each utility is its own chunk |

## Architecture

```
src/
  registry/utilities.ts   — single source of truth (groups + utilities)
  components/
    layout/               — Shell, Sidebar, Header, Welcome screen
    ui/                   — shadcn-style primitives (Card, Button, Input, etc.)
    utilities/<name>/     — each utility self-contained (Component.tsx + index.ts)
  hooks/                  — useTheme, useLocalStorage
  types/                  — TypeScript definitions
electron/
  main.ts                 — Electron main process (IPC, frameless window)
  preload.ts              — contextBridge (minimize, maximize, close, openExternal)
```

Adding a new utility: create a folder in `src/components/utilities/<name>/` with `Component.tsx` + `index.ts`, then add one entry to `src/registry/utilities.ts`.

## Privacy

All processing happens client-side. No data is sent to any server. LocalStorage is used only for preferences (theme, recents, favorites, notes).

## License

Built with ❤️ by [DodaTech.com](https://dodatech.com)
