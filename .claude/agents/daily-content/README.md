# Daily Content Agent

A self-running agent that drafts your daily content (LinkedIn + Skool posts, and
Sun/Tue/Thu newsletters) every morning using the SPARC CRM, and leaves it as drafts
for you to approve. You stop starting from a blank page.

- **What it runs:** [`RUNBOOK.md`](./RUNBOOK.md) — the prompt the scheduled session executes.
- **What it touches:** SPARC CRM (`today_checklist`, `top_content_posts`,
  `add_content_post`, `generate_email`, etc.). Read + draft only.
- **What it never does:** publish or send without your explicit OK.

## Make it run on its own (one-time setup)

This is the part that turns it from "chat" into "agent." On Claude Code on the web:

1. Open this repo (`thrill96/parser`) in Claude Code on the web.
2. Create a **scheduled trigger** for this environment:
   - **Schedule:** every day, ~6:00 AM your timezone (before you start work).
   - **Prompt:** `Follow .claude/agents/daily-content/RUNBOOK.md`
3. Save it. That's it — each morning a fresh session spins up, runs the runbook,
   drafts your content, and posts the summary. You just review and approve.

Docs for triggers/scheduling: https://code.claude.com/docs/en/claude-code-on-the-web

## Approving / sending

After the morning summary, just reply in that session:
- "Publish the LinkedIn and Skool posts" → they go live.
- "Send the Tuesday newsletter to the suggested segment" → it queues via `queue_newsletter`.
- "Redo the LinkedIn hook, make it punchier" → it revises the draft.

## Tuning the agent

Edit [`RUNBOOK.md`](./RUNBOOK.md) and commit. The voice rules, schedule logic, and
output format all live there — change them once and every future run picks it up.
