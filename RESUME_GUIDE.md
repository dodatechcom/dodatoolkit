# Doda Toolkit — Backup & Resume Guide (Windows Transition)

This document provides a complete handover and step-by-step guide for backing up this project, installing Windows, and resuming development without missing a beat.

---

## 1. Quick Backup Checklist (Before Reformatting)

### What to back up:
You can back up the entire `Doda-Toolkit` project directory. To make your backup **fast and small** (~a few megabytes instead of hundreds of megabytes), you do **not** need to copy the generated build directories or dependencies:

- **Exclude or delete before backing up (optional, saves ~600MB):**
  - `node_modules/` (can be reinstalled anytime with `npm install`)
  - `dist/` (rebuilt with `npm run build`)
  - `dist-electron/` (rebuilt with `npm run build:electron`)
  - `release/` (rebuilt with `npm run electron:build`)

### What MUST be backed up:
- Entire `src/` directory (includes all 87 utility components, registry, layout, styles)
- `electron/` directory (`main.ts`, `preload.ts`)
- `scripts/` directory (`build-electron.mjs`)
- `package.json` and `package-lock.json`
- `vite.config.ts`, `vitest.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`
- `index.html`, `website.html`
- All markdown documentation files (`README.md`, `RESUME_GUIDE.md`, `CONTRIBUTING.md`)
- `.git/` folder (preserves all commit history, tags, and branches)

### Recommended Git Commit before backup:
If you want to save all the recent changes cleanly into Git before backing up:
```bash
git add .
git commit -m "refactor: curate utilities to 87 tools, consolidate network & date utils, add vitest suite"
```

---

## 2. Setting Up on Fresh Windows

Once Windows is installed, follow these steps to resume work:

