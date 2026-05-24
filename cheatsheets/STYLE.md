# CHEAT SHEET HOUSE STYLE — locked spec (do not re-derive)

This is the single source of truth for every Will Stewart AI reference card. The `/cheatsheet`
command and any future session must follow this exactly so the look/voice never drifts.

## 0. Render engine (what actually works)
- Tool: Higgsfield MCP `generate_image`, model `nano_banana_pro`, `aspect_ratio: "3:4"` (portrait 8.5×11).
- **Resolution rule:** practice / calibration / layout tests = LOW res (`"1k"`). Only FINAL, human-approved
  panels render at `"4k"`. Never burn 4K on a draft.
- One image per panel/page. Display each with `job_display` after it renders (CDN is blocked from the sandbox,
  so the human reviews in their widget — always ask them to proofread small text; the model can garble tiny type).
- Credits: ~4 per 4K image, far less at 1k. A 3-panel final guide ≈ 12 credits. Check `balance` if unsure.

## 1. Look & finish (NON-NEGOTIABLE)
- **FLAT MATTE printed page / PDF.** Negative list: NO lamination, NO plastic sheen, NO glare, NO reflections,
  NO page curl, NO drop shadow, NO photo of a physical object. "Pure flat digital infographic, edge to edge."
- **It must LOOK like Claude** (see §2). Warm, editorial, premium — instantly recognizable as Claude in a LinkedIn feed.
- **Density target ~100% cognitive load** — borderline overwhelming, jam-packed, BarCharts/QuickStudy style: FOUR
  ultra-tight columns, ~5–6pt text, tight leading, near-zero white space. (FIVE columns failed — stay at four.)
- **Show, don't just tell:** include worked examples / swipe boxes / sample copy where the topic allows.
- The only allowed graphic is the Claude splat mark (§2). No photos, no people, no stock icons.
- Always end the prompt: "Spell every word exactly as written."

## 2. Palette & brand — CLAUDE IDENTITY (terracotta family)
- **Background:** warm cream `#F0EAE0` (Claude paper). Dark variant for a feature/cover: espresso `#262019` + cream text.
- **Primary accent:** Claude clay / terracotta `#C15F3C` (~`#CC785C`). Banners, the splat, rules, CTAs.
- **Ink:** espresso near-black `#1F1A17`.
- **Warm neutral:** taupe/tan `#D8C7AD` for section-header bars (ink text) and alt zebra rows.
- **Tables:** espresso `#3A2E26` header row (cream text); zebra rows cream `#F0EAE0` / tan `#E5DAC6`.
- **Boxes:** tan `#E5DAC6` example boxes with a terracotta left rule; CTA box espresso or terracotta, cream text. Footer espresso, cream text.
- **The Claude splat:** a terracotta rounded sunburst/asterisk (~10–12 tapered rays) — top-left of the header; may repeat tiny as bullets.
- **Type:** bold SERIF headlines (Tiempos/Georgia feel) + clean SANS body (Styrene/Helvetica feel). Warm, Anthropic-editorial.
- **Level cue (small tab only):** Beginner clay `#C15F3C` · Intermediate burnt-amber `#B07A3C` · Advanced espresso `#3A2E26`.
- **Dual-lens:** the Expert Lens (Ogilvy/Owner) = espresso `#3A2E26` bars; the **Claude Lens = terracotta `#C15F3C`** bars; both cream text.

## 3. Layout skeleton (every page)
1. Top header: terracotta Claude splat top-left, brand left, italic tagline center, level/panel tab right.
2. Big title banner: huge serif "Claude" + lighter subtitle.
3. Full-width terracotta section banner (the panel name).
4. Four columns; each = subsection bars + bullets, plus tables (espresso header, zebra cream/tan rows) and/or one tan box.
5. Full-width espresso footer, centered cream:
   `Will Stewart - Anti-AI Guru - empower-core.com`

## 3b. Layout modes (PICK PER PRODUCT — do not mix up)
- **PRACTITIONER guides (paid)** = DENSE 4-COLUMN dual-lens. This is the user-approved "Claude for Copywriting" build:
  Expert-Lens espresso bars stacked over Claude-Lens terracotta bars, tables, swipe/worked-example boxes. Keep using it for paid.
