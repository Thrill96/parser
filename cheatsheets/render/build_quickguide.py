#!/usr/bin/env python3
"""Build the Claude Quick Guide as real HTML/CSS (QuickStudy template) -> PDF + PNG + JPG.
Engine: WeasyPrint (HTML/CSS -> PDF) + PyMuPDF (PDF -> raster). No browser needed.
Deep QuickStudy structure: multi-level nesting (1/a/i), italic Definition lead-ins,
formula blocks, 3-panel macro logic (left=foundations, center=workhorse, right=lookups)."""
import html as _h, fitz
from weasyprint import HTML

OUT = "/home/user/parser/cheatsheets/render"

def splat(color="#FBF4EA", n=12):
    rays = "".join(
        f'<rect x="46.5" y="5" width="7" height="36" rx="3.5" fill="{color}" transform="rotate({i*360/n} 50 50)"/>'
        for i in range(n))
    return f'<svg viewBox="0 0 100 100" width="44" height="44" style="flex:none">{rays}<circle cx="50" cy="50" r="8" fill="{color}"/></svg>'

def esc(s): return _h.escape(str(s))

def nlist(items):
    s = "<ol class='n'>"
    for it in items:
        if isinstance(it, str): s += f"<li>{esc(it)}</li>"
        else: s += f"<li>{esc(it[0])}{nlist(it[1])}</li>"
    return s + "</ol>"

def render_items(items):
    out = []
    for it in items:
        k = it[0]
        if k == "def":   out.append(f'<p><span class="term">{esc(it[1])}</span> <span class="def">{esc(it[2])}</span></p>')
        elif k == "d":   out.append(f'<p><span class="term">{esc(it[1])}</span> — {esc(it[2])}</p>')
        elif k == "p":   out.append(f'<p>{esc(it[1])}</p>')
        elif k == "n":   out.append(nlist(it[1]))
        elif k == "fml": out.append('<div class="fml">' + "".join(f"<div>{esc(l)}</div>" for l in it[1]) + "</div>")
        elif k == "t":
            hdr = "".join(f"<th>{esc(c)}</th>" for c in it[1])
            rows = "".join("<tr>" + "".join(f"<td>{esc(c)}</td>" for c in r) + "</tr>" for r in it[2])
            out.append(f'<table><tr>{hdr}</tr>{rows}</table>')
    return "".join(out)

def render_block(b):
    if b[0] == "S":   return f'<div class="sec"><div class="h">{esc(b[1])}</div><div class="body">{render_items(b[2])}</div></div>'
    if b[0] == "BOX": return f'<div class="box"><div class="bt">{esc(b[1])}</div><div class="body">{render_items(b[2])}</div></div>'
    return ""

def render_page(p):
    cols = "".join(f'<div class="col">{"".join(render_block(b) for b in col)}</div>' for col in p["columns"])
    chrome = ""
    if p.get("howto"):    chrome += f'<div class="bar">HOW TO USE THIS GUIDE</div><div class="howto">{p["howto"]}</div>'
    if p.get("contents"): chrome += f'<div class="bar">CONTENTS</div><div class="contents">{p["contents"]}</div>'
    return f'''<div class="page" style="--c:{p['color']}">
      <div class="topline"><span class="brand">WILL STEWART AI</span><span class="tag">WORLD'S FRIENDLIEST AI QUICK REFERENCE</span><span class="pill">{p['tab']}</span></div>
      <div class="titlebar">{splat()}<h1>Claude <span class="amp">Tips &amp; Tricks</span></h1><div class="sub">A Quick Reference<br>Guide</div></div>
      {chrome}<div class="bar banner">{esc(p['banner'])}</div>
      <div class="cols">{cols}</div>
      <div class="footer">Will Stewart · Anti-AI Guru · empower-core.com</div><div class="pageno">{p['no']}</div>
    </div>'''

