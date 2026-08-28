# DSA Transfer Training

A 50-problem interview curriculum designed for **maximum reasoning transfer per problem**, not problem-count grinding.

- **P01–P35:** disguised foundational problems covering the major interview primitives.
- **C01–C15:** composite problems combining multiple primitives.
- The concept/pivot is intentionally hidden behind a reveal action in the site and `<details>` in each problem file.

## Training loop

1. Read only the problem and constraints.
2. Attempt from first principles.
3. Write your model and the **exact impasse**.
4. Only then inspect a hint/pivot or discuss the problem with ChatGPT.
5. Record the specific reasoning transition you missed.
6. Give yourself a comfort score from 0–4.
7. Revisit until you can reconstruct the idea without recognizing the old solution.

## Progress model

`data/progress.json` is the durable shared progress file.

The website also saves a working copy in your browser for convenience. Use **Export progress** to download the current `progress.json`, then replace `data/progress.json` in GitHub so other devices—and ChatGPT reading the public repository—see the same state.

You can also edit `data/progress.json` directly in GitHub. The hosted dashboard includes a direct **Edit shared progress on GitHub** link. ChatGPT can read this file from the repository and, when GitHub write access is authorized, update the same file after a training session.

## GitHub Pages

After pushing this repository to GitHub:

1. Repository → **Settings** → **Pages**.
2. Under *Build and deployment*, choose **Deploy from a branch**.
3. Select the default branch and `/ (root)`.
4. Save.

The site is static and contains **no GitHub access token**. Do not put a personal access token into `app.js` or any browser-visible file.

## Files

- `index.html` — dashboard shell.
- `app.js` — tracker behavior.
- `styles.css` — responsive styling.
- `data/problems.json` — problem bank and hidden reasoning metadata.
- `data/progress.json` — shared progress state.
- `problems/*.md` — one readable file per problem.

## Working with ChatGPT

Use a stable problem ID, e.g.:

> `Let's do C06. Here is my reasoning so far: ...`

The desired interaction is **interviewer/debugger mode**: do not reveal the solution immediately; identify the exact impasse, provide progressively stronger prompts, then diagnose the missed reasoning transition after the attempt.
