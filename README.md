# DSA Transfer Training

A **50-problem interview curriculum** optimized for reasoning transfer rather than problem-count grinding.

- **P01–P35:** disguised foundational problems spanning the major interview primitives.
- **C01–C15:** composite problems requiring multiple ideas to interact.
- The dashboard initially shows the problem and constraints; the intended coverage/pivot is behind **Reveal reasoning pivot**.

## Training loop

1. Read the problem and constraints only.
2. Attempt from first principles.
3. Write your reasoning and the **exact impasse**.
4. Ask ChatGPT for interviewer-style guidance rather than the answer.
5. After solving/reviewing, record the exact reasoning transition you missed.
6. Set comfort from 0–4 and revisit weak problems.

## Shared progress

`data/progress.json` is the repository source of truth.

The website also keeps a browser-local working copy so you can type freely. Use **Export progress** when you want to sync that state back to GitHub, or edit `data/progress.json` directly. ChatGPT has authorized write access to this repository and can update the shared progress during training sessions.

## Files

- `index.html` — dashboard shell
- `app.js` — tracker behavior
- `styles.css` — responsive UI
- `data/problems.json` — all 50 problems plus hidden reasoning metadata
- `data/progress.json` — shared progress state
- `.nojekyll` — static GitHub Pages compatibility

## GitHub Pages

This repository is ready to serve as a static GitHub Pages site. In repository **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.

No GitHub token or credential is stored in the site.

## Working with ChatGPT

Use the stable problem ID and your current reasoning, for example:

> `Let's do C06. Here is my reasoning so far: ...`

The desired interaction is **interviewer/debugger mode**: diagnose the impasse first, provide progressively stronger hints only when needed, and then record the missed reasoning transition and comfort level in the shared tracker.