- **QUICK REFERENCE guides (free)** = authentic **BarCharts QuickStudy laminated-card** layout (the "Excel Tips & Tricks"
  model the user confirmed — THIS is the target). Required chrome, top to bottom:
  1. Thin top line: brand left, italic "WORLD'S FRIENDLIEST AI QUICK REFERENCE" center; faint vertical "QUICK REFERENCE" side tab.
  2. TITLE bar (rounded, terracotta): Claude splat + huge serif "Claude" + "Tips & Tricks".
  3. "HOW TO USE THIS GUIDE" full-width bar + small paragraph with a COLOR LEGEND (tip-block tint = level:
     light clay = Beginner, tan = Intermediate, deep espresso tint = Advanced; "OR" marks an alternative step).
  4. "CONTENTS" full-width bar listing the pages.
  5. Full-width LEVEL section banner ("BEGINNER TIPS", etc.).
  6. THREE columns, **FIVE–SIX stacked topic blocks each** (12–18 per page); every topic gets its own small sub-section
     header bar **COLORED BY LEVEL**: Beginner = terracotta `#C15F3C`, Intermediate = burnt-amber `#B07A3C`,
     Advanced = espresso `#3A2E26` (cream text on all). Embed small tables; one tinted "Try This" box.
  7. Page number bottom-center.
  **DENSITY IS THE POINT:** tiny ~5pt body text, very tight leading, sub-bullets and "OR" branches, near-zero gaps —
  fit ALL the content on one page and shrink the type until it does, so it looks slightly overwhelming (like the Excel
  QuickStudy card / a tax form). If a block has empty room, it's too big. Claude palette + splat. NOT bento, NOT airy columns.

## 4. Brand & voice
- Brand line: `WILL STEWART AI`. Consumer tagline: `WORLD'S FRIENDLIEST AI QUICK REFERENCE`.
- Practitioner series tag: `AI PRACTITIONER SERIES`. Credit line: `By Will Stewart - AI Implementation Consultant - empower-core.com`.
- Voice: human-centered, plain-English for consumer guides; expert operator + Claude-practitioner dual voice for practitioner guides.
- Bullets = actions. Tables = lookups. Tan boxes = copyable examples. Every claim earns its place.

## 5. Fact discipline (keep it sellable)
- **Models are CURRENT (verify each build):** Claude 4.x — Opus 4.7 (deepest reasoning), Sonnet 4.6 (default),
  Haiku 4.5 (fast/cheap). NEVER write "Claude 3" or "2× faster than Claude 2."
- Verify any product/feature claim against Anthropic's own announcements before printing it.
- Attribute single-source stats ("case study, illustrative"); prefer verified aggregate stats as the backbone.
- Re-check the date on every build; today's facts age fast.

## 6. Verified fact base (re-verify if >1–2 months old)
- Claude for Small Business (launched 5/13/2026): runs on existing subscription, toggled on inside Claude Cowork;
  15 ready-to-run agentic workflows + 15 skills (finance/ops/sales/marketing/HR/CS); human approval before anything
  sends/posts/pays. Connectors: QuickBooks, PayPal, HubSpot, Canva, DocuSign, Google Workspace, Microsoft 365.
- Cowork: GA 4/9/2026, Desktop (mac/Win), autonomous background agent. Managed Agents: public beta.
- SMB stats: 58% of SMBs use genAI (up from 40% in 2024); 20+ hrs & $500–$2,000/mo saved; 91% report revenue gains;
  83% of growing SMBs use AI vs 55% of declining.

## 7. Frameworks worth operationalizing (turn into prompts)
Hormozi Value Equation · StoryBrand SB7 · Cialdini's 7 · E-Myth (systematize) · Theory of Constraints · Naval (leverage).
Prompt-eng stack: Chain-of-Thought · few-shot (2–5) · self-consistency · self-refine · Tree-of-Thoughts · meta-prompting · decomposition.

## 8. Generation-prompt template (fill the [BRACKETS])
> A FLAT, MATTE Claude-branded reference sheet shown straight-on as a clean PDF export. NO lamination, NO sheen, NO glare,
> NO reflections, NO curl, NO drop shadow, NO photo of an object. Pure flat digital infographic, edge to edge.
> MAXIMUM DENSITY ~100%: FOUR ultra-tight columns of very small 5–6pt text, near-zero white space.
> Portrait 8.5x11. Warm cream #F0EAE0 background, espresso #1F1A17 text, terracotta #C15F3C accents, the Claude splat top-left.
> Bold serif headlines + sans body. Section/[Claude-Lens] bars terracotta #C15F3C; [Expert-Lens] bars espresso #3A2E26 (cream text).
> Tables: espresso #3A2E26 header, zebra rows cream #F0EAE0 / tan #E5DAC6. Tan #E5DAC6 boxes with terracotta left rule.
> TOP header: splat + [brand / tagline / tab]. Title banner huge serif 'Claude' + lighter '[SUBTITLE]'. Full-width terracotta banner '[PANEL NAME]'.
> COL 1 bar '[HEADING]': '[bullet]'; '[bullet]'… COL 2 … COL 3 … COL 4 … [tan box] …
> BOTTOM espresso footer, cream centered: 'Will Stewart - Anti-AI Guru - empower-core.com'.
> Style: authentic Claude-branded maximum-density 4-column FLAT MATTE print (not laminated, not a photo), terracotta splat,
> tiny legible type, fills the page, NO photos, NO people. Spell every word exactly as written.
