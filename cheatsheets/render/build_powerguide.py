#!/usr/bin/env python3
"""Claude — The Complete Quick Reference (definitive merged guide).
Foundation + Claude.ai/Projects/Artifacts + Claude Code/Cowork, with the things we'd
established: a HOW TO USE legend, a What-Claude-Is intro, and per-section LEVEL color
coding (terracotta=Beginner, amber=Intermediate, espresso=Advanced). Modernized to 4.x.
Flowing QuickStudy layout, auto-paginated. -> PDF + PNG + JPG."""
import html as _h, fitz
from weasyprint import HTML
OUT = "/home/user/parser/cheatsheets/render"
BEG, INT, ADV = "beg", "int", "adv"

def esc(s): return _h.escape(str(s))
def nlist(items):
    s = "<ol class='n'>"
    for it in items:
        s += f"<li>{esc(it)}</li>" if isinstance(it, str) else f"<li>{esc(it[0])}{nlist(it[1])}</li>"
    return s + "</ol>"
def items_html(items):
    out = []
    for it in items:
        k = it[0]
        if k == "def":   out.append(f'<p><span class="term">{esc(it[1])}</span> <span class="def">{esc(it[2])}</span></p>')
        elif k == "d":   out.append(f'<p><span class="term">{esc(it[1])}</span> — {esc(it[2])}</p>')
        elif k == "p":   out.append(f'<p>{esc(it[1])}</p>')
        elif k == "n":   out.append(nlist(it[1]))
        elif k == "t":
            hd = "".join(f"<th>{esc(c)}</th>" for c in it[1])
            rw = "".join("<tr>"+"".join(f"<td>{esc(c)}</td>" for c in r)+"</tr>" for r in it[2])
            out.append(f"<table><tr>{hd}</tr>{rw}</table>")
    return "".join(out)
def sec(title, items, lvl=BEG):
    return f'<div class="sec {lvl}"><div class="h">{esc(title)}</div><div class="body">{items_html(items)}</div></div>'
def panelbar(t): return f'<div class="panelbar">{esc(t)}</div>'

CSS = '''
html,body{background:#F0EAE0;margin:0;}
*{box-sizing:border-box;}
@page{ size:Letter; margin:0.46in 0.17in 0.34in;
  @top-left{content:"WILL STEWART AI"; font:bold 7pt Helvetica; color:#1F1A17;}
  @top-center{content:"WORLD'S FRIENDLIEST AI QUICK REFERENCE"; font:italic 7pt Helvetica; color:#6b5849;}
  @top-right{content:"CLAUDE TIPS & TRICKS"; font:bold 7pt Helvetica; color:#C15F3C;}
  @bottom-center{content:"Will Stewart · Anti-AI Guru · empower-core.com   |   page " counter(page); font:7.5pt Helvetica; color:#6b5849;}
}
body{font-family:Helvetica,Arial,sans-serif; color:#1F1A17;}
.masthead{display:flex; align-items:center; gap:10px; background:#C15F3C; border-radius:9px; padding:8px 14px; margin-bottom:6px;}
.masthead h1{font-family:Georgia,'Times New Roman',serif; color:#FBF4EA; font-size:27pt; margin:0; line-height:.95;}
.masthead .sub{color:#F6E7DA; font-style:italic; font-size:8.5pt; margin-left:auto; text-align:right; line-height:1.1;}
.howtobar{background:#3A2E26; color:#FBF4EA; font-weight:bold; text-transform:uppercase; text-align:center; font-size:9pt; padding:3px; border-radius:4px; letter-spacing:.5px;}
.howto{font-size:8pt; line-height:1.4; margin:3px 0 6px; padding:0 2px;}
.lvtag{display:inline-block; color:#FBF4EA; font-weight:bold; font-size:7pt; padding:1px 7px; border-radius:8px; vertical-align:middle;}
.lvtag.beg{background:#C15F3C;} .lvtag.int{background:#B07A3C;} .lvtag.adv{background:#3A2E26;}
.panelbar{column-span:all; -weasy-column-span:all; background:#2A211B; color:#FBF4EA; font-weight:bold; text-transform:uppercase; text-align:center; font-size:12.5pt; letter-spacing:.6px; padding:4px; border-radius:5px; margin:9px 0 7px;}
.flow{column-count:3; column-gap:10px;}
.sec{break-inside:avoid; margin-bottom:6.5px;}
.sec>.h{color:#FBF4EA; font-weight:bold; text-transform:uppercase; font-size:8.7pt; padding:2.5px 6px; border-radius:3px; letter-spacing:.3px;}
.sec.beg>.h{background:#C15F3C;} .sec.int>.h{background:#B07A3C;} .sec.adv>.h{background:#3A2E26;}
.body{font-size:8.4pt; line-height:1.36; padding-top:2px;}
.body p{margin:2.5px 0;}
.term{font-weight:bold;}
.def{font-style:italic; color:#43392f;}
ol.n{margin:2px 0 3px 15px; padding:0;}
ol.n li{margin:2px 0;}
ol.n ol{margin:1px 0 1px 11px; list-style-type:lower-alpha;}
ol.n ol ol{list-style-type:lower-roman;}
table{border-collapse:collapse; width:100%; font-size:8pt; margin:2.6px 0;}
th{background:#3A2E26; color:#FBF4EA; text-align:left; padding:2.5px 4px;}
td{padding:2.5px 4px; border-bottom:1px solid #D8C7AD; vertical-align:top;}
tr:nth-child(even) td{background:#E7DCC8;}
'''

