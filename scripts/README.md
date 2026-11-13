# Scripts

- `check.py <sokkel-design> <tokens.resolved.json>`: validates every part and pattern file against
  `schema/part.schema.json`, checks each key's kind of token name against a resolved tokens file
  (today sokkel-ui-egui's `crates/core/tokens/tokens.resolved.json`, made by its resolver from sokkel-ui's `tokens.json`), checks painted states, and counts
  the paints the resolver would emit. Needs `jsonschema` (`uv run --with jsonschema python scripts/check.py . <resolved>`).
- `fmt.py <files>`: formats JSON with 4-space indents, keeping an object or array on one line when it
  fits in 120 columns.