CSS = '''
@page { size: Letter; margin: 0; }
* { box-sizing: border-box; }
body { margin:0; font-family: Helvetica, Arial, sans-serif; color:#1F1A17; }
.page { width:8.5in; height:11in; background:#F0EAE0; padding:0.15in 0.15in 0.32in; position:relative; overflow:hidden; page-break-after:always; }
.topline { display:flex; justify-content:space-between; align-items:center; font-size:7pt; }
.topline .brand { font-weight:bold; letter-spacing:.4px; }
.topline .tag { font-style:italic; color:#6b5849; }
.pill { background:var(--c); color:#FBF4EA; font-weight:bold; font-size:7pt; padding:2px 9px; border-radius:9px; }
.titlebar { display:flex; align-items:center; gap:9px; background:var(--c); border-radius:9px; padding:6px 12px; margin-top:4px; }
.titlebar h1 { font-family:Georgia,'Times New Roman',serif; color:#FBF4EA; font-size:30pt; margin:0; font-weight:bold; line-height:.95; }
.titlebar h1 .amp { font-weight:normal; }
.titlebar .sub { color:#F6E7DA; font-size:8pt; margin-left:auto; text-align:right; line-height:1.05; font-style:italic; }
.bar { background:var(--c); color:#FBF4EA; font-weight:bold; text-align:center; font-size:8.5pt; padding:2.5px; border-radius:4px; margin-top:4px; text-transform:uppercase; letter-spacing:.6px; }
.banner { font-size:11pt; padding:3px; }
.howto, .contents { font-size:6.9pt; line-height:1.28; padding:2px 3px; }
.cols { display:flex; gap:6px; margin-top:4px; align-items:flex-start; }
.col { flex:1; min-width:0; }
.sec { margin-bottom:4px; }
.sec > .h { background:var(--c); color:#FBF4EA; font-weight:bold; text-transform:uppercase; font-size:7.2pt; padding:2px 5px; border-radius:3px; letter-spacing:.3px; }
.body { font-size:7pt; line-height:1.22; padding:1.5px 1px 0; }
.body p { margin:1.3px 0; }
.term { font-weight:bold; }
.def { font-style:italic; color:#43392f; }
ol.n { margin:1px 0 2px 13px; padding:0; }
ol.n li { margin:.5px 0; }
ol.n ol { margin:.3px 0 .3px 10px; list-style-type:lower-alpha; }
ol.n ol ol { list-style-type:lower-roman; }
.fml { background:#E7DCC8; border-radius:3px; padding:2.5px 6px; margin:2px 0; font-family:Georgia,serif; font-size:7pt; line-height:1.3; }
.fml div:last-child { font-weight:bold; }
table { border-collapse:collapse; width:100%; font-size:6.6pt; margin:2px 0; }
th { background:#3A2E26; color:#FBF4EA; text-align:left; padding:1.5px 3px; }
td { padding:1.5px 3px; border-bottom:1px solid #D8C7AD; vertical-align:top; }
tr:nth-child(even) td { background:#E7DCC8; }
.box { background:#E9DCC6; border-left:4px solid var(--c); padding:3px 6px 4px; border-radius:3px; margin-bottom:4px; }
.box .bt { font-weight:bold; text-transform:uppercase; font-size:7.2pt; color:#3A2E26; }
.footer { position:absolute; left:0; right:0; bottom:0; background:#2A211B; color:#F6E7DA; text-align:center; font-weight:bold; font-size:8pt; padding:4.5px; letter-spacing:.3px; }
.pageno { position:absolute; bottom:19px; left:0; right:0; text-align:center; font-size:7pt; color:#6b5849; }
'''

TERRA, AMBER, ESPRESSO = "#C15F3C", "#B07A3C", "#3A2E26"

