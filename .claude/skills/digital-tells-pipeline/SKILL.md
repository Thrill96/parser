---
name: digital-tells-pipeline
description: Will Stewart's prospect enrichment, psychographic profiling, and Kennedy outreach system. Trigger when Will asks to prospect, enrich, profile, research, scan, or write outreach emails for any prospect or lead. Trigger on mentions of: digital tells, prospect pipeline, Kim Checketts methodology, whale hunting, cold outreach, enrichment, psychographic profile, DISC analysis, tech stack scan, DMARC audit, LinkedIn scrape, Google reviews, Kennedy email, Giorgio sequence, Willie Wizard, prospect research, outreach sequence, or any request to "look into" or "research" a business or person for outreach purposes. Also trigger when Will mentions Apollo prospecting, AI X-Ray scanning prospects, or building prospect profiles. This skill is the MANDATORY workflow for any outreach. Never write a cold email without running this pipeline first.
---

# Digital Tells Pipeline
## From Database Row to Kennedy Email

This skill defines the mandatory sequential pipeline for enriching prospects and writing personalized Kennedy outreach. Every step must be followed in order. Never skip steps. Never write outreach without completing the research first.

**Core principle:** By the time you write the email, you know more about the prospect's business than most people who've met them. Every line comes from verified data. Nothing assumed. Nothing hallucinated.

---

## PIPELINE OVERVIEW (13 Steps, Sequential)

| Step | Tool | Cost | What You Get |
|---|---|---|---|
| 1. IDENTIFY | Apollo | 1 credit | Name, email, title, company, revenue, tech stack, LinkedIn URL, domain |
| 2. SCRAPE WEBSITE | Apify/web_fetch | $0.01 | Bio, team, founding story, values language, contact flow, marketing platform |
| 3. TECH STACK | Apify techstack-detector | FREE | Verified technologies + gaps (no scheduling? no CRM? no analytics?) |
| 4. AI VISIBILITY | AI X-Ray | Free | Score, per-engine breakdown, competitors, schema |
| 5. EMAIL AUDIT | Apify DMARC auditor | $0.05 | Deliverability score, SPF/DKIM/DMARC status (save for Touch 2) |
| 6. LINKEDIN POSTS | Apify linkedin-profile-posts | $0.02 | Last 10 posts, engagement, activity status, voice vs template |
| 6b. LINKEDIN PROFILE | Apify linkedin-profile-scraper | $0.008 | About, experience, education (only if website bio is thin) |
| 7. GOOGLE REVIEWS | Apify google-reviews-scraper | $0.002 | Client reviews or confirmed absence |
| 8. OTHER PLATFORMS | Apify Facebook/Instagram | $0.007 | Tone calibration only. Never reference directly. |
| 9. BUILD PROFILE | Manual/Claude | Free | Complete psychographic profile document |
| 10. SELECT TEMPLATE | Kennedy reference library | Free | Willie Wizard, Giorgio, Bergeron, or Dr. Bergh + frameworks |
| 11. WRITE EMAIL | Kennedy template + data | Free | Both doors, express instructions, proof in P.S., affinity in P.P.S. |
| 12. SEQUENCE | Kennedy 3-step | Free | Touch 2 (new value) at day 10, Touch 3 (respectful close) at day 20 |
| 13. PUSH TO CRM | SPARC CRM | Free | Full profile + scan data + tags + follow-up dates |

**Total cost per prospect: ~$0.20**

For full step-by-step details, read `references/pipeline-steps.md`.

---

## CRITICAL RULES (18 Rules from the Kim Checketts Exercise)

These are non-negotiable. Each one exists because of a specific mistake made during the proof-of-concept exercise.

1. **Scrape the website FIRST.** Before LinkedIn. Before Google. Before anything. The website is the richest single source. (Mistake: skipped the website, missed gender, founding story, team structure, marketing platform.)

