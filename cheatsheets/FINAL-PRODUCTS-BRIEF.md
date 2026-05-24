# WILL STEWART AI — FINAL PRODUCTS BRIEF
### A complete handoff for a claude.ai thread · 2026 Edition

> Paste this whole file into a new claude.ai thread to bring it fully up to speed on the reference-guide
> product line: what we're shipping, how the format was discovered, the research method, the brand system,
> and the exact production workflow. Everything here is locked unless noted.

---

## 1. THE PRODUCT LINE (what we're shipping)

Three Claude-branded reference guides, all in the same unmistakable "looks-like-Claude" QuickStudy style.

| # | Product | Tier | Anchor authority | Panels |
|---|---------|------|------------------|--------|
| 1 | **A Quick Guide to Claude** | **FREE** (lead magnet) | — (Claude itself) | 3 |
| 2 | **Copywriting for Claude** *(sexier title TBD — see §7)* | **PAID** | David Ogilvy | 3 |
| 3 | **THE $10M FOUNDER** — *The Claude Playbook for Founders Who Are Done Doing Everything Themselves · 2026 Edition* | **PAID** | Michael Gerber (E-Myth) × Alex Hormozi ($100M Offers / Leads / Money Models) | 4 |

- **Product 1 (free)** is the top-of-funnel magnet — gets the brand recognized in a LinkedIn feed and pulls people in.
- **Products 2 & 3 (paid)** are the **"shock and awe" package** — deep, expert, framework-anchored, the stuff people will pay for.

---

## 2. THE ORIGIN STORY — how Will cracked the reference-guide format

This is the hard-won part. Don't re-derive it; it cost real iteration.

**The goal from day one:** authentic **BarCharts / QuickStudy laminated-card density** — borderline overwhelming,
~100% cognitive load, jam-packed like a tax form or the "Excel Tips & Tricks" QuickStudy card. The governing line:
> **"If it looks like an infographic, the font is too large."**

**What failed (and why):**
- **Bento-box / airy layouts** — too sparse, looked like generic marketing infographics. Rejected.
- **Writing "laminated card" in the image prompt** — made the model photograph a glossy card sitting on a desk,
  with a hand/shadow/3D angle. Fix: **never write "laminated" or "card."** Say "flat digital PDF page / reference
  sheet / full-bleed." Keep "QuickStudy-STYLE layout" only for structure.
- **Pure image-gen at tiny type** — early models garbled 7pt text. Two answers emerged: (a) an HTML/CSS → PDF
  pipeline for 100%-correct editable text, and (b) the image-gen "winning formula" below, which newer
  nano-banana handles well enough if you proofread.
- **Too light on depth** — beginner content was fine, but intermediate/advanced kept coming out generic. Fix:
  anchor to a recognized authority and feed in deep source material (see §4).

**The breakthrough — the "winning formula":** Will cracked it himself with **Perplexity (deep content) + Higgsfield
(nano-banana image gen)**. The magic combination:
- **4:5 portrait, single panel per page, three equal columns**, hairline 0.5pt vertical rules.
- **"Printed InDesign / press aesthetic"** — thin sienna header bars, **7–8pt body**, tight leading, **zero internal
  padding** (text flush under each bar), level badges **inline** with the text (not floating).
- It must **look like Claude** (terracotta + cream + the splat) so it's instantly recognizable as Claude content.

