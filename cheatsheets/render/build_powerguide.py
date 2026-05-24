#!/usr/bin/env python3
"""Claude Power Guide (Intro & Models / Claude.ai-Projects-Artifacts / Claude Code & Cowork).
Content from the Perplexity script, MODERNIZED to Claude 4.x + safe context claims.
Flowing 3-column QuickStudy layout that auto-paginates (no clipping). -> PDF + PNG + JPG."""
import html as _h, fitz
from weasyprint import HTML
OUT = "/home/user/parser/cheatsheets/render"

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
def sec(title, items): return f'<div class="sec"><div class="h">{esc(title)}</div><div class="body">{items_html(items)}</div></div>'
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
.masthead{display:flex; align-items:center; gap:10px; background:#C15F3C; border-radius:9px; padding:8px 14px; margin-bottom:7px;}
.masthead h1{font-family:Georgia,'Times New Roman',serif; color:#FBF4EA; font-size:27pt; margin:0; line-height:.95;}
.masthead .sub{color:#F6E7DA; font-style:italic; font-size:8.5pt; margin-left:auto; text-align:right; line-height:1.1;}
.intro{font-size:8.2pt; line-height:1.36; margin-bottom:6px;}
.panelbar{column-span:all; -weasy-column-span:all; background:#C15F3C; color:#FBF4EA; font-weight:bold; text-transform:uppercase; text-align:center; font-size:11.5pt; letter-spacing:.5px; padding:4px; border-radius:5px; margin:9px 0 7px;}
.flow{column-count:3; column-gap:10px;}
.sec{break-inside:avoid; margin-bottom:5.5px;}
.sec>.h{background:#3A2E26; color:#FBF4EA; font-weight:bold; text-transform:uppercase; font-size:8.3pt; padding:2.5px 6px; border-radius:3px; letter-spacing:.3px;}
.body{font-size:7.85pt; line-height:1.3; padding-top:2px;}
.body p{margin:2px 0;}
.term{font-weight:bold;}
.def{font-style:italic; color:#43392f;}
ol.n{margin:2px 0 3px 15px; padding:0;}
ol.n li{margin:1.6px 0;}
ol.n ol{margin:1px 0 1px 11px; list-style-type:lower-alpha;}
ol.n ol ol{list-style-type:lower-roman;}
table{border-collapse:collapse; width:100%; font-size:7.4pt; margin:2.5px 0;}
th{background:#3A2E26; color:#FBF4EA; text-align:left; padding:2.5px 4px;}
td{padding:2.5px 4px; border-bottom:1px solid #D8C7AD; vertical-align:top;}
tr:nth-child(even) td{background:#E7DCC8;}
'''

splat = ('<svg viewBox="0 0 100 100" width="40" height="40" style="flex:none">' +
 "".join(f'<rect x="46.5" y="6" width="7" height="35" rx="3.5" fill="#FBF4EA" transform="rotate({i*30} 50 50)"/>' for i in range(12)) +
 '<circle cx="50" cy="50" r="8" fill="#FBF4EA"/></svg>')

blocks = []
blocks.append(f'<div class="masthead">{splat}<h1>Claude <span style="font-weight:400">Tips &amp; Tricks</span></h1><div class="sub">A Quick Reference Guide<br>Beginner → Advanced</div></div>')
blocks.append('<div class="intro">Color shows depth: bold terms are concepts, numbered lists are steps (1 → a → i), tables are for looking up. Models are current as of 2026: <b>Claude 4.x — Haiku 4.5, Sonnet 4.6, Opus 4.7</b>. Each tip stands alone.</div>')

flow = []
# ---------------- PANEL 1 ----------------
flow.append(panelbar("Panel 1 — Introduction & Models"))
flow.append(sec("Introduction: Using Claude", [
 ("def","Definition:","Claude is a family of large language models (LLMs) that read, write, code, and reason over very long text and images — for knowledge work, coding, and decisions."),
 ("def","Versions:","the current Claude 4.x family is Haiku 4.5, Sonnet 4.6, and Opus 4.7 — different speed, cost, and reasoning strengths."),
 ("d","Access",""),
 ("n",["Claude.ai — browser chat + Projects + Artifacts.","Claude Code — coding environment wired to files and repos.","Claude API / platform — programmable access via SDKs."]),
 ("d","Goals when using Claude",""),
 ("n",["Clarify your objective — what decision, asset, or outcome?","Give enough context — documents, examples, constraints.","Specify the output format — bullets, tables, SOPs, code.","Iterate — review, critique, refine; don't expect perfection first try."]),
]))
flow.append(sec("Claude Models — Quick Reference", [
 ("def","Opus 4.7 — Deep Thinking:","complex reasoning, strategy, research synthesis; multi-step plans; non-trivial coding across many files. Pick when quality > speed or problems are ambiguous."),
 ("p","Ex: \"You are my strategy partner. Read these docs and design a 90-day plan for [goal]; highlight trade-offs, risks, assumptions.\""),
 ("def","Sonnet 4.6 — Default Workhorse:","everyday writing, editing, summarizing, support drafts, docs, checklists — most SMB workflows. The default for Claude.ai & Projects."),
 ("p","Ex: \"Rewrite this for busy SMB owners in a clear, friendly tone: 2-sentence summary + 5 bullets.\""),
 ("def","Haiku 4.5 — Speed & Volume:","bulk classification, tagging, extraction; fast Q&A; high-volume tasks where cost/speed matter most."),
 ("p","Ex: \"For each review, output: name, sentiment, main complaint, recommended response angle.\""),
]))
flow.append(sec("Core Concepts & Terminology", [
 ("def","Context window:","the total text + images Claude can consider at once — very long (hundreds of pages in one go on top models)."),
 ("def","System instructions:","persistent directions that set Claude's role, tone, and rules. Ex: \"You are my pragmatic AI coach for SMBs doing $500K–$5M; give practical next steps, no theory.\""),
 ("def","Projects:","persistent workspaces that store docs, instructions, and chats for a client or topic — long-term memory + shared context."),
 ("def","Artifacts:","a side-by-side panel where Claude renders live, editable outputs (code, docs, UIs, tables) instead of plain chat."),
 ("def","Claude Code:","a coding environment that reads, edits, and generates code across files and repos."),
]))
flow.append(sec("Beginner: How to Talk to Claude", [
 ("d","Basic prompt framework",""),
 ("n",[("ROLE — who Claude should be.",["\"You are my [expert type]…\""]),("GOAL — what you want done.",["\"Your goal is to [outcome]…\""]),("INPUT — paste/upload all context.",["\"Here is the context: [text/files].\""]),("OUTPUT FORMAT — how to answer.",["\"Return: summary, 5 bullets, a table.\""])]),
 ("d","Ask-then-answer","\"Before answering, ask up to 5 clarifying questions, then propose a plan and execute.\" — cuts hallucinations."),
 ("d","Constraints & style","length (\"≤200 words\"), tone (\"plain, warm, confident\"), audience (\"busy SMB owners\")."),
 ("d","Iteration loop","draft → critique (\"what's missing / generic?\") → revise (\"v2: keep structure, add specifics\") → save to a library/Project."),
]))
# ---------------- PANEL 2 ----------------
flow.append(panelbar("Panel 2 — Claude.ai, Projects & Artifacts"))
flow.append(sec("Claude.ai — Everyday Interface", [
 ("d","What you see","chat pane (Sonnet/Opus/Haiku) · sidebar (Projects + history) · Artifact panel (live outputs)."),
 ("d","When to use it","ad-hoc questions & drafting · long-running work as Projects · content/doc workflows via Artifacts."),
]))
flow.append(sec("Projects — Long-Term Co-Worker Space", [
 ("d","A project has","a name + description; its own instructions; uploaded docs; history of chats & Artifacts."),
 ("d","When to create one","per client/account; per product/course; per ops area (Marketing, Sales Scripts, SOP Library, Hiring)."),
 ("d","Setup template",""),
 ("n",["Name it: \"Claude for SMB Owners — Core Playbooks.\"",("Upload:",["offers, pricing, services","best emails, posts, pages","ICP & customer research","SOPs (marketing, sales, ops)"]),"Instructions: \"You are our in-house AI strategist; write for SMB owners ($500K–$5M), practical, no hype.\"","Default model: Sonnet 4.6 daily; Opus 4.7 for strategy."]),
 ("d","Recipes","\"Write a 1-page brief of our audience/offers/positioning, then 10 matching content topics.\" · \"Consolidate all onboarding SOPs into one; flag contradictions.\""),
]))
flow.append(sec("Artifacts — Live Workspaces", [
 ("d","What they hold","code (HTML/JS/Python) · formatted docs · tables, forms, simple UIs. Persistent in Projects."),
 ("d","When to use","pages (landing, email, PDF) · scripts & prototypes · internal tools (checklists, calculators)."),
 ("d","Workflow","create (\"make an Artifact that…\") → inspect & edit directly → export/reuse (copy to your site; save in Project)."),
 ("d","Examples","a one-page prompt library by role · an SOP generator (Task/Owner/Tools/Frequency → formatted SOP) · a content calendar table."),
]))
flow.append(sec("Everyday Prompt Recipes", [
 ("d","Email/comms","\"Turn this thread into: a decision summary, a client-facing email, and an internal recap (who/what/when).\""),
 ("d","Meetings","before: \"3 decisions, 5 questions, 3 risks.\" after: \"Decisions, Action Items (owner+due), Risks, Follow-ups.\""),
 ("d","Repurposing","\"From this article: 3 LinkedIn posts, 3 email teasers, a 10-slide outline.\""),
 ("d","Decisions","\"As a skeptical advisor, critique this plan: assumptions, failure modes, early warning signs, 3 safer alternatives.\""),
]))
# ---------------- PANEL 3 ----------------
flow.append(panelbar("Panel 3 — Claude Code & Cowork Workflows"))
flow.append(sec("Claude Code — Overview", [
 ("def","Definition:","a coding-focused Claude that connects to your repos, files, and terminal to read, explain, modify, and generate code with deep context."),
 ("d","Goals","speed up onboarding to a codebase · safe multi-file changes (plans, diffs, tests) · offload repetitive work with human review."),
]))
flow.append(sec("Claude Code — Core Capabilities", [
 ("d","Code understanding","explain unfamiliar files; answer \"where is X?\", \"what calls Y?\", \"what breaks if I change Z?\""),
 ("d","Refactor & features","plan + implement across files; generate tests; propose safer patterns incrementally."),
 ("d","DevOps & scripts","write/modify shell, CI/CD, IaC; debug failing jobs from logs + configs."),
]))
flow.append(sec("Claude Code — Prompt Patterns", [
 ("d","Repo map","\"Scan this repo: architecture overview, main modules + responsibilities, key data models, risky areas to change.\""),
 ("d","Plan-then-patch","1) \"propose a step-by-step plan: files, functions, tests.\" 2) \"implement steps 1–3; diff-style output only; no destructive commands.\""),
 ("d","Review mode","\"As a senior engineer, review this diff for correctness, readability, performance, security, tests — with concrete suggestions.\""),
 ("d","Guardrails","\"Explain changes plainly; keep them small; preserve style; update tests; ask before destructive commands (rm, DROP TABLE).\""),
]))
flow.append(sec("Cowork Style — Claude + You + Your Stack", [
 ("d","Version control","\"Summarize these commits as a PR description (context, intent, risk).\" · \"Generate a changelog entry from this diff.\""),
 ("d","CI/CD","\"Propose a GitHub Actions pipeline (lint, test, build, staging deploy) for our stack.\" · \"Why is this job failing — minimal fix?\""),
 ("d","Non-dev teammates","Artifacts with simple forms: paste ticket → drafted reply + tag; paste CSV → cleaned data + metrics + anomalies."),
]))
flow.append(sec("SMB Owner Playbook — Examples", [
 ("d","Owner brief","\"From this month's P&L + notes: a 1-page owner brief (what changed, why, watch), 3 questions for my accountant, 3 team actions.\""),
 ("d","Client summary","\"From these transcripts/threads for Client X: status, open promises (owner+due), risks/blockers, next 3 moves.\""),
 ("d","Template builder","\"Turn this top email into a reusable template with marked variables + 3 filled examples for different industries.\""),
 ("d","Policy/SOP upkeep","\"Compare legacy SOPs with the new process doc: list conflicts, produce one updated SOP, suggest 3 adoption metrics.\""),
]))
flow.append(sec("Owner's Week With Claude", [
 ("d","Mon","plan the week from last week's notes."),
 ("d","Tue","draft a week of content from one idea."),
 ("d","Wed","review pipeline; draft follow-ups."),
 ("d","Thu","clean up ops: SOPs, vendor emails."),
 ("d","Fri","recap wins; prep next week's list."),
]))
flow.append(sec("More Code Recipes", [
 ("d","Tests","\"Write unit tests for this module; cover edge cases.\""),
 ("d","Docs","\"Generate a README + inline comments for this file.\""),
 ("d","Migrate","\"Port this script from [X] to [Y]; keep behavior identical.\""),
 ("d","Explain an error","\"Walk me through this stack trace and the smallest safe fix.\""),
]))
flow.append(sec("Safety & Governance", [
 ("p","Keep a human approval step on anything customer-facing or legal."),
 ("p","Strip PII, card & bank data before pasting."),
 ("p","Verify every number, date, name, and citation."),
 ("p","Never auto-send unread output; disclose AI where required."),
]))
flow.append(sec("Troubleshooting Claude", [
 ("t",["Problem","Likely cause → Fix"],[
  ["Vague/generic","weak context → add examples, docs, audience, length, outcome"],
  ["Misses doc details","too many files → name files/sections; summarize then ask"],
  ["Inaccurate code","no full view/tests → give full files; run tests; tests before logic"],
  ["Out-of-date","training cutoff → flag uncertainty; verify live facts"],
  ["Refuses a task","over-cautious → add why + context; \"general info is fine\""],
  ["Forgot earlier","new chat → re-paste, or keep it in a Project"],
 ]),
]))

doc = f"<html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{''.join(blocks)}<div class='flow'>{''.join(flow)}</div></body></html>"
open(f"{OUT}/power-guide.html","w").write(doc)
HTML(string=doc).write_pdf(f"{OUT}/power-guide.pdf")
d = fitz.open(f"{OUT}/power-guide.pdf")
for i in range(d.page_count):
    pix = d[i].get_pixmap(matrix=fitz.Matrix(3,3))
    pix.save(f"{OUT}/power-guide-p{i+1}.png"); pix.save(f"{OUT}/power-guide-p{i+1}.jpg", jpg_quality=92)
print("POWER GUIDE pages:", d.page_count)
