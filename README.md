# 🧰 Doda Toolkit

> Your all-in-one utility toolbox — beautiful, fast, and extensible.

Doda Toolkit brings dozens of small utilities under one roof with a gorgeous multi-colored UI. No more hunting for 100 different websites or tools — everything is one click away.

## 🛠️ Tech Stack

| Layer | Choice |
|-------|--------|
| Desktop | **Electron** |
| UI | **React 18 + TypeScript** |
| Build | **Vite** |
| Styling | **Tailwind CSS** + Glassmorphism |
| Animations | **Framer Motion** |
| UI Components | **shadcn/ui** (Radix primitives) |
| Notifications | **react-hot-toast** |
| Registry | Custom extensibility pattern |

## ✨ Features

### 🖥️ Desktop App
- Built with **Electron + React + TypeScript**
- Cross-platform (Windows, macOS, Linux)
- Custom title bar with native window controls
- Dark/Light mode toggle

### 🎨 Beautiful UI
- Multi-colored gradient themes per utility group
- Glassmorphism cards with backdrop blur
- Smooth animations powered by **Framer Motion**
- Native emoji icons for every utility
- Responsive sidebar with collapsible groups
- Cmd/Ctrl+K command palette for quick search
- Favorites system — pin your most-used tools

### 📦 Utilities

#### 🛠️ Code & Data
| Utility | Description |
|---------|-------------|
| 📱 QR Code Generator | Generate QR codes from text/URLs, download as PNG |
| 📋 JSON Formatter | Pretty-print, validate, and minify JSON |
| 🔢 UUID Generator | Generate v4/v7 UUIDs in bulk (1-100) |
| 🔐 Base64 Encoder/Decoder | Encode and decode Base64 strings instantly |
| 🔑 Hash Generator | Generate MD5, SHA-1, SHA-256 hashes |
| 🔢 Number Base Converter | Convert between decimal, hex, binary, octal |
| 🧪 Regex Tester | Test regular expressions with live matching and explanation |
| 🎭 Fake Data Generator | Generate fake names, emails, phones, addresses for testing |
| 🔄 YAML ↔ JSON Converter | Convert between YAML and JSON formats |
| 🧩 SVG Viewer | View and download SVG code with live preview |
| 🔄 JSON → TypeScript | Convert JSON to TypeScript interfaces |
| 📊 CSV ↔ JSON | Convert CSV to JSON and back |
| ⚡ HTTP Status Codes | Searchable reference of HTTP status codes |
| 🧮 SQL Formatter | Format and minify SQL queries |
| 🧮 Calculator | Basic calculator with history log |
| 🔤 Text to Slug | Convert text to URL-friendly slugs |
| 🧹 Text Cleaner | Strip HTML, collapse spaces, trim, remove non-ASCII |
| 📏 CSS Unit Converter | Convert px to rem, em, %, pt, cm, mm, in, pc, ch |
| 🔡 Unicode Inspector | Inspect Unicode code points and UTF-8 bytes |
| 🧪 Cron Explainer | Translate cron expressions into English |
| 🏛️ Roman Numeral Converter | Convert numbers to and from Roman numerals |

#### 🔤 Text Tools
| Utility | Description |
|---------|-------------|
| ↔️ Case Converter | Convert between camelCase, snake_case, kebab-case, PascalCase, Title Case |
| 📊 Character Counter | Count characters, words, lines, sentences, paragraphs |
| 📝 Lorem Ipsum Generator | Generate placeholder text with custom paragraphs |
| 📋 Text Diff | Compare two texts side by side |
| 🔤 HTML Entity Encoder | Encode and decode HTML entities |
| 📝 Markdown Editor | Write markdown with live HTML preview |
| 🔊 Text to Speech | Read text aloud with voice selection |
| 💬 Morse Code Converter | Convert text to and from Morse code with audio |

#### ↔️ Converters
| Utility | Description |
|---------|-------------|
| 📐 Unit Converter | Convert between length, weight, temperature, data size units |
| ⏰ Timestamp Converter | Convert between Unix timestamps and human-readable dates |

#### 🔒 Security
| Utility | Description |
|---------|-------------|
| 🔒 Password Generator | Generate strong passwords with custom options (length, chars, symbols) |
| 🔐 JWT Decoder | Decode JWT tokens and inspect header, payload, signature |
| 🔍 Hash File Checker | Compute MD5, SHA-1, SHA-256 checksums of files |
| 📸 QR Code Scanner | Decode QR codes from images |
| 🔍 Password Strength Checker | Check password strength with time-to-crack estimate |
| 🔐 Text Encrypt / Decrypt | Encrypt and decrypt text with AES-GCM + passphrase |
| 🔑 RSA Key Generator | Generate RSA-2048 public/private key pairs |

