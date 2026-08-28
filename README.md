# DSA Transfer Training

A 50-problem interview curriculum designed for **maximum reasoning transfer per problem**, not problem-count grinding.

- **P01–P35:** disguised foundational problems covering the major interview primitives.
- **C01–C15:** composite problems combining multiple primitives.
- Difficulty, track, complexity target, concept labels, and reasoning pivots are **hidden by default** in the site.

## Training loop

1. Read the problem and examples only.
2. Attempt from first principles.
3. Write your model and the **exact impasse**.
4. Test your implementation against the visible examples.
5. Run the extra judge tests.
6. Only then reveal metadata / reasoning pivot if needed.
7. Record the exact reasoning transition you missed and your comfort score.

## Built-in judge

Every problem has:

- 2 visible LeetCode-style examples.
- At least 1 additional edge test used by **Run all tests**.
- A browser Python editor using `def solve(data): ...`.
- A 10-second worker timeout so an infinite loop does not freeze the page.
- Related LeetCode links when there is an exact or useful close analogue.

Python runs client-side with Pyodide; your code is not sent to a judge server. Since this is a public repository, the extra tests are hidden in the UI rather than cryptographically secret. For exact LeetCode mappings, LeetCode remains the stronger final judge because it has a much larger private test suite.

## Progress

`data/progress.json` is the durable shared state. Browser progress/code is also stored locally for convenience. Export `progress.json` and commit it to GitHub periodically; ChatGPT can read/update the same repository when authorized.

## GitHub Pages

Repository → **Settings** → **Pages** → **Deploy from a branch** → `main` → `/ (root)`.

The site contains no GitHub token or secret.
