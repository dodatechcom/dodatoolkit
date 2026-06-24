# Doda Toolkit

**80 utilities in one desktop app.** A cross-platform toolkit for developers, designers, and everyday power users — every tool is self-contained, runs entirely in your browser, and respects your privacy.

Built with Electron + React + TypeScript + Tailwind CSS.

## Features

### 🛠️ Code & Data (22)

- **QR Code Generator** — Generate QR codes from text or URLs
- **JSON Formatter** — Pretty-print, validate, and minify JSON
- **UUID Generator** — Generate UUIDs (v4, v7) in bulk
- **Base64 Encoder / Decoder** — Encode and decode Base64 strings
- **Hash Generator** — Generate MD5, SHA-1, SHA-256 hashes
- **Number Base Converter** — Convert between decimal, hex, binary, octal
- **Regex Tester** — Test regular expressions with live matching and explanation
- **Fake Data Generator** — Generate fake names, emails, phones, addresses for testing
- **YAML ↔ JSON Converter** — Convert between YAML and JSON formats
- **SVG Viewer** — View and download SVG code with live preview
- **JSON → TypeScript** — Convert JSON to TypeScript interfaces
- **CSV ↔ JSON** — Convert CSV to JSON and back
- **HTTP Status Codes** — Searchable reference of HTTP status codes
- **SQL Formatter** — Format and minify SQL queries
- **Calculator** — Basic calculator with history log
- **Text to Slug** — Convert text to URL-friendly slugs
- **Text Cleaner** — Strip HTML, collapse spaces, trim, remove non-ASCII
- **CSS Unit Converter** — Convert px to rem, em, %, pt, cm, mm, in, pc, ch
- **Unicode Inspector** — Inspect Unicode code points and UTF-8 bytes
- **Cron Explainer** — Translate cron expressions into English
- **Roman Numeral Converter** — Convert numbers to and from Roman numerals
- **HTML/CSS/JS Playground** — Live preview editor for HTML, CSS, and JavaScript

### 🔤 Text Tools (8)

- **Ebook Chapter Splitter** — Split ebook text into individual chapters
- **Case Converter** — Convert between text cases (camelCase, snake_case, etc.)
- **Character Counter** — Count characters, words, lines, sentences
- **Lorem Ipsum Generator** — Generate placeholder text
- **Text Diff** — Compare two texts and highlight differences
- **Markdown Editor** — Write markdown with live HTML preview
- **Text to Speech** — Read text aloud with voice selection
- **Morse Code Converter** — Convert text to and from Morse code with audio

### ↔️ Converters (5)

- **Currency Converter** — Live rates between 10 major currencies (no API key needed)
- **Time Calculator** — Duration between times, add/subtract hours and minutes
- **EMI / Loan Calculator** — Calculate monthly EMI, total interest, and payment
- **Temperature Converter** — Convert between Celsius, Fahrenheit, and Kelvin
- **Data Size Converter** — Convert between B, KB, MB, GB, TB, PB

### 🔒 Security (7)

- **Metadata Cleaner** — Strip EXIF and hidden metadata from images
- **JWT Decoder** — Decode JWT tokens and inspect header, payload, signature
- **Hash File Checker** — Compute MD5, SHA-1, SHA-256 checksums of files
- **QR Code Scanner** — Decode QR codes from images
- **Password Strength Checker** — Check password strength with time-to-crack estimate
- **Text Encrypt / Decrypt** — Encrypt and decrypt text with AES-GCM + passphrase
- **RSA Key Generator** — Generate RSA-2048 public/private key pairs

### 🌐 Network (3)

- **IP & Browser Info** — See your IP, location, browser, OS, screen info
- **IP Info** — Look up your public and local IP addresses
- **Link Preview** — Fetch title, description, and image from any URL

### 🎨 Design (11)

- **Image to Text (OCR)** — Extract text from images using OCR
- **Color Palette from Image** — Upload an image to extract its dominant colors
- **Color Contrast Checker** — Check WCAG contrast ratios between two colors
- **CSS Gradient Generator** — Generate linear and radial gradients visually
- **Box Shadow Generator** — Create and preview CSS box shadows
- **Image Compressor** — Compress images and download the result
- **Tailwind Color Reference** — Browse every Tailwind CSS color with hex values
- **Image to Base64** — Convert images to Base64 data URIs
- **Placeholder Images** — Generate SVG placeholder images at any size
- **Color Converter** — Convert between HEX, RGB, HSL, CMYK
- **Image Format Converter** — Convert images between PNG, JPEG, WebP, BMP

### 📌 Everyday Tools (23)

- **Clipboard Manager** — Track, search, and re-use clipboard history
- **Age Calculator** — Calculate exact age with zodiac sign and birthstone
- **Date Calculator** — Calculate days between dates, add or subtract days
- **Random Number Generator** — Generate random numbers within a range
- **List Randomizer** — Shuffle lists and pick random items
- **Percentage Calculator** — Calculate percentages, find what % of X is Y
- **Number to Words** — Convert numbers to English words and currency format
- **Text Repeater** — Repeat text multiple times with custom separator
- **Emoji Picker** — Browse and copy emojis by category
- **World Clock** — View current time across multiple time zones (analog + digital)
- **Notes Pad** — Quick notes with auto-save to localStorage
- **Typing Speed Test** — Measure your typing speed and accuracy
- **Pomodoro Timer** — 25/5 focus timer with cycle tracking
- **Monthly Calendar** — View any month and jump to today
- **File Info** — Drop a file to see name, size, type, dimensions
- **ASCII Art Generator** — Turn text into ASCII art
- **Decision Maker** — Spin through options and pick one randomly
- **Stopwatch** — Lap timer with millisecond precision
- **To-Do List** — Simple task list with localStorage persistence
- **Dice Roller** — Roll d4, d6, d8, d10, d12, d20 with animation
- **Biorhythm** — Physical, emotional, intellectual cycles with chart
- **Random Quote Generator** — Get inspired with 99 random quotes
- **Countdown Timer** — Set target date and see live countdown

### ⚙️ System (1)

- **Settings** — Theme (light/dark/system), clipboard auto-track, toolbar hints

## UI Features

- **Glassmorphism design** with gradient accents, smooth animations
- **Dark / Light / System theme** — persisted to localStorage
- **Search palette** (`⌘K` / `Ctrl+K`) with keyboard navigation and group badges
- **Sidebar** with collapsible groups, favorites, recents, auto-expand, collapse/expand all
- **Welcome screen** with quick-access grid and recently used tools
- **Keyboard shortcut reference** (press `?`)
- **Frameless window** with native title bar on desktop (hidden in browser mode)
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
| Desktop shell | Electron (frameless) |
| UI framework | React 18 + TypeScript |
| Bundler | Vite |
| Styling | Tailwind CSS + glassmorphism |
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