#### 🌐 Network
| Utility | Description |
|---------|-------------|
| 🌐 URL Encoder/Decoder | Encode and decode URLs and URL components |
| 🌐 IP & Browser Info | See your IP, location, browser, OS, screen info |

#### 📌 Everyday Tools
| Utility | Description |
|---------|-------------|
| 🎂 Age Calculator | Calculate exact age with zodiac sign and birthstone |
| 📅 Date Calculator | Days between dates, add or subtract days from a date |
| 🎲 Random Number Generator | Generate random numbers within a range |
| 🔀 List Randomizer | Shuffle lists and pick random items |
| 💯 Percentage Calculator | Find what % of X is Y, add/subtract percentage |
| 🔤 Number to Words | Convert numbers to English words and currency format |
| 🔁 Text Repeater | Repeat text multiple times with custom separator |
| 📋 Emoji Picker | Browse and copy emojis by category |
| 🌍 World Clock | View current time across multiple time zones |
| 📝 Notes Pad | Quick notes with auto-save to localStorage |
| ⌨️ Typing Speed Test | Measure your typing speed and accuracy |
| ⏱️ Pomodoro Timer | 25/5 focus timer with cycle tracking |
| 📅 Monthly Calendar | View any month and jump to today |
| 🗂️ File Info | Drop a file to see name, size, type, dimensions |
| 🧪 ASCII Art Generator | Turn text into ASCII art |
| 🎯 Decision Maker | Spin through options and pick one randomly |
| ⏱️ Stopwatch | Lap timer with millisecond precision |
| 📋 To-Do List | Simple task list with localStorage persistence |
| 🎲 Dice Roller | Roll d4, d6, d8, d10, d12, d20 with animation |
| 🧬 Biorhythm | Physical, emotional, intellectual cycles with chart |
| 📞 Random Quote Generator | Get inspired with random quotes |
| 🗓️ Countdown Timer | Set target date and see live countdown |

#### 🎨 Design
| Utility | Description |
|---------|-------------|
| 🎨 Color Picker | Pick colors and get HEX, RGB, HSL values |
| 🖼️ Image to Text (OCR) | Extract text from images using OCR |
| 🎨 Color Palette from Image | Upload an image to extract its dominant colors |
| 🎯 Color Contrast Checker | Check WCAG contrast ratios between two colors |
| 🖌️ CSS Gradient Generator | Generate linear and radial gradients visually |
| 🎨 Box Shadow Generator | Create and preview CSS box shadows |
| 🗜️ Image Compressor | Compress images and download the result |
| 🎨 Tailwind Color Reference | Browse every Tailwind CSS color with hex values |
| 🖼️ Image to Base64 | Convert images to Base64 data URIs |
| 📦 Placeholder Images | Generate SVG placeholder images at any size |
| 🔄 Color Converter | Convert between HEX, RGB, HSL, CMYK |

### 🏗️ Architecture

```
src/
├── components/
│   ├── ui/           # Reusable UI primitives (shadcn/ui style)
│   ├── layout/       # Shell, Sidebar, Header
│   └── utilities/    # One folder per utility (self-contained)
├── registry/
│   └── utilities.ts  # Single source of truth for all utilities
├── types/
│   └── utility.ts    # Shared type definitions
├── hooks/            # Custom React hooks
└── lib/              # Utility functions
```

### 🔌 Extensibility

Adding a new utility takes 2 steps:
1. Create `src/components/utilities/my-thing/MyThing.tsx`
2. Add one entry to `src/registry/utilities.ts`

No routing changes, no sidebar edits, no import chains.

### 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run in browser (faster dev)
npm run dev

# Run as Electron desktop app
npm run electron:dev

# Build for production
npm run build
```

### 🧪 Testing

Each utility includes a corresponding test file. Run tests with:

```bash
npm test
```

### 📦 Distribution

Doda Toolkit is packaged using **electron-builder** for all platforms:

| Platform | Format |
|----------|--------|
| Windows | NSIS installer (.exe) |
| macOS | DMG (.dmg) |
| Linux | AppImage (.AppImage) |