That recipe is now locked in `WINNING-FORMULA.md`. **Aspect ratio = 4:5.** (We briefly mis-rendered at 4:3 — don't.)

---

## 3. THE WINNING FORMULA — production spec (locked)

**Workflow:** deep content first → render as image, one art-direction prompt per panel.

**Layout, every panel:**
- 4:5 portrait page, **full-bleed flat PDF look** (no desk, no hand, no border, no drop shadow, no 3D).
- **Top masthead** (thin espresso bar): left `WILL STEWART · ANTI-AI GURU`, right italic `empower-core.com`.
- **Title bar** (large espresso banner): bold white serif title + white italic subtitle + `· 2026 Edition`.
- **Three equal columns**, hairline 0.5pt charcoal dividers.
- **Section header bars:** burnt sienna `#8B3A1A`, thin 18–20pt strips, white bold all-caps.
- **Body:** 7–8pt dense sans-serif, charcoal `#2a2a2a`, zero padding, paper-grain texture.
- **Inline level pills:** GREEN = Beginner · AMBER = Intermediate · NAVY = Advanced.
- **Footer** (thin espresso bar): `WILL STEWART AI · Anti-AI Guru · empower-core.com`.
- Always end the render prompt: **"Spell every word exactly as written."**

**Resolution rule:** drafts/calibration render at **1k**; only final, human-approved panels render at **4k**
(~4 credits each). Never burn 4K on a draft.

**Note on columns at 4:5:** three dense columns read better wide than tall. At 4:5 portrait the columns get narrow —
if a render looks crowded, drop that panel to **2 columns**. (The Excel QuickStudy card was 3 narrow columns and
worked, so 3-col is legit; 2-col is the relief valve.)

---

## 4. RESEARCH METHODOLOGY — how we make them deep, not generic

1. **Anchor every paid guide to a recognized authority** for gravitas and a non-obvious POV:
   - Copywriting → **David Ogilvy** (the godfather; his 38 principles + *Ogilvy on Advertising*).
   - SMB / founders → **Michael Gerber (E-Myth)** for systems + **Alex Hormozi** for offers, leads & the money model.
2. **Feed deep source material in** (books, transcripts, Perplexity research) so intermediate/advanced tiers carry
   real, "shit-no-one-else-is-finding" insight — not surface tips.
3. **Operationalize frameworks into Claude prompts.** Every framework becomes a paste-ready prompt the reader runs.
   The product = *an expert's frameworks × exactly how to execute them with Claude.*
4. **Tag every item by level** (Beginner / Intermediate / Advanced) inline, so the badges sit in the text.
5. **Three-lens structure** where useful: the authority's law → what AI changes → the exact prompt.
6. **Copyright discipline:** use frameworks, concepts, and **short attributed phrases only**. No large verbatim
   reproduction of any book. Attribute by name (Ogilvy / Gerber / Hormozi).
7. **Fact discipline (re-verify each build — facts age fast):**
   - Models are **Claude 4.x only**: Opus 4.7 (deepest reasoning), Sonnet 4.6 (default), Haiku 4.5 (fast/cheap).
     Never write "Claude 3" or stale comparisons.
   - Verify any product/feature claim against Anthropic's own announcements.
   - Attribute single-source stats as "illustrative"; prefer verified aggregate stats as the backbone.

---

## 5. THE BRAND SYSTEM (Claude identity — terracotta family)

- **Background:** warm cream `#F0EAE0` / `#f7f4ee`. Feature/cover variant: espresso `#262019` + cream text.
- **Primary accent:** Claude clay / terracotta `#C15F3C` (~`#CC785C`) — banners, the splat, rules, CTAs.
- **Header bars (image formula):** burnt sienna `#8B3A1A`. **Ink:** espresso `#1F1A17` / `#3A2E26`.
- **Warm neutral:** taupe/tan `#D8C7AD` / `#E5DAC6` for alt rows + example boxes.
- **The splat:** terracotta rounded sunburst/asterisk (~10–12 tapered rays), top-left of the header.
- **Type:** bold **serif** headlines (Tiempos/Georgia feel) + clean **sans** body (Styrene/Helvetica feel) — warm, Anthropic-editorial.
- **Level cue colors:** Beginner clay/green · Intermediate amber `#B07A3C` · Advanced espresso/navy.
- **Brand line:** `WILL STEWART AI`.
  - Consumer tagline (free guide): `WORLD'S FRIENDLIEST AI QUICK REFERENCE`.
  - Practitioner tag (paid): `AI PRACTITIONER SERIES`.
  - Footer everywhere: `Will Stewart · Anti-AI Guru · empower-core.com`.

---

## 6. PRODUCT-BY-PRODUCT BREAKDOWN

### 6.1 — FREE: "A Quick Guide to Claude" (lead magnet)
- **Audience:** anyone new-to-intermediate with Claude. Beginner → Intermediate → Advanced.
- **Chrome:** masthead + "HOW TO USE THIS GUIDE" legend (with the level color key) + "CONTENTS" + full-width
  level section banners + page numbers.
- **Coverage:** What Claude Is · Which Claude to Use · Core Concepts · Talking to Claude Well · Prompt Patterns ·
  Guardrails · Projects & Artifacts · Claude Code & Cowork.

### 6.2 — PAID: Copywriting for Claude (Ogilvy) — *sexier title in §7*
- **Audience:** founders, marketers, copywriters.
- **3 panels:**
  1. **The Laws** — Ogilvy's rules that still rule (positioning, large promise, big idea, product-as-hero, the
     evidence: headline = 80% of the dollar, the more you tell the more you sell) × what AI changes × setup + the brief.
  2. **The Copy Engine** — each law → a Claude prompt (research, big idea, headlines, body copy), plus a real
     **Ogilvy swipe box** (Rolls-Royce clock, the Hathaway eyepatch, Dove) so readers see copy that sold.
  3. **Test, Scale & Ship** — Ogilvy the testing fanatic → A/B prompts; the 3 Claude surfaces
     (claude.ai → Code → Cowork); the don'ts; the ship-it checklist; a full-chain worked-example prompt.