2. **Website wins over Apollo.** Employee count, revenue, location: the prospect's own website is the source of truth. Apollo estimates. (Mistake: used Apollo's "8 employees" when website showed 5.)

3. **Never assume gender from a name.** Check the bio for pronouns or family references. (Mistake: assumed "Kim" was female. Kim is male.)

4. **The absence IS a tell.** No LinkedIn posts for 5 years = too busy to market. No Google reviews = word of mouth only. No scheduling tool = manual booking. Diagnose the gaps, don't ignore them.

5. **Template content is not their voice.** If LinkedIn posts read like FMG Suite, Hootsuite, or an agency wrote them, they did. Don't reference that content. Reference the gap between who they are and what their LinkedIn shows.

6. **Never reference personal social media directly.** Facebook and Instagram inform TONE, not email content. "I saw your Facebook post" = creepy. Writing warmly because you know they're family-oriented = Kennedy's mindset matching.

7. **BOTH doors, every email.** Internal (operations/Reality Check) AND external (visibility/AI X-Ray). Every time. Let the prospect self-select. Never lead with only one. (Mistake: kept defaulting to X-Ray only.)

8. **Select the right Kennedy template.** Don't default to Giorgio. See template selection guide in `references/kennedy-template-guide.md`. (Mistake: defaulted to Giorgio for a B2B financial services professional who needed Willie Wizard.)

9. **Every claim sourced.** Every factual claim must trace to a data source. Use attribution: "According to your website," "My tech scan detected." (Mistake: hallucinated that Kim was a parent without evidence.)

10. **Cross-check before you send.** Read the email as the prospect. Assumed? Creepy? Generic? Fix or cut.

11. **Don't overload Touch 1.** Two diagnostics maximum (AI visibility + internal ops). Save email deliverability for Touch 2 as the sweetened offer with new value.

12. **Never promise you won't follow up.** If Touch 2 and 3 are planned, don't write "I won't contact you again." Say "I'm not going to pressure you." Honest, not false. (Mistake: wrote "I'm not going to follow up" then planned to send two more touches.)

13. **Embedded image, not PDF attachment.** PDFs trigger spam filters. Embed a screenshot-style image of their scan score with blurred details.

14. **Send from Gmail, not Mailchimp.** Cold outreach and newsletter use separate infrastructure. Never risk newsletter reputation with cold prospecting.

15. **Fix your own email infrastructure first.** Run the DMARC auditor on empower-core.com before any outreach. SPF must be -all (hard fail). DMARC must be quarantine or reject. DKIM must be present. Score must be 85+.

16. **DIY DISC for whales, Humantic at scale.** Top 50 prospects: infer DISC from website + LinkedIn behavioral tells (more sources, more accurate). 1,000+ automated sequences: Humantic AI at $0.06/profile.

17. **Contact flow is a tell.** Who has direct numbers on the website? Who doesn't? This reveals delegation structure and who the decision-maker is.

18. **Check marketing platform identity.** Check meta tags for site generators (FMG Suite, Wix, Squarespace, Lovable). If they pay for turnkey marketing, they have budget but are getting generic content.

---

## TOOL REFERENCES

