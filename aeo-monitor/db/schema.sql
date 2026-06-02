-- AEO Monitor schema (Turso / libSQL / SQLite)
-- Apply with:  npm run db:init

-- Domains being monitored
CREATE TABLE IF NOT EXISTS domains (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain TEXT NOT NULL UNIQUE,
    brand_name TEXT NOT NULL,
    owner_name TEXT,
    owner_email TEXT,
    linkedin_url TEXT,
    service_category TEXT,          -- e.g. "AI consulting for SMB owners"
    location TEXT,                  -- used by recommendation prompt templates
    competitors TEXT,               -- JSON array of competitor domains/brands
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Standardized prompts to test
CREATE TABLE IF NOT EXISTS prompts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain_id INTEGER NOT NULL,
    prompt_text TEXT NOT NULL,
    prompt_type TEXT NOT NULL,      -- 'recommendation', 'identity', 'comparison', 'direct'
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (domain_id) REFERENCES domains(id)
);

-- Each test run (one per engine per prompt per cycle)
CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain_id INTEGER NOT NULL,
    prompt_id INTEGER NOT NULL,
    engine TEXT NOT NULL,           -- 'chatgpt', 'claude', 'gemini', 'perplexity'
    run_date DATE NOT NULL,
    raw_response TEXT,              -- full AI response (truncated to 2000 chars)
    brand_mentioned BOOLEAN,       -- did the AI mention the brand name?
    website_linked BOOLEAN,        -- did the AI link to the domain?
    correctly_identified BOOLEAN,  -- did the AI describe the brand accurately?
    competitor_mentioned TEXT,      -- JSON array of competitors mentioned instead
    sentiment TEXT,                 -- 'positive', 'neutral', 'negative', 'absent'
    confidence_score INTEGER,      -- 0-10 how confident/prominent the mention was
    extraction_notes TEXT,          -- Claude's analysis of the response
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (domain_id) REFERENCES domains(id),
    FOREIGN KEY (prompt_id) REFERENCES prompts(id)
);

-- Schema audit results
CREATE TABLE IF NOT EXISTS schema_audits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain_id INTEGER NOT NULL,
    audit_date DATE NOT NULL,
    has_person_schema BOOLEAN,
    has_org_schema BOOLEAN,
    has_website_schema BOOLEAN,
    has_service_schema BOOLEAN,
    has_same_as_links BOOLEAN,
    has_meta_description BOOLEAN,
    og_title TEXT,
    og_description TEXT,
    page_title TEXT,
    schema_json TEXT,              -- the actual JSON-LD found
    issues TEXT,                   -- JSON array of issues found
    score INTEGER,                 -- 0-100 overall schema health
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (domain_id) REFERENCES domains(id)
);

-- Visibility score over time (computed aggregate)
CREATE TABLE IF NOT EXISTS visibility_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain_id INTEGER NOT NULL,
    score_date DATE NOT NULL,
    overall_score INTEGER,         -- 0-100
    chatgpt_score INTEGER,
    claude_score INTEGER,
    gemini_score INTEGER,
    perplexity_score INTEGER,
    schema_score INTEGER,
    competitor_displacement INTEGER, -- how often competitors appear instead
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (domain_id) REFERENCES domains(id)
);

-- Claude-generated recommended actions (one row per scan)
CREATE TABLE IF NOT EXISTS recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain_id INTEGER NOT NULL,
    gen_date DATE NOT NULL,
    summary TEXT,                  -- one-paragraph executive summary
    recommendations TEXT,          -- JSON array of {priority,title,why,action,category}
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (domain_id) REFERENCES domains(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_results_domain_date ON results(domain_id, run_date);
CREATE INDEX IF NOT EXISTS idx_results_engine ON results(engine);
CREATE INDEX IF NOT EXISTS idx_visibility_domain_date ON visibility_scores(domain_id, score_date);
CREATE INDEX IF NOT EXISTS idx_schema_domain_date ON schema_audits(domain_id, audit_date);