pages = [
 {"no":1,"tab":"BEGINNER","color":TERRA,"banner":"Beginner Tips",
  "howto":"Color shows the level: <b>terracotta = Beginner</b>, <b>amber = Intermediate</b>, <b>espresso = Advanced</b>. Bold term + definition; <b>OR</b> marks an alternative; numbered lists are steps; tables are for looking up; tinted boxes are examples to copy. No experience needed — each tip stands alone.",
  "contents":"<b>Pg. 1</b> How to Use · Beginner Tips &nbsp;|&nbsp; <b>Pg. 2</b> Intermediate: Prompt Patterns · Projects · Documents &nbsp;|&nbsp; <b>Pg. 3</b> Advanced: Techniques · Models · Systems · Troubleshooting",
  "columns":[
   [("S","What Claude Is",[("def","Claude:","a family of AI models (Haiku, Sonnet, Opus) that read, write & reason over long text and images."),("p","A thinking partner, not magic — you decide what's right."),("p","It predicts helpful text; it doesn't know you or remember past chats by default.")]),
    ("S","What It's Great At",[("d","Write","emails, posts, resumes, bios."),("d","Summarize","articles, PDFs, threads, transcripts."),("d","Explain","hard topics in plain English."),("d","Plan","trips, meals, projects, launches."),("d","Translate","and shift tone or reading level.")]),
    ("S","What It Can Read",[("p","Attach a PDF, Word doc, spreadsheet, slide deck, or screenshot and ask about it.")]),
    ("S","The 3 Models",[("t",["Model","Best for"],[["Haiku 4.5","fast & cheap"],["Sonnet 4.6","the default"],["Opus 4.7","deepest reasoning"]])]),
    ("S","Free vs Pro",[("p","Free at claude.ai."),("p","OR Pro (~$20–30/mo): more usage, bigger files, Cowork.")]),
    ("S","Start in 2 Minutes",[("n",["Make a free account at claude.ai.","Type in the box, press Enter.","Click + to attach a PDF, doc, or image.","Start a New Chat for each new topic."])]),
   ],
   [("S","Anatomy of a Good Prompt",[("d","ROLE","\"You are a careful editor.\""),("d","CONTEXT","who it's for, why, what 'good' looks like."),("d","TASK","one clear thing."),("d","FORMAT","length, tone, table or list."),("p","More of the four = better answers.")]),
    ("S","The Prompt Formula",[("fml",["Role + Context","+ Task + Format","= a great answer"])]),
    ("S","Your First 10 Prompts",[("n",["Summarize this in 5 bullets: [paste]","Turn notes into an action list: [paste]","Draft a friendly reply: [paste]","Give 10 ideas for [niche]","Rewrite at a 6th-grade level: [paste]","Explain [escrow/APIs/taxes] like I'm 12","Compare [A] vs [B] in a table","Turn bullets into a LinkedIn post: [paste]","10 questions for a [sales call]","Turn this checklist into an SOP: [paste]"])]),
    ("S","Talk to It Like a Teammate",[("p","Be specific — vague in, vague out."),("p","One task at a time."),("p","Show an example of 'good.'"),("p","Ask it to ask you questions first."),("p","Keep refining; it expects edits.")]),
    ("S","Ask for Format",[("p","\"As a list / a table / an email / under 100 words.\"")]),
   ],
   [("S","Fix a Bad Answer",[("t",["Problem","Say this"],[["Too long","Cut it in half"],["Too stiff","Warmer, like a friend"],["Too vague","Add an example"],["Made-up","Use only my facts"],["Too generic","Make it specific to me"],["Wrong shape","Put it in a table"]])]),
    ("S","Watch-Outs",[("p","Confident even when wrong — verify facts, names, numbers."),("p","May miss today's news/prices unless it searches."),("p","Each chat starts fresh; re-paste what it needs.")]),
    ("S","Words to Know",[("def","Prompt:","your request."),("def","Model:","the version doing the thinking."),("def","Token:","a chunk of text."),("def","Hallucination:","a confident wrong answer."),("def","Context:","everything it can see right now.")]),
    ("S","Stay Safe & Private",[("p","Never paste passwords, card numbers, or client secrets."),("p","Strip names before sharing sensitive docs."),("p","Double-check medical, legal & money answers.")]),
    ("S","Daily Uses",[("d","Inbox","draft & soften replies."),("d","Learning","a 5-min explainer + a quiz."),("d","Money","plain-English breakdowns."),("d","Errands","plan, list, compare.")]),
    ("BOX","Try This",[("p","\"You are my AI writing buddy. Ask me 5 questions about my business, then write a warm, confident 3-paragraph About section for my website.\"")]),
   ],
  ]},
 {"no":2,"tab":"INTERMEDIATE","color":AMBER,"banner":"Intermediate Tips",
  "columns":[
   [("S","Prompt Patterns That Work",[("d","Role","\"You are my [expert].\""),("d","Recipe","\"Go step by step: 1)… 2)…\""),("d","Critique & improve","\"Critique in 3 bullets, then rewrite.\""),("d","Format","\"Output as a table.\""),("d","Checklist/SOP","\"Turn this into a checklist + SOP.\""),("d","Question-first","\"Ask me 5 questions, then plan.\""),("d","Few-shot","\"Here are 2 examples — match the style.\"")]),
    ("S","Get the Tone Right",[("p","Name the reader + the feeling."),("p","Paste a voice sample to mimic."),("p","Set the reading level."),("p","Ban clichés and buzzwords.")]),
    ("S","Ask for Structure",[("p","Tables for comparisons."),("p","Numbered steps for how-to."),("p","Checklists for repeatable tasks.")]),
    ("S","Chain Your Asks",[("fml",["Outline → Draft","→ Critique → Final","beats one mega-prompt"])]),
   ],
   [("S","Projects & Artifacts",[("def","Projects:","persistent workspaces; load docs + a brief once, reused across every chat."),("def","Artifacts:","editable docs, tables, code & small apps — not chat bubbles."),("d","Good Projects","course build, client onboarding, SOP library, content calendar.")]),
    ("S","Work With Long Docs",[("n",["Paste, then ask ONE question at a time.","Summarize, then list action items + owners.","Pull every date / name / $ into a table.","Ask: what's missing or contradictory?",("Order matters:",["paste the document FIRST","ask your question LAST"])])]),
    ("S","Summarize Anything",[("p","Articles, transcripts, threads, PDFs → 5 bullets + next steps.")]),
    ("S","Research Mode",[("p","Search first, paste the findings."),("p","Verify facts with a second source."),("p","Ask it what to search next.")]),
   ],
   [("S","Edit Like a Pro",[("p","\"Tighten 30%, keep my voice.\""),("p","\"Make line 1 a hook.\""),("p","\"Fix grammar only.\""),("p","\"Flag vague claims; make them specific.\"")]),
    ("S","Right Tool for the Job",[("t",["Task","Use"],[["Draft / rewrite / explain","Claude"],["Live facts / prices","Web search"],["Final medical / legal / tax","A pro"],["Math you must trust","A sheet, verify"]])]),
    ("S","Common Mistakes → Fix",[("t",["Mistake","Fix"],[["Vague","add who + goal"],["One huge message","split into steps"],["No example","show one"],["Trust draft 1","ask for edits"],["Private data","strip it first"]])]),
    ("S","Make It Reusable",[("p","Save prompts that worked into a swipe file."),("p","Keep one 'control' best example to beat.")]),
    ("BOX","Recipe: Critique Then Improve",[("p","\"You are an expert editor for [audience]. First critique this email in 3 bullets, then rewrite it to fix the issues while keeping my voice.\"")]),
   ],
  ]},
 {"no":3,"tab":"ADVANCED","color":ESPRESSO,"banner":"Advanced Tips",
  "columns":[
   [("S","The Technique Stack",[("def","Chain-of-Thought:","\"Think step by step\" — big jump on multi-step tasks."),("def","Few-shot (2–5):","paste input→output pairs; strongest format/voice lever."),("def","Self-consistency:","ask 3× in fresh chats, keep the recurring answer."),("def","Self-refine:","critique vs a rubric, list flaws, then rewrite."),("def","Tree-of-Thoughts:","3 approaches, score 1–10, expand the winner."),("def","Meta-prompt:","write the ideal prompt, then answer it."),("def","Decompose:","outline → draft → critique → final.")]),
    ("S","Advanced Patterns",[("def","Least-to-most:","solve easy sub-parts first."),("def","Step-back:","\"What principle governs this?\" then answer."),("def","ReAct:","reason → search → observe (with tools).")]),
    ("S","Prompt Add-Ons",[("p","\"Ask me 3 questions first.\""),("p","\"Show your reasoning briefly.\""),("p","\"Give a confidence note.\"")]),
   ],
   [("S","Choose the Right Model",[("t",["Model","Best for"],[["Haiku 4.5","bulk, real-time"],["Sonnet 4.6","everyday work"],["Opus 4.7","strategy, code"]])]),
    ("S","Claude-Specific Levers",[("n",["Ask directly — Claude 4 rewards explicit asks.","Use XML tags <context> <task>.","Long docs first; question last.","Tell it what TO do, not only what to avoid.","Prefill the output skeleton.","Use Projects for memory."])]),
    ("S","System Prompts",[("t",["Goal","Snippet"],[["Keep my voice","Ghostwriter; mimic samples"],["Be concise","Short paras + bullets"],["Fewer made-ups","If unsure, say so"],["Lock format","Reply in this template"]])]),
    ("S","Build Systems, Not One-Offs",[("p","Keep a reusable grading rubric."),("p","Save 3 golden examples to few-shot."),("p","Store best chains as templates.")]),
   ],
   [("S","What's Next (Agentic Claude)",[("def","Cowork:","an autonomous assistant working in the background; you approve before it acts."),("def","Claude Code:","builds & ships whole projects from the terminal."),("def","Claude for Small Business:","15 ready-to-run workflows on your existing plan.")]),
    ("S","Troubleshooting",[("t",["Problem","Fix"],[["Still generic","examples + go Opus"],["Long-doc misses","chunk + Projects"],["Slow / pricey","drop to Haiku"],["Forgot earlier","re-paste / use a Project"],["Won't follow format","template first, numbered"]])]),
    ("S","Anti-Patterns (Stop)",[("p","Vague ask · 5 tasks in one · no example · rules buried at the end · pasting secrets.")]),
    ("BOX","Want the Full Playbook?",[("p","Deep, expert-built guides — Claude for Small Business Owners & Claude for Copywriting (the Ogilvy method) — at empower-core.com.")]),
   ],
  ]},
]

doc_html = f"<html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{''.join(render_page(p) for p in pages)}</body></html>"
open(f"{OUT}/quick-guide.html","w").write(doc_html)
HTML(string=doc_html).write_pdf(f"{OUT}/quick-guide.pdf")
d = fitz.open(f"{OUT}/quick-guide.pdf")
for i in range(d.page_count):
    pix = d[i].get_pixmap(matrix=fitz.Matrix(3,3))
    pix.save(f"{OUT}/quick-guide-p{i+1}.png")
    pix.save(f"{OUT}/quick-guide-p{i+1}.jpg", jpg_quality=92)
print("OK pages:", d.page_count)
