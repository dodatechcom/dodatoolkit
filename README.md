# Doda Toolkit

**87 utilities in one desktop app.** A cross-platform toolkit for developers, designers, and power users — every tool is self-contained, runs entirely offline on your device, and respects your privacy.

Built with Electron + React + TypeScript + Tailwind CSS.

## Features

### 🛠️ Code & Data (30)

- **QR Code Generator** — Generate QR codes from text or URLs
- **JSON Formatter** — Pretty-print, validate, minify, and inspect JSON
- **UUID Generator** — Generate UUIDs (v4, v7) in bulk
- **Base64 Encoder / Decoder** — Encode and decode Base64 strings
- **Hash Generator** — Generate MD5, SHA-1, SHA-256, and SHA-512 hashes
- **Number Base Converter** — Convert between decimal, hex, binary, octal
- **Regex Tester** — Test regular expressions with live matching, capture groups, and flags
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
- **URL Encoder / Decoder** — Safe component and full URI encoding/decoding
- **URL Parser** — Parse URLs into protocol, host, port, path, and query params
- **HTML Entity Encoder / Decoder** — Escape and unescape HTML entities
- **MIME Types Lookup** — Search and inspect file extensions and MIME content types
- **GraphQL Formatter** — Format and prettify GraphQL queries and mutations
- **Gitmoji Reference** — Search and copy emojis for Git commit messages
- **ASCII Character Table** — Complete 7-bit ASCII reference with decimal, hex, and binary
- **Sorting Algorithm Visualizer** — Visualize Bubble, Quick, Merge, and Insertion sorting

### 🔤 Text Tools (7)

- **Case Converter** — Convert between text cases (camelCase, snake_case, etc.)
- **Character Counter** — Count characters, words, lines, sentences, and reading time
- **Lorem Ipsum Generator** — Generate placeholder text
- **Text Diff** — Compare two texts and highlight differences side-by-side
- **Markdown Editor** — Write markdown with live HTML preview
- **Text to Speech** — Read text aloud with voice selection and rate controls
- **Morse Code Converter** — Convert text to and from Morse code with audio

### ↔️ Converters (9)

- **Currency Converter** — Live rates between major currencies (works offline with fallback)
- **Time Calculator** — Duration between times, add/subtract hours and minutes
- **EMI / Loan Calculator** — Calculate monthly EMI, total interest, and amortization
- **Temperature Converter** — Convert between Celsius, Fahrenheit, and Kelvin
- **Data Size Converter** — Convert between B, KB, MB, GB, TB, PB
- **Timestamp Converter** — Convert Unix epoch timestamps to human dates and ISO
- **Unit Converter** — Convert length, weight, volume, area, temperature, and speed
- **Geo Coordinates Converter** — Convert between Decimal Degrees and DMS with map links
- **Tip & Split Calculator** — Calculate tips and split bills evenly

### 🔒 Security (9)

- **Metadata Cleaner** — Strip EXIF and hidden metadata from images
- **JWT Decoder** — Decode JWT tokens and inspect header, payload, signature
- **Hash File Checker** — Compute MD5, SHA-1, SHA-256 checksums of local files
- **QR Code Scanner** — Decode QR codes from images or webcam
- **Password Strength Checker** — Check password strength with time-to-crack estimate
- **Password Generator** — Generate high-entropy secure passwords with custom charsets
- **TOTP 2FA Authenticator** — Generate and verify 30-second rotating 2FA codes
- **Text Encrypt / Decrypt** — Encrypt and decrypt text with AES-GCM + passphrase
- **RSA Key Generator** — Generate RSA-2048 public/private key pairs client-side

### 🌐 Network (2)

- **Network & IP Inspector** — Public IP, ISP, geolocation, local WebRTC IP, and client environment specs
- **Link Preview** — Fetch title, description, and image from any URL

### 🎨 Design (12)

- **Image to Text (OCR)** — Extract text from images using OCR
- **Color Palette from Image** — Upload an image to extract its dominant colors
- **Color Contrast Checker** — Check WCAG contrast ratios between two colors
- **Color Picker & Palette** — Visual color picker, format converter, and shade generator
- **CSS Gradient Generator** — Generate linear and radial gradients visually
- **Box Shadow Generator** — Create and preview CSS box shadows
- **Image Compressor** — Compress images and download the result
- **Tailwind Color Reference** — Browse every Tailwind CSS color with hex values
- **Image to Base64** — Convert images to Base64 data URIs
- **Placeholder Images** — Generate SVG placeholder images at any size
- **Color Converter** — Convert between HEX, RGB, HSL, CMYK
- **Image Format Converter** — Convert images between PNG, JPEG, WebP, BMP