splat = ('<svg viewBox="0 0 100 100" width="40" height="40" style="flex:none">' +
 "".join(f'<rect x="46.5" y="6" width="7" height="35" rx="3.5" fill="#FBF4EA" transform="rotate({i*30} 50 50)"/>' for i in range(12)) +
 '<circle cx="50" cy="50" r="8" fill="#FBF4EA"/></svg>')

head = (f'<div class="masthead">{splat}<h1>Claude <span style="font-weight:400">Tips &amp; Tricks</span></h1>'
 '<div class="sub">A Quick Reference Guide<br>Beginner → Advanced</div></div>'
 '<div class="howtobar">How to Use This Guide</div>'
 '<div class="howto">Every section is tagged by level — '
 '<span class="lvtag beg">BEGINNER</span> <span class="lvtag int">INTERMEDIATE</span> <span class="lvtag adv">ADVANCED</span>. '
 'Bold terms are concepts; numbered lists are steps (1 → a → i); tables are for looking up. '
 '<b>Claude</b> is a family of AI models that read, write, code &amp; reason over long text and images. '
 'Models current 2026: <b>Claude 4.x — Haiku 4.5, Sonnet 4.6, Opus 4.7</b>.</div>')

flow = []
# ---------------- PANEL 1 — FOUNDATION ----------------
flow.append(panelbar("Panel 1 — Foundation: Claude Basics & Models"))
flow.append(sec("What Claude Is", [
 ("def","Definition:","a family of large language models that read, write, code, and reason over very long text and images."),
 ("d","Models","Opus = most capable; Sonnet = balances speed + smarts; Haiku = fastest & cheapest."),
 ("d","Inputs","text + images, very long context (hundreds of pages), many languages."),
 ("d","Access","Claude.ai (chat + Projects + Artifacts) · Claude Code (repos) · API (SDKs)."),
], BEG))
flow.append(sec("Which Claude to Use", [
 ("t",["Model","Best for","Pick when"],[
   ["Opus 4.7","reasoning, strategy, hard code","quality > speed; ambiguous, high-stakes"],
   ["Sonnet 4.6","everyday writing, analysis, support","the default — fast + strong"],
   ["Haiku 4.5","bulk, classify, extract, fast Q&A","many small repetitive tasks"]]),
 ("d","Opus ex.","\"You are my strategy partner. From these docs + goals, design a 90-day plan; call out trade-offs & risks.\""),
 ("d","Haiku ex.","\"For each review output: name, sentiment, key complaint, suggested response angle.\""),
], BEG))
flow.append(sec("Core Concepts & Terms", [
 ("def","Context window:","all the text + images Claude can hold at once — very long (hundreds of pages on top models)."),
 ("def","System instructions:","standing directions that set role, tone & rules for the whole chat."),
 ("def","Projects:","persistent workspaces storing docs, instructions & chats — long-term memory."),
 ("def","Artifacts:","a live side panel where Claude renders editable code, docs, tables & UIs."),
], INT))
flow.append(sec("Talking to Claude Well", [
 ("d","Always give 4 parts",""),
 ("n",[("ROLE",["\"You are a [expert/coach/dev]…\""]),("GOAL",["one clear objective"]),("INPUT",["paste/upload all context"]),("OUTPUT FORMAT",["\"5 bullets + summary + table\""])]),
 ("d","Ask-then-answer","\"Ask up to 5 questions first, then propose a plan and execute.\" — cuts hallucinations."),
 ("d","Constraints","\"≤200 words\", \"6th-grade level\", \"no jargon\"."),
 ("d","Partner, not vending machine","iterate: \"v2: calmer tone, more numbers.\" Save winners to a library/Project."),
], BEG))
flow.append(sec("Prompt Patterns That Pay Off", [
 ("d","Rewrite","\"Rewrite for [audience] in [tone]; keep facts, cut filler, 3–5 bullets on top.\""),
 ("d","Critique-then-improve","\"Critique this as a tough editor, then rewrite fixing every issue.\""),
 ("d","Compare","\"Compare A vs B for [goal]: pros/cons table + a recommendation.\""),
 ("d","Checklist & SOP","\"Turn this process into a 10-step checklist + a full SOP (who/what/when).\""),
 ("d","Scenario recipe","\"Give 5 prompt recipes for [use case]: Scenario, Goal, Template, Example.\""),
], INT))
flow.append(sec("Guardrails & Safety", [
 ("d","If-unsure clause","\"If you're not confident or data may be stale, say what you're unsure about & what you'd need.\""),
 ("d","Source-aware","\"Answer only from these documents unless you clearly label outside knowledge.\""),
 ("d","Sensitive topics","health/legal/finance: treat Claude as a drafting aid only — route final calls through a pro."),
 ("d","Private data","strip PII, card & bank details before pasting."),
], ADV))
# ---------------- PANEL 2 ----------------
flow.append(panelbar("Panel 2 — Claude.ai, Projects & Artifacts"))
flow.append(sec("Claude.ai — The Interface", [
 ("d","What you see","chat pane (Sonnet/Opus/Haiku) · sidebar of Projects + history · Artifacts side panel."),
 ("d","Chats vs Projects","chats for ad-hoc; Projects for anything recurring, multi-doc, or team-based."),
], BEG))
flow.append(sec("Projects — Your Cowork Space", [
 ("d","What they are","named workspaces grouping instructions, uploaded docs & chats; their own long-context memory."),
 ("d","When to use","client folders · a course/product build · an SOP library · a research theme."),
 ("d","Setup template",""),
 ("n",["Name it (\"SMB AI Ops — Marketing & Ops\").","Add docs: best emails, pages, offers, style guide, ICP.","Instructions: \"You are our in-house strategist; brand voice friendly + practical; audience SMB owners $500K–$5M.\"","Default model: Sonnet 4.6; Opus 4.7 for deep work."]),
 ("d","Project prompts","\"From these files, write a 1-page brief of our offers, ICP & positioning + 10 content ideas.\""),
], INT))
flow.append(sec("Artifacts — Live Workspace", [
 ("d","What they are","a panel rendering code, docs, tables, UIs as a live, editable preview; can persist & call tools."),
 ("d","When to use","building code · designing pages/templates · dashboards & small reusable tools."),
 ("d","Workflow","\"Create an Artifact that does X\" → edit inline / ask for changes → export or share."),
 ("d","Examples","a prompt-library page · an SOP generator form · an AI content calendar table."),
], INT))
flow.append(sec("Everyday Prompt Recipes", [
 ("d","Email/comms","\"Turn this thread into a decision summary, a client email, and a 5-bullet internal recap.\""),
 ("d","Meetings","before: 5 questions + 3 risks. after: decisions, action items (owner+due), open questions."),
 ("d","Repurpose","\"From this article: 3 LinkedIn posts, 3 email teasers, a 10-slide outline.\""),
 ("d","Decisions","\"As a skeptical advisor, challenge this plan: assumptions, failure modes, early warning signs.\""),
], BEG))
# ---------------- PANEL 3 ----------------
flow.append(panelbar("Panel 3 — Claude Code & Cowork Workflows"))
flow.append(sec("Claude Code — What It Is", [
 ("def","Definition:","a coding-focused Claude wired to your files, repos & terminal to read, edit & generate code in context."),
 ("d","Excels at","repo-wide refactors, onboarding to a codebase, multi-file changes guided by a plan."),
], ADV))
flow.append(sec("Core Capabilities", [
 ("d","Understand","explain files/architecture; \"where is X?\", \"what breaks if I change Y?\""),
 ("d","Refactor & build","multi-file changes with tests; migrations, endpoints, docs."),
 ("d","DevOps","shell scripts, CI configs, IaC, deploy scripts."),
 ("d","Agentic","run repeatable playbooks/checklists for complex refactors."),
], ADV))
flow.append(sec("Code Prompt Patterns", [
 ("d","Repo map","\"Summarize architecture, key modules, data models & riskiest areas to change.\""),
 ("d","Plan-then-patch","1) propose a plan (files + tests). 2) implement steps 1–3, diffs only, stop before destructive changes."),
 ("d","Guardrails","\"Explain changes, keep them minimal, preserve style, add tests, ask before destructive commands.\""),
 ("d","Review mode","\"As a senior engineer, review this diff: correctness, readability, perf, security, tests.\""),
], ADV))
flow.append(sec("Cowork Style — Claude + Your Stack", [
 ("d","Version control","\"Summarize these commits as a PR description with risks + testing notes.\""),
 ("d","CI/CD","\"Propose a pipeline (lint, test, build, staging deploy) for our stack; debug this failing job.\""),
 ("d","Non-dev teammates","Artifacts so staff trigger workflows: paste ticket → drafted reply; paste CSV → cleaned + flagged."),
], ADV))
flow.append(sec("SMB Recipes", [
 ("d","Owner brief","\"From this P&L + notes: 1-page brief (what changed, why, watch), 3 questions for my accountant, 3 team actions.\""),
 ("d","Client summary","\"From these transcripts: status, open promises (owner+due), risks, next 3 moves.\""),
 ("d","Template builder","\"Turn this email into a template with marked variables + 3 industry examples.\""),
 ("d","SOP upkeep","\"Compare legacy SOPs to the new doc: redline, one master SOP, list outdated references.\""),
], INT))
flow.append(sec("Troubleshooting", [
 ("t",["Problem","Likely cause → Fix"],[
   ["Vague/generic","weak context → add examples, docs, audience, length"],
   ["Misses doc details","too many files → name files/sections; summarize then drill"],
   ["Inaccurate code","no full view/tests → give full files; test-first flow"],
   ["Out-of-date","training cutoff → flag uncertainty; verify externally"],
   ["Refuses a task","over-cautious → add why + context; \"general info is fine\""],
   ["Forgot earlier","new chat → re-paste, or keep it in a Project"]]),
], BEG))

doc = f"<html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{head}<div class='flow'>{''.join(flow)}</div></body></html>"
open(f"{OUT}/power-guide.html","w").write(doc)
HTML(string=doc).write_pdf(f"{OUT}/power-guide.pdf")
d = fitz.open(f"{OUT}/power-guide.pdf")
for i in range(d.page_count):
    pix = d[i].get_pixmap(matrix=fitz.Matrix(3,3))
    pix.save(f"{OUT}/power-guide-p{i+1}.png"); pix.save(f"{OUT}/power-guide-p{i+1}.jpg", jpg_quality=92)
print("pages:", d.page_count)
