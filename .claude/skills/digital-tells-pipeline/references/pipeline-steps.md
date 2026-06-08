# Prospect Enrichment and Outreach Methodology
## The Digital Tells Pipeline: From Database Row to Kennedy Email
## Version 2.0: Updated after Kim Checketts exercise (June 7, 2026)

---

## THE PRINCIPLE

Cold outreach fails because it treats people as rows in a spreadsheet. This methodology turns a database row into a psychographic profile using publicly available data, then applies the appropriate Kennedy template to write an email that feels like a gift from someone who understands their world.

The goal is NOT "spray and pray." The goal is: by the time you write the email, you know more about the prospect's business than most people who've met them. Every line in the email comes from something verified. Nothing is assumed. Nothing is hallucinated.

---

## THE PIPELINE (Sequential. Never skip a step. Never reorder.)

### Step 1: IDENTIFY (Apollo)
**Tool:** Apollo people search + enrichment
**Cost:** 1 credit per enrichment
**What you get:** Name, email, title, company, revenue, employee count, tech stack, LinkedIn URL, company domain
**What you do:** Filter by ICP criteria ($1M-$20M revenue, 1-50 employees, US, professional services, owner/founder/C-suite). Tier by card system using tech stack signals (Black Card = running ads + CRM, Gold = running ads, Silver = using automation tools, Basic = ICP match only).
**Output:** A prospect record with verified contact info and firmographics.

