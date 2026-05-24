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
- **FLAT MATTE printed page / PDF.** Always include the negative list: NO lamination, NO plastic sheen, NO glare,
  NO reflections, NO page curl, NO drop shadow, NO photo of a physical object. "Pure flat digital infographic, edge to edge."
- **Maximum density**, BarCharts/QuickStudy style: FOUR ultra-tight columns, ~5–6pt text, tight leading,
  minimal margins, near-zero white space, wall-to-wall content.
- No photos, no people, no decorative icons (simple table rules/QR squares only).
- Always end the prompt: "Spell every word exactly as written."

## 2. Palette (hex)
- Background cream `#F5F0E8` · body charcoal `#28251D`.
- Beginner = green-teal `#01696F` · Intermediate = amber/gold `#D19900` · Advanced = navy `#0A0F1E` (banners, white text).
- Tables: navy or teal header row; zebra rows `#F5F0E8` / `#EDE8DF`.
- Example/recipe/template/ROI boxes: tan `#EDE8DF`. CTA boxes: teal or navy with white text. Footer: navy, white text.
- **Dual-lens (practitioner guides):** "Owner Lens" bars = amber `#D19900`; "Claude Lens" bars = teal `#01696F`.

## 3. Layout skeleton (every page)
1. Top header: brand left, italic tagline center, level/panel tab right.
2. Big title banner: huge "Claude" + lighter subtitle.
3. Full-width section banner (the panel name).
4. Four columns; each = subsection bars + bullets, plus tables (navy/teal header, zebra rows) and/or one tan box.
5. Full-width navy footer, centered white:
   `Follow Will Stewart for more human-centered AI insights - willstewart.ai - @willstewart`

## 4. Brand & voice
- Brand line: `WILL STEWART AI`. Consumer tagline: `WORLD'S FRIENDLIEST AI QUICK REFERENCE`.
- Practitioner series tag: `AI PRACTITIONER SERIES`. Credit line: `By Will Stewart - AI Implementation Consultant - willstewart.ai`.
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
> A FLAT, MATTE printed reference sheet shown straight-on as a clean PDF export. NO lamination, NO sheen, NO glare,
> NO reflections, NO curl, NO drop shadow, NO photo of an object. Pure flat digital infographic, edge to edge.
> MAXIMUM DENSITY BarCharts QuickStudy card: FOUR ultra-tight columns of very small 5–6pt text, near-zero white space.
> Portrait 8.5x11. Cream #F5F0E8 background, charcoal #28251D text. [LEVEL] banners in [COLOR] with white text.
> Tables: navy #0A0F1E header, zebra rows cream/#EDE8DF. Tan #EDE8DF boxes. Spell every word exactly.
> TOP header: [brand / tagline / tab]. Title banner huge 'Claude' + lighter '[SUBTITLE]'. Full-width banner '[PANEL NAME]'.
> COL 1 bar '[HEADING]': '[bullet]'; '[bullet]'… COL 2 … COL 3 … COL 4 … [tan box] …
> BOTTOM navy footer, white centered: 'Follow Will Stewart for more human-centered AI insights - willstewart.ai - @willstewart'.
> Style: authentic QuickStudy maximum-density 4-column FLAT MATTE print (not laminated, not a photo), tiny legible type,
> fills the page, NO images, NO people. Spell every word exactly as written.
