# Scripts

The contract reads sokkel-ui's `packages/core/tokens/tokens.json` at the commit `sokkel-ui.json`
pins (open questions, D1). The TypeScript scripts run with bun and need no install of their own;
`check.py` runs with uv.

- `resolve.ts` (with `resolve-tokens.ts`, `paints.ts` and `sokkel-ui.ts`): resolves the tokens and
  every paint the specs name into `tokens/tokens.resolved.json`: every theme in light and dark, its
  colors as sRGB hex, lengths in px, numbers, durations in ms, easing curves, elevations as layers,
  words and text roles, every density level, and the `paints` with their `paintSources`.
  - `bun scripts/resolve.ts`: from the pinned commit, fetched over git into `.sokkel-ui/` (ignored).
  - `bun scripts/resolve.ts --ref main`: moves the pin to a branch, tag or commit, then resolves.
  - `bun scripts/resolve.ts --from ../sokkel-ui`: from a sokkel-ui checkout as it stands, its
    uncommitted changes included; the pin is left as it is.
  - `--check` with either: fails when the file is not what the tokens and the specs make.
  It fails on a token it cannot settle that `index.json`'s `tokens.cssOnly` does not list.
- `verify-colors.ts --from <sokkel-ui>`: draws the checkout's generated CSS (`bun run tokens` there)
  in Chromium and compares every color token, every elevation and every paint's colors in the
  resolved file, each theme in both schemes, within 2/255. Playwright and its Chromium come from the
  checkout's own install.
- `check.py [<sokkel-design>] [<tokens.resolved.json>]`: validates every part and pattern against
  `schema/part.schema.json`, each key's kind of token name against the resolved file (so a spec that
  names a token the pinned sokkel-ui lacks fails), painted states, word samples (a word that
  interpolates or counts must have them), each status against `index.json`, the index's version,
  the resolved paints against `schema/paints.schema.json`, and that the resolved file was made from
  the pinned commit. Run it as `uv run --with jsonschema python scripts/check.py`.
- `fmt.py <files>`: formats JSON with 4-space indents, keeping an object or array on one line when it
  fits in 120 columns.

`.github/workflows/contract.yaml` runs them in CI: it checks out sokkel-ui at the pinned commit into
`build/sokkel-ui`, installs it, generates its CSS, and runs `resolve.ts --check`, `check.py`,
`fmt.py` (failing on any change) and `verify-colors.ts`. Locally the same steps run against any
checkout with `--from`.
