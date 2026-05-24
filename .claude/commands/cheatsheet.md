---
description: Research, draft, and render a Will Stewart AI reference card from a topic (with an approval gate before rendering)
argument-hint: <topic> (or omit to build the next queued topic in cheatsheets/topics.md)
allowed-tools: Read, Write, Edit, Bash, WebSearch, WebFetch, mcp__49ea165a-c6c0-4d4e-aef9-313586847da4__generate_image, mcp__49ea165a-c6c0-4d4e-aef9-313586847da4__job_display, mcp__49ea165a-c6c0-4d4e-aef9-313586847da4__balance
---

# Build a cheat sheet: $ARGUMENTS

You are producing a Will Stewart AI laminated-style reference card. Follow `cheatsheets/STYLE.md` EXACTLY — it is the
locked house style (look, palette, layout, voice, fact discipline, and the generation-prompt template). Read it first.

## Pipeline (run in order)

1. **Resolve the topic.** If `$ARGUMENTS` is empty, open `cheatsheets/topics.md` and take the first row whose status is
   `queued`. Read its Tier, Audience/vantage, Panels, and Sources/notes.

2. **Deep research.** Use WebSearch/WebFetch to gather current, non-obvious, source-grounded material — write from the
   stated expert vantage, not surface level. Verify every product/feature/stat claim. Confirm the model lineup is current
   (Claude 4.x) per STYLE §5–6; re-verify the fact base if it looks stale. Mine the relevant frameworks (STYLE §7).

3. **Write the content** to `cheatsheets/NN-slug.md` (next number; `-FREE`/`-PAID` suffix by tier). Organize by
   panel → 4 columns → sections, with every bullet written out, real tables, tan example/recipe boxes, and the dual-lens
   device (Owner Lens amber / Claude Lens teal) for paid guides. Pack it to BarCharts density. Keep facts attributed.

4. **STOP — approval gate.** Show the human a tight summary of each panel and any claims that need a human eye
   (single-source stats, product specifics). Ask: red-pen or green-light? **Do not render until they approve.**
   This is the one mandatory human step — never skip it.

5. **Render.** Any practice/calibration/layout test uses LOW res (`1k`). Only the FINAL approved panels use `4k`
   (STYLE §0). For each panel call `generate_image` (nano_banana_pro, 3:4) using the STYLE §8 template filled with that
   panel's content + correct level/lens colors and the flat-matte negative list. Fire panels in parallel, then
   `job_display` each for review.

6. **Proof & finish.** Ask the human to zoom in and proofread small text (the model can garble tiny type); regenerate any
   panel they flag. Update the topic's status in `cheatsheets/topics.md` (`drafted` → `approved` → `rendered`) and add it
   to the output index. Commit the new `.md` to the working branch (do not push unless asked).

## Guardrails
- Reuse the exact tools/finish that already work; don't invent a new look. STYLE.md wins every disagreement.
- Never print "Claude 3" or stale model claims. Attribute single-source numbers.
- Don't push or open a PR unless explicitly asked.