### Step 2: SCRAPE THEIR WEBSITE (Apify web browser or web_fetch)
**Tool:** Apify RAG Web Browser or web_fetch on their domain
**Cost:** ~$0.01
**This step is MANDATORY and comes BEFORE everything else after Apollo.**
**What you get:** Their About page, team bios, service descriptions, client testimonials on their site, their own words describing what they do and why.
**What you do:** Read their website like a human would. Extract:
- How they describe themselves (self-identity)
- Their founding story (why they exist)
- Their team (who works there, real names, real count)
- Their values language ("white-glove," "independent," "no conflicts of interest")
- Any client testimonials on the site
- Their address, phone, physical location
- Licenses, credentials, affiliations
- Contact structure (who has direct numbers, who doesn't, what that tells you about their flow)
- Client portal or login area (does one exist?)
- What marketing platform runs the site (check meta tags for generators like FMG Suite, Wix, Squarespace)
**CROSS-CHECK RULE:** When Apollo data conflicts with website data, WEBSITE WINS. The prospect knows their own business. Apollo estimates.
**GENDER RULE:** Verify gender from the website bio (pronouns, family references). NEVER assume gender from a first name.
**Output:** Verified company profile in the prospect's own words.

### Step 3: SCAN TECH STACK (Apify Tech Stack Detector)
**Tool:** Apify magicfingers/techstack-detector
**Cost:** FREE
**What you get:** Every technology running on their website: CMS, analytics, advertising pixels, CDN, frameworks, payment tools, chat widgets, scheduling tools.
**What you analyze:**
- What IS there (confirms or disproves Apollo tech stack data)
- What is NOT there (the gaps ARE the diagnostic)
- No scheduling tool = manual appointment booking
- No CRM widget = no automated follow-up
- No analytics = no measurement
- No advertising pixel = no retargeting capability
- No chat widget = every inquiry requires human response
- Template CMS (FMG Suite, Wix, etc.) = turnkey marketing, not custom
**Output:** Verified tech stack with gap analysis.

### Step 4: SCAN AI VISIBILITY (AI X-Ray)
**Tool:** AI X-Ray (add_client with service_category from Step 2, then run_scan, then verify with get_visibility_score)
**Cost:** Free (your tool)
**What you get:** Overall visibility score, per-engine scores (ChatGPT, Claude, Gemini, Perplexity), schema score, competitor displacement list, buyer-intent query results.
**MANDATORY FIELDS on add_client:** domain, brand_name, AND service_category (derived from Step 2 website scrape, not guessed). Include location and target_audience when available.
**VERIFICATION:** After scan, call get_visibility_score. Score must be a real number, not null. Per-engine scores must be present. If null, run_scan again. If still null after second try, stop and report.
**Output:** Verified AI visibility score with competitor data.

### Step 5: AUDIT EMAIL DELIVERABILITY (Apify DMARC Auditor)
**Tool:** Apify nexgendata/email-dmarc-auditor
**Cost:** $0.05 per domain
**What you get:** Deliverability score (0-100), SPF status, DMARC policy, DKIM presence, remediation actions.
**What you analyze:**
- Overall score (below 80 = issues)
- DKIM missing = emails not signed = deliverability problems
- DMARC "none" = not enforcing = domain can be spoofed
- SPF soft fail (~all) vs hard fail (-all)
**IMPORTANT:** This is diagnostic data for Touch 2, not Touch 1. Don't overload the first email with three problems. Save email deliverability for the follow-up.
**Output:** Email infrastructure score with specific vulnerabilities.

### Step 6: SCRAPE LINKEDIN POSTS (Apify LinkedIn Profile Posts)
**Tool:** Apify harvestapi/linkedin-profile-posts
**Cost:** $0.002 per post
**What you get:** Their last 10-20 posts with content, engagement metrics, posting frequency.
**What you analyze:**
- ARE they active? When was their last post? (Kim: 5 years ago. That IS the tell.)
- What topics do they post about? (Professional values, priorities)
- How do they write? (Formal vs casual, long vs short, emojis vs plain)
- What gets engagement? (What resonates with their audience)
- Is it THEIR voice or template/agency content? (Kim: FMG Suite template content, not his voice)
- Do they mention family, values, community? (Affinity link signals)
**IF THEY'RE INACTIVE:** The absence is the tell. Don't reference old posts. Reference the gap. "You've been too busy running the business to tell anyone about it."
**IF THEY'RE ACTIVE:** Reference something specific and recent. "Your post about [topic] last week resonated because [insight]."
**IF IT'S TEMPLATE CONTENT:** Don't reference it at all. It's not their voice. Reference the gap between who they are (website bio) and what their LinkedIn shows (generic templates).
**Output:** Communication style profile + content themes + activity status.

### Step 6b: SCRAPE LINKEDIN PROFILE (Apify LinkedIn Profile Scraper, if needed)
**Tool:** Apify automation-lab/linkedin-profile-scraper or similar
**Cost:** $0.008 per profile
**When to use:** Only if the website About page is thin. If the website has a detailed bio (like Kim's), this step is redundant.
**What you get:** About section, headline, experience history, education, skills, follower count.
**Output:** Professional identity data (supplementary to website).

### Step 7: SCRAPE GOOGLE REVIEWS (Apify Google Reviews Scraper)
**Tool:** Apify scrapeforge/google-reviews-scraper
**Cost:** $0.0002 per review
**What you get:** Client reviews with text, star ratings, reviewer names.
**What you analyze:**
- Do they HAVE reviews? (Kim: zero. That's a data point.)
- What do clients praise? (Specific language clients use about them)
- Any negative reviews? (Pain points or reputation issues)
- Review recency? (Active vs dormant review profile)
**IF THEY HAVE REVIEWS:** Reference the best one. "Your clients say [specific praise]. But AI engines can't hear them."
**IF THEY HAVE NO REVIEWS:** Reference the absence. "Your happiest clients recommend you by word of mouth. AI engines can't hear word of mouth."
**Output:** Reputation data + client voice language.

### Step 8: SCRAPE ADDITIONAL PLATFORMS (Optional, based on prospect)
**Tools:** Apify Facebook Profile scraper, Instagram Profile scraper
**Cost:** $0.006 per Facebook result, $0.001 per Instagram profile
**When to use:** Only when Steps 2-7 don't give you enough for a complete profile. Or when the prospect is clearly active on these platforms (link in website footer, link in LinkedIn bio). Company pages may be more accessible than personal profiles.
**What you get:**
- Facebook: personal interests, family, community, faith, business page activity
- Instagram: lifestyle, aspirations, visual identity
**CRITICAL RULE:** Never reference personal platform data directly in the email. Use it to calibrate TONE only. "I saw your Facebook post about your daughter" = restraining order. Writing in a warm, family-oriented tone because you know they're a family person = Kennedy's mindset matching.
**Output:** Tone calibration signals. Never content for the email itself.

### Step 9: BUILD THE PSYCHOGRAPHIC PROFILE
**Tool:** Your brain (or Claude with the data)
**Cost:** Free
**Compile everything into one profile document:**

```
PROSPECT: [Full name, gender verified from bio]
COMPANY: [Company name]
REVENUE: [Website-verified if available, Apollo as fallback]
TEAM: [Names from website, count verified from website, not Apollo]
LOCATION: [Office from website, home if mentioned separately]
INDUSTRY: [From website, in their words]
FOUNDING STORY: [Why they started, from their About page]
VALUES LANGUAGE: [Their exact words: "white-glove," "independent," etc.]
MARKETING INFRASTRUCTURE: [What platform runs their site, what they pay for]
TECH STACK: [Verified from detector, with gaps noted]
AI VISIBILITY: [Score, top competitors displacing them]
EMAIL DELIVERABILITY: [Score, specific issues (save for Touch 2)]
LINKEDIN STATUS: [Active/inactive, last post date, template vs original, content themes]
GOOGLE REVIEWS: [Count, best quote, or "none found"]
COMMUNICATION STYLE: [Formal/casual, long/short, visual/text]
FAMILY SIGNALS: [Only what's public on their website bio]
AFFINITY LINKS WITH WILL: [Shared values, similar journey, both parents, both independent, etc.]
CONTACT FLOW: [Who handles intake, who the prospect talks to first, who has direct numbers]
DIY DISC PROFILE: [Inferred from behavioral tells]
ROOT CAUSE HYPOTHESIS: [Identity Fusion / Missing Layer / Signal Mismatch]
```

### Step 10: SELECT KENNEDY TEMPLATE
**Do NOT default to Giorgio Step 1. Review the options:**

**Template A: Willie Wizard (B2B Professional Services)**
- Best for: B2B owners who already bought tools but aren't getting results
- Tone: Professional, diagnostic, guaranteed free analysis
- "Are your [tools] sleeping on the job?"
- Use when: prospect has tech stack but missing results

**Template B: Giorgio (Romance/Emotional)**
- Best for: Emotional, lifestyle, aspirational prospects
- Tone: Vivid word pictures, guilt, absolution, solution
- 20 keys structure
- Use when: prospect responds to feeling over data

**Template C: Walter Bergeron (12-Step Multi-Channel)**
- Best for: High-value whales worth $34K+
- Tone: Persistent, multi-media, escalating
- Use when: prospect justifies $200+ per package investment

**Template D: Dr. Bergh (Creative/Unexpected)**
- Best for: Consumer-facing, personality-driven differentiation
- Tone: Playful, memorable, completely different from competitors
- Use when: you need to stand out in a crowded inbox

**Layer on top of the selected template:**

**Framework: Selling to People Above You (if prospect is more successful)**
1. Flattery (genuine, specific to their achievements)
2. Honest acknowledgment of the gap ("I'm not in your industry")
3. Smack with inadequacy on ONE thing ("but on this specific metric...")
4. Establish authority to lead on that matter ("I built the tool that measures it")

**Emotional triggers (select based on DIY DISC profile):**
- Contradiction copy: their values vs their visibility gap
- Fear/insecurity: what they're losing by being invisible
- Revenge/vindication: the firms they LEFT are beating them online
- Conditional sale: zero risk, delete if it's not valuable

**DISC calibration:**
- D (Dominant): Short, direct, bottom-line. "Here's the number. Here's the fix."
- I (Influential): Story-driven, social proof, enthusiasm. "Here's what happened when..."
- S (Steady): No urgency. Evidence. Thoroughness. "I tested this eight different ways."
- C (Conscientious): Data, methodology, precision. "Here's exactly how I measured this."

### Step 11: WRITE THE EMAIL
**Both doors. Always. Internal (operations/Reality Check) AND external (visibility/AI X-Ray).**
**Let the prospect self-select with express instructions: VISIBILITY, OPERATIONS, or BOTH.**

**Mandatory elements (regardless of template):**
1. Personal voice, first person, conversational
2. Character/persona with title appropriate to the prospect's world
3. Source attribution for research ("According to your website," "My tech scan detected")
4. TWO doors (internal + external)
5. Free diagnostic gift (the widget, already built for their firm)
6. Clear express instructions (reply with one word)
7. P.S. with proof story (matched to prospect's industry when possible)
8. P.P.S. with genuine affinity link (verified, never assumed)

**Attachment:** Embedded IMAGE of their scan score (blurred details), NOT a PDF. PDFs trigger spam filters.

**Sending:** From personal Gmail, NOT Mailchimp/Mandrill. Cold outreach and newsletter use separate infrastructure. For 10-50 whales, Gmail is the right channel. Optional: install Streak or Mailtrack for open tracking.

**DATA RULES FOR THE EMAIL:**
- Every claim must trace back to a specific source (Apollo, website, AI X-Ray, tech stack, LinkedIn, Google Reviews)
- When Apollo and website conflict, website wins
- Never assume gender from a name. Check bio.
- Never reference personal social media data directly
- Never reference old/inactive LinkedIn posts unless the inactivity itself is the point
- Never reference template content as if it's their voice
- Never state a specific number (employees, revenue) unless verified from the website. Use "lean team" if unsure.
- Never promise you won't follow up if you plan to send Touch 2 and 3

### Step 12: SEQUENCE (Willie Wizard / Giorgio Steps 2 and 3)
**Schedule: Touch 1 (Day 0), Touch 2 (Day 10), Touch 3 (Day 20)**

**Touch 2: Add new value, don't just repeat.**
- Add the email deliverability finding (from Step 5)
- "Since I wrote you last week, I ran one more diagnostic..."
- Sweetened offer: add whichever door they didn't see emphasized in Touch 1
- Acknowledge they're busy. Empathize. Then pattern break.
- SC prospects: add methodology detail. "Here's HOW I measured your score."
- DI prospects: add a new proof story. "Another firm like yours just..."

**Touch 3: Respectful close.**
- Short. 3-5 sentences.
- For SC prospects: "The data doesn't expire. If you ever want to see it, reply to any of these emails."
- For DI prospects: "This is my last note. The offer is still open. Here's what you'd get."
- Include copies of or references to both previous touches.
- No new offer. Just persistence and accumulated weight.
- ALTERNATIVE (aggressive, for D profiles only): "Boy, are you STUBBORN. This offer will be withdrawn by [date]."

### Step 13: PUSH TO CRM (only after email is written and ready to send)
**Tool:** SPARC CRM or AI X-Ray push_to_crm
**What gets stored:**
- Full psychographic profile from Step 9
- AI X-Ray scan data
- Email deliverability score
- Tech stack findings
- Card tier assignment
- Which Kennedy template was used
- Which email version was sent
- Which door they chose (VISIBILITY, OPERATIONS, BOTH, or no reply)
- Follow-up dates for Touches 2 and 3
- Source: "apollo-black-card" or appropriate tier tag
- All notes with prospect's name (never company name in the name field)

---

## COST PER PROSPECT (Full Pipeline)

| Step | Tool | Cost |
|---|---|---|
| Apollo enrichment | 1 credit | ~$0.10 equivalent |
| Website scrape | Apify/web_fetch | ~$0.01 |
| Tech stack scan | Apify (FREE) | $0.00 |
| AI X-Ray scan | Your tool | Free |
| DMARC audit | Apify | $0.05 |
| LinkedIn posts (10) | Apify | $0.02 |
| LinkedIn profile (if needed) | Apify | $0.008 |
| Google Reviews | Apify | $0.002 |
| Facebook/Instagram (optional) | Apify | $0.007 |
| **Total per prospect** | | **~$0.20** |

Twenty cents per fully profiled prospect with tech stack verification and email deliverability audit.

---

## THE RULES (Learned from the Kim Checketts Exercise)

1. **Scrape the website FIRST.** Before LinkedIn. Before Google. Before anything. Their website is how they CHOOSE to present themselves. It's the richest single source of digital tells.

2. **Website wins over Apollo.** When data conflicts (employee count, revenue, location), the prospect's own website is the source of truth.

3. **Never assume gender from a name.** Check the bio. Check the profile photo. Use neutral language in the email if unsure.

4. **The absence IS a tell.** No LinkedIn posts for 5 years means they're too busy running the business to market it. No Google reviews means their reputation lives in word of mouth. No scheduling tool means manual booking. Don't ignore empty data. Diagnose it.

5. **Template content is not their voice.** If LinkedIn posts read like a social media agency or platform (FMG Suite, etc.) wrote them, they did. Don't reference that content. Reference the gap.

6. **Never reference personal social media directly.** Facebook and Instagram inform TONE, not content. Use them to calibrate how you write, not what you write about.

7. **BOTH doors, every email.** Internal (operations/Reality Check) AND external (visibility/AI X-Ray). Every time. Let the prospect self-select. Never lead with only one.

8. **Select the right Kennedy template.** Don't default to Giorgio. Willie Wizard for B2B professional services. Giorgio for emotional/lifestyle. Layer "Selling to People Above You" when the prospect is more successful than you. Match emotional triggers to DISC profile.

9. **Every claim sourced.** Before the email sends, every factual claim must trace back to a specific data source. If you can't source it, cut it. Use attribution: "According to your website," "My tech scan detected."

10. **Cross-check before you send.** Read the email as the prospect. Does anything feel assumed? Creepy? Generic? If yes, fix it or cut it.

11. **Don't overload Touch 1.** Two diagnostics maximum (AI visibility + internal ops). Save email deliverability for Touch 2 as the "sweetened offer" with new value.

12. **Never promise you won't follow up.** If you plan to send Touch 2 and 3, don't write "I won't contact you again" in Touch 1. Say "I'm not going to pressure you" instead. Honest, not false.

13. **Embedded image, not PDF attachment.** PDFs trigger spam filters. Embed a screenshot-style image of their scan score with blurred details inline in the email.

14. **Send from Gmail, not Mailchimp.** Cold outreach and newsletter use separate sending infrastructure. Never risk your newsletter reputation with cold prospecting.

15. **Fix your own email infrastructure first.** Before sending any outreach, verify your own domain's SPF, DKIM, and DMARC are properly configured. Run the DMARC auditor on empower-core.com and fix any issues. Don't send from a domain scoring below 85.

16. **DIY DISC for whales, Humantic at scale.** For the top 50 prospects (personal outreach), infer DISC from website + LinkedIn behavioral tells. More sources, more accurate, worth the time. For 1,000+ automated sequences, use Humantic AI ($0.06/profile) for rough personality tagging.

17. **Contact flow is a tell.** Look at who has direct numbers vs who doesn't on the website. This reveals the delegation structure, who handles intake, and who the decision-maker actually is. Reference the flow in the internal ops pitch.

18. **Check marketing platform identity.** Check meta tags for site generators (FMG Suite, Wix, Squarespace, Lovable). If they're paying for a turnkey marketing platform, they have marketing budget but are getting generic content every other client of that platform also gets. The pitch: "the marketing you're paying for has a hole in it."