### 📌 Everyday Tools (17)

- **Clipboard Manager** — Track, search, and re-use clipboard history
- **Date & Age Calculator** — Calculate days between dates, add/subtract days, and age milestones
- **Random Number Generator** — Generate random numbers within a range
- **List Randomizer & Decision Maker** — Shuffle lists, pick random items, or spin decisions
- **Percentage Calculator** — Calculate percentages, find what % of X is Y
- **Number to Words** — Convert numbers to English words and currency format
- **Emoji Picker** — Browse and copy emojis by category
- **World Clock** — View current time across multiple time zones (analog + digital)
- **Notes Pad** — Quick notes with auto-save to localStorage
- **Typing Speed Test** — Measure your typing speed and accuracy
- **Pomodoro Timer** — 25/5 focus timer with cycle tracking
- **Monthly Calendar** — View any month and jump to today
- **File Info** — Drop a file to see name, size, type, dimensions
- **ASCII Art Generator** — Turn text into ASCII art
- **Stopwatch** — Lap timer with millisecond precision
- **To-Do List** — Simple task list with localStorage persistence
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

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ LTS recommended)
- **npm**: v9.0.0 or higher

### Installation & Development

```bash
# Install dependencies
npm install

# Start Vite dev server (browser preview at http://localhost:5173)
npm run dev

# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Launch full desktop app (Electron frameless window)
npm run electron:dev

# Build web distribution bundle
npm run build

# Package desktop installer for current platform (NSIS .exe on Windows, AppImage/deb on Linux, dmg on macOS)
npm run electron:build
```

### Windows Setup Notes
1. Install [Node.js 20+ LTS](https://nodejs.org/) and [Git for Windows](https://git-scm.com/).
2. In PowerShell or Command Prompt, run:
   ```powershell
   git config --global core.autocrlf false
   npm install
   npm run dev
   ```
3. To package the Windows desktop installer (`.exe`):
   ```powershell
   npm run electron:build
   ```
   The generated installer will be located in the `release/` directory.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Desktop shell | Electron 31 (frameless, custom titlebar IPC) |
| UI framework | React 18 + TypeScript |
| Bundler | Vite 5 + esbuild (for Electron main/preload) |
| Testing | Vitest + @testing-library/react + jsdom |
| Styling | Tailwind CSS + glassmorphism |
| Components | Radix UI primitives |
| Animations | Framer Motion |
| Icons | Native emoji (zero bundle size overhead) |
| Code splitting | React.lazy — each utility is loaded on-demand |

## Architecture

```
Doda-Toolkit/
├── electron/                 # Electron main (main.ts) & preload script (preload.cjs)
├── scripts/                  # build-electron.mjs (esbuild bundle for Electron)
├── src/
│   ├── components/
│   │   ├── layout/           # Shell.tsx, Sidebar.tsx, Header.tsx, WelcomeScreen
│   │   ├── ui/               # shadcn-style UI primitives (Card, Button, Input, Tabs, etc.)
│   │   └── utilities/<name>/ # Self-contained utility components (Component.tsx + index.ts)
│   ├── registry/
│   │   └── utilities.ts      # Single source of truth (categories, metadata, lazy imports)
│   ├── hooks/                # useTheme, useLocalStorage, useSearch
│   ├── lib/                  # Utilities (clsx/tailwind-merge, md5, etc.)
│   ├── test/                 # Vitest test setup and test-utils
│   └── types/                # Global and utility TypeScript interfaces
├── website.html              # Marketing / landing page for dodatech.com
└── release/                  # Built desktop installers (after npm run electron:build)
```

For more documentation, see:
- [RESUME_GUIDE.md](./RESUME_GUIDE.md) — Step-by-step handover and guide for setting up and resuming on Windows.
- [CONTRIBUTING.md](./CONTRIBUTING.md) — Guide for adding new utilities and contributing code.

## Privacy

All processing happens client-side. No data is sent to any server. LocalStorage is used only for user preferences (theme, recents, favorites, notes).

## License

Built with ❤️ by [DodaTech.com](https://dodatech.com)