### 6.3 — PAID: "THE $10M FOUNDER" (Gerber × Hormozi)
- **Full title:** *THE $10M FOUNDER — The Claude Playbook for Founders Who Are Done Doing Everything Themselves · 2026 Edition.*
- **Audience:** owner-operators of $500K–$5M businesses aiming for $10M — overworked, low-leverage, the bottleneck.
- **4 panels (the extra panel = the deep differentiator):**
  1. **Foundation** — Gerber's E-Myth truth (Technician/Manager/Entrepreneur; work ON not IN; the Franchise
     Prototype) + Hormozi's **Value Equation** + set Claude up like an operator (4 Projects + a one-page Business Brief).
  2. **Build the Machine** (Gerber) — Innovation→Quantification→Orchestration; the SOP engine; the org that runs
     without you; the delegation ladder.
  3. **Fill the Machine** (Hormozi) — the **Grand Slam Offer**; the **Core Four** lead sources; the
     survey-your-best-buyers avatar method; the weekly AI cadence; real ROI.
  4. **The Money Model** (Hormozi, Lost Chapters) — **Client-Financed Acquisition** (make >2× your acquisition cost
     back in 30 days so growth self-funds); the **4-offer sequence** (Attraction → Upsell → Downsell → Continuity);
     the **CAC / LTGP** math and levers. *This is the genuinely non-obvious panel most SMB guides never teach.*

---

## 7. TITLE OPTIONS for the copywriting guide (pick one to match "$10M FOUNDER" energy)

- **THE $100M PEN** — *Ogilvy's Laws, Executed by Claude.*
- **SELL LIKE OGILVY** — *The Claude Copywriting Playbook for Founders Who Refuse to Be Ignored.*
- **THE CLAUDE COPY CHIEF** — *Write Like Ogilvy. Ship at AI Speed.*
- **ADVERTISING THAT SELLS** — *The Ogilvy Method, Weaponized with Claude.*
- **THE GHOST OF OGILVY** — *Claude Writes the Copy That Sells.*

*(Recommendation: "THE $100M PEN" parallels "THE $10M FOUNDER" and signals the paid-tier, results-first promise.)*

---

## 8. PRODUCTION WORKFLOW (repeatable — "topics in → cards out")

1. **Content** — Perplexity (or Claude) writes the dense, level-tagged content per panel, anchored to the authority,
   following the research methodology in §4.
2. **One approval gate** — Will reviews the final-draft content **before** any rendering. (No weekend-long build loops.)
3. **Render** — paste each panel's art-direction prompt into **Higgsfield (nano-banana)** at **4:5**, **1k for drafts**.
4. **Proof** — Will proofreads the small 7–8pt type (image models can garble tiny text); fix and re-render as needed.
5. **Finalize** — only approved panels render at **4k**. A 3-panel guide ≈ ~12 credits at 4K.

---

## 9. STATUS

- **Free guide:** content + format locked; renders proven.
- **$10M Founder (SMB):** 4 paste-ready panel prompts done (incl. the Money Model); deep source content done.
- **Copywriting:** 3 paste-ready panel prompts done; deep source content done; **needs the sexier title chosen.**
- **Ratio:** locked to **4:5** across the spec and both prompt sets.
- **Next:** finalize copywriting title → Perplexity finalizes/expands prompts → render at 4:5 (1k → approve → 4k) →
  assemble the two paid guides into the shock-and-awe package.

---

*Brand: WILL STEWART AI · Anti-AI Guru · empower-core.com*