### Step 1: Install Required Tools
1. **Node.js**: Download and install **Node.js 20 LTS** (or higher) from [nodejs.org](https://nodejs.org/). Make sure the "Add to PATH" option is checked.
2. **Git for Windows**: Download and install from [git-scm.com](https://git-scm.com/). During installation:
   - Set default editor (VS Code or Notepad).
   - In "Configuring the line ending conversions", choose **"Checkout as-is, commit Unix-style line endings"** (or run `git config --global core.autocrlf false`).
3. **VS Code** (recommended): Download and install from [code.visualstudio.com](https://code.visualstudio.com/).
   - Recommended extensions: ESLint, Tailwind CSS IntelliSense, Prettier.

### Step 2: Restore the Project
1. Copy your backed-up `Doda-Toolkit` folder to your desired location (e.g., `C:\Projects\Doda-Toolkit` or `D:\Projects\Doda-Toolkit`).
2. Open PowerShell or Windows Terminal in that folder:
   ```powershell
   cd C:\Projects\Doda-Toolkit
   ```

### Step 3: Install Dependencies
```powershell
npm install
```
*Note: This will download and install all packages into `node_modules/` based on `package-lock.json`.*

### Step 4: Verify the Setup
Run the automated test suite to ensure the environment and modules work as expected:
```powershell
npm test
```
All tests should pass cleanly!

---

## 3. Daily Development Commands (Windows)

| Command | What it does |
| :--- | :--- |
| `npm run dev` | Launches the Vite dev server at `http://localhost:5173` (Instant browser hot-reload) |
| `npm test` | Runs the Vitest automated test suite |
| `npm run test:watch` | Runs Vitest in interactive watch mode while editing code |
| `npm run electron:dev` | Compiles web assets & electron scripts, then launches the desktop app |
| `npm run build` | Builds optimized web distribution in `dist/` |
| `npm run build:electron` | Bundles Electron `main.ts` and `preload.ts` via esbuild to `dist-electron/` |
| `npm run electron:build` | **Builds the Windows installer (`.exe`)** in the `release/` folder |

---

## 4. Current State & Summary of Changes

### A. The 87 Active Utilities (8 Categories)
1. **🛠️ Code & Data (30)**: QR Code Generator, JSON Formatter, UUID Generator, Base64 Encoder/Decoder, Hash Generator, Number Base Converter, Regex Tester, Fake Data, YAML ↔ JSON, SVG Viewer, JSON → TypeScript, CSV ↔ JSON, HTTP Status Codes, SQL Formatter, Calculator, Text to Slug, Text Cleaner, CSS Unit Converter, Unicode Inspector, Cron Explainer, Roman Numerals, HTML/CSS/JS Playground, **URL Encoder/Decoder**, **URL Parser**, **HTML Entity Encoder**, **MIME Lookup**, **GraphQL Formatter**, **Gitmoji Reference**, **ASCII Table**, **Sorting Visualizer**.
2. **🔤 Text Tools (7)**: Case Converter, Character Counter, Lorem Ipsum, Text Diff, Markdown Editor, Text to Speech, Morse Code.
3. **↔️ Converters (9)**: Currency Converter, Time Calculator, EMI / Loan Calculator, Temperature Converter, Data Size, **Timestamp Converter**, **Unit Converter**, **Geo Coordinates**, **Tip Calculator**.
4. **🔒 Security (9)**: Metadata Cleaner, JWT Decoder, Hash File Checker, QR Code Scanner, Password Strength Checker, **Password Generator**, **TOTP 2FA Authenticator**, AES Text Encrypt/Decrypt, RSA Key Generator.
5. **🌐 Network (2)**: **Network & IP Inspector** (consolidated public IP, ISP, geolocation, local WebRTC IP, and client environment specs), Link Preview.
6. **🎨 Design (12)**: OCR, Color Palette, Color Contrast (WCAG), **Color Picker & Palette**, CSS Gradient Generator, Box Shadow Generator, Image Compressor, Tailwind Colors, Image to Base64, Placeholder Images, Color Converter, Image Format Converter.
7. **📌 Everyday Tools (17)**: Clipboard Manager, **Date & Age Calculator** (with dedicated Age milestones tab), Random Number Generator, **List Randomizer & Decision Maker** (with animated spinner), Percentage Calculator, Number to Words, Emoji Picker, World Clock, Notes Pad, Typing Speed Test, Pomodoro Timer, Monthly Calendar, File Info, ASCII Art Generator, Stopwatch, To-Do List, Countdown Timer.
8. **⚙️ System (1)**: Settings.

### B. Pruned Gimmicks
- Deleted pseudo-scientific and filler widgets (`biorhythm`, `random-quote`, `text-repeater`, `dice-roller`, `ebook-splitter`, `zodiac`, `card-shuffler`, `periodic-table`).

### C. Consolidations Done
- `ip-info` + `browser-info` → Consolidated into `ip-info` ("Network & IP Inspector").
- `date-calculator` + `age-calculator` → Consolidated into `date-calculator` with a dedicated "Age Calculator" tab.
- `list-randomizer` + `decision-maker` → Consolidated into `list-randomizer` with animated "Spin Decision".

### D. Testing Architecture
- Vitest + `@testing-library/react` + `jsdom` setup with test suites:
  - `src/components/utilities/case-converter/CaseConverter.test.tsx`
  - `src/components/utilities/char-counter/CharCounter.test.tsx`
  - `src/components/utilities/number-to-words/NumberToWords.test.tsx`
  - `src/components/utilities/url-encoder/URLEncoder.test.tsx`

---

## 5. Potential Next Steps When You Resume

When you are back up and running on Windows, here are the most logical next tasks:
1. **Build Windows Installer**: Run `npm run electron:build` on Windows to test generating the native `.exe` installer.
2. **Expand Test Coverage**: Add unit test suites for other key utilities like `JSONFormatter`, `JWTDecoder`, `Base64`, `PasswordGenerator`, and `HashGenerator`.
3. **App Icons for Windows**: Add a high-resolution `.ico` icon to `build/icon.ico` for the Windows taskbar and installer.
4. **Website / Release**: Update `website.html` download links and release notes.
