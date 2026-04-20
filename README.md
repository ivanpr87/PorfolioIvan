# 🕹️ ARCADIA: 16-bit Portfolio

Welcome to **Arcadia**, a retro-gaming themed professional portfolio designed to look and feel like a Genesis/SNES-era masterpiece. Built by **Ivan Bastos**, this project transforms the standard CV experience into an interactive RPG/Arcade journey.

![Arcadia Preview](https://img.shields.io/badge/Aesthetics-16--bit-ff2fb6?style=for-the-badge)
![Tech](https://img.shields.io/badge/Made%20with-React%2018-1cf2ff?style=for-the-badge)
![Engine](https://img.shields.io/badge/Engine-Babel%20Standalone-ffe74c?style=for-the-badge)

## 🚀 Experience the Game

This portfolio is not just for viewing; it's for playing. It features several stages:

- **STAGE 01: Hero Screen** — The classic "Press Start" entry.
- **STAGE 02: Character Select** — Deep dive into the player's bio and special moves.
- **STAGE 03: Status Screen** — Professional skills represented as RPG stats and rare inventory items.
- **STAGE 04: Cartridge Shelf** — Projects displayed as physical game cartridges with hover-based "Attract Mode" previews.
- **STAGE 05: Bug Invaders** — A fully playable Galaxiga-style mini-game.
- **STAGE 06: High Scores** — A contact form integrated into the global leaderboard.

## 🛠️ Technical Stack

- **Core:** React 18 (UMD)
- **Transformation:** Babel Standalone (Zero-build, ships as static JSX)
- **Animations:** Framer Motion
- **Styling:** Vanilla CSS with a dynamic palette system (CSS Variables)
- **Audio:** Custom WebAudio API "Chiptune" synthesizer
- **Fonts:** [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P), [VT323](https://fonts.google.com/specimen/VT323)

## 🎨 Dynamic Palettes

Arcadia supports multiple retro color schemes that change the entire vibe of the site instantly:
- **GENESIS:** High contrast magentas and cyans.
- **SNES:** Soft purple and yellow tones.
- **NEOGEO:** Pure black backgrounds with vibrant neons.
- **JRPG:** Classic blue UI gradients with parchment-style text.

## 🔧 Tweaking & Customization

The project includes a built-in **Tweaks Panel** (accessible via hidden commands or specific build flags) allowing you to adjust:
- CRT Scanline intensity
- Global color palette
- Custom cursor variants (Fighter vs. Arrow)

## 🛡️ Recent Fixes (v1.1)

- **Anti-Crash:** Implemented a global `ErrorBoundary` to gracefully handle runtime issues.
- **Translation Safety:** Added `translate="no"` attributes to critical UI components to prevent browser translation engines (like Google Translate) from corrupting the React DOM.
- **Audio Robustness:** Added safety blocks to the WebAudio implementation.

---

© 2026 IVAN BASTOS · LICENSED BY THE INTERNET
