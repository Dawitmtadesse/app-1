# CHROMA 5.2 — Windows Desktop App

An offline-first Electron app implementing the CHROMA color language translator. Includes 32 named colors, 5 shades per color, color-pair and three-color priority rules, proportional palette preview, live Meaning / Message / Emotional Tone, presets, dictionary search and clipboard export.

## Run on Windows

1. Install Node.js LTS (includes npm).
2. Unzip this project and open its folder in Codex, VS Code, or Windows Terminal.
3. Run `npm install` followed by `npm start`.

## Build Windows EXE

Run `npm run dist:win` from Windows. The `dist/` folder will contain an installer and portable executable (unsigned, so Windows SmartScreen may display a warning). Alternatively upload the project to GitHub and run the included **Windows build** GitHub Actions workflow; download its `CHROMA-Windows` artifact.

The provided ZIP contains source code, **not a compiled `.exe`**. The app itself does not require an online service after dependencies are installed and it is built.

## Use with Codex

Open this folder in Codex and ask it to modify `src/app.js` (translator logic), `src/data.js` (dictionary/rules), or `src/styles.css` (design). The Electron window configuration lives in `main.js`.

## Interpretation

CHROMA is a constructed symbolic language, not a scientifically established way to infer another person's intentions or emotions from their clothing colors. The included rules reflect the definitions set for this project.