**Apollo:** People search, company search, enrichment, sequences. Connected via MCP.
**AI X-Ray:** add_client (with service_category!), run_scan, get_visibility_score, push_to_crm. Connected via MCP.
**Apify:** Connected via MCP. Key actors:
- `harvestapi/linkedin-profile-posts` (LinkedIn posts, $0.002/post)
- `automation-lab/linkedin-profile-scraper` (LinkedIn profile, $0.008/profile)
- `scrapeforge/google-reviews-scraper` (Google reviews, $0.0002/review)
- `cleansyntax/facebook-profile-posts-scraper` (Facebook, $0.006/result)
- `apify/instagram-profile-scraper` (Instagram, $0.0026/profile)
- `magicfingers/techstack-detector` (Tech stack, FREE)
- `nexgendata/email-dmarc-auditor` (Email audit, $0.05/domain)
- `muhammad-bilal/web-drift-detector` (Website change monitoring, $0.0002/page)
**SPARC CRM:** Contacts, notes, clients, tags, follow-ups. Connected via MCP.
**Kennedy Reference Library:** Located at `/mnt/user-data/outputs/kennedy-sales-architecture/references/`. Key files:
- `kennedy-email-style-guide.md` (Giorgio 3-step, Walter Bergeron 12-step, copy patterns)
- `kennedy-magnetic-vault-swipefile.md` (Full swipe file with examples)
- `advanced-selling-concepts.md` (20 Keys, Selling Above You, Widget, Mind Control Copy)
- `kennedy-whale-hunting.md` (Whale definition, hit list, whale bait, whale whistle)
- `kennedy-how-fish-think.md` (Mindset matching, out-of-category placement)

---

## PSYCHOGRAPHIC PROFILE TEMPLATE

When building the profile in Step 9, use this structure:

```
PROSPECT: [Full name, gender verified from bio]
COMPANY: [Company name]
REVENUE: [Website-verified if available, Apollo as fallback]
TEAM: [Names from website, count verified from website]
LOCATION: [Office from website, home if mentioned separately]
INDUSTRY: [From website, in their words]
FOUNDING STORY: [Why they started, from About page]
VALUES LANGUAGE: [Their exact words]
MARKETING INFRASTRUCTURE: [What platform runs their site, what they pay for]
TECH STACK VERIFIED: [From detector, with gaps noted]
TECH STACK GAPS: [Missing tools = diagnostic ammunition]
AI VISIBILITY: [Score, per-engine, competitors]
EMAIL DELIVERABILITY: [Score, issues (save for Touch 2)]
LINKEDIN STATUS: [Active/inactive, last post, template vs original]
GOOGLE REVIEWS: [Count, best quote, or "none found"]
CONTACT FLOW: [Who handles intake, who has direct numbers]
DIY DISC PROFILE: [D/I/S/C assessment with evidence]
AFFINITY LINKS WITH WILL: [Verified shared values/journey]
ROOT CAUSE HYPOTHESIS: [Identity Fusion / Missing Layer / Signal Mismatch]
KENNEDY TEMPLATE: [Which template and why]
EMOTIONAL TRIGGERS: [Contradiction / Fear / Vindication / Conditional]
```

---

## AI X-RAY SCAN RULES (from prior sessions)

- `add_client` MUST include domain, brand_name, AND service_category. Derive service_category from the website scrape. Never bare domain/name only.
- `run_scan` takes 1-3 minutes. If timeout, don't assume failure. Wait, then call get_latest_scan.
- Verify with `get_visibility_score`. Score must be a real number (not null). Per-engine scores must be present. If null, run_scan again. If still null after second try, stop and report.
- `push_to_crm` only AFTER verified scan. Pass the prospect's full name (from Apollo/website), NEVER the company name.
- One client at a time: add_client -> run_scan -> verify -> push_to_crm, then next.

---

## QUICK REFERENCE: Kennedy Template Selection

| Template | Best For | Tone | Use When |
|---|---|---|---|
| Willie Wizard | B2B professional services | Diagnostic, guaranteed free analysis | Prospect has tools but no results |
| Giorgio | Emotional/lifestyle prospects | Vivid, guilt, absolution, romance | Prospect responds to feeling |
| Bergeron 12-Step | $34K+ whale, multi-channel | Persistent, escalating, multi-media | Justifies $200+/package investment |
| Dr. Bergh | Consumer-facing, creative | Playful, unexpected, memorable | Need to stand out in crowded inbox |

**Always layer "Selling to People Above You" when the prospect is more successful than Will.**
**Always calibrate tone to DIY DISC profile (D=direct, I=story, S=evidence, C=data).**
**Always use contradiction copy when their values conflict with their visibility.**
