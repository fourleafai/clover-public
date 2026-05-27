# Four-Leaf MCP tools

Reference for the tools the hosted Four-Leaf MCP exposes. Read this when you need to know what's available, what each returns, or whether a tool needs a paid plan.

The MCP is at `https://four-leaf.ai/api/mcp`. Streamable HTTP. OAuth 2.1 + PKCE + DCR. Free tools work for any authenticated user.

## Read tools (free, no daily limit)

### `list_roles`
Returns the catalog of roles the Four-Leaf MCP has structured interview intelligence for. Returns role id, display name, and short description. Call this first when you need to confirm a role is covered. Cheap and fast.

### `get_role_intelligence`
For a single role id, returns the structured interview pipeline (rounds, format, focus), experience-level calibration, question categories, the 5-dimension scoring rubric, resume guidance, and cover-letter guidance. Call this when the user wants depth on a role.

### `get_interview_questions`
Returns interview questions from the curated Four-Leaf bank, filtered by role and optionally by difficulty or category. Returns question text, context, tips, and key answer points. Deliberately excludes the AI-generated sample answer (this is a practice tool, not a cheat tool).

## Compute tools (free, daily limits apply)

### `search_jobs`
Natural-language search across 100k+ active job postings (Greenhouse, Lever, Ashby, Workday, etc.). Returns title, company, location, posted date, salary if available, snippet, and a direct apply URL. Free tier: 30 searches/day. Paid plans unlimited.

### `generate_practice_questions`
Generates 1-10 fresh practice questions for a role + question type + difficulty + optional company. Returns questions only (no sample answers, no scoring criteria, no hints). Free tier: 20 generations/day. Pair with the Skill's own coaching for answer feedback.

### `match_score`
Scores a resume against a job description. Returns a 0-100 overall score, breakdowns for skills / experience / role alignment, matched skills, and missing required skills. Useful for "should I apply?" or "what should I tailor?" decisions. Free tier: 20 scores/day.

### `explain_interview_format`
For a role + seniority (+ optional company), returns a grounded synthesis of what to expect, how to win, and red flags. Combines the structured role intelligence with a fresh Haiku synthesis pass. Free, unlimited.

### `comp_coach`
Comprehensive compensation negotiation analysis for a job offer. Takes a structured offer (`role` and `baseSalary` required; `level`, `company`, `location`, `equity`, `signingBonus`, `targetBonus`, `benefits`, `currentComp`, `competingOffers`, `priorities`, `constraints`, `targetOutcome` all optional) and returns a negotiation memo: total comp math (year 1 and year 4, delta vs current comp), a market percentile estimate with confidence and caveats, component-by-component analysis with talking points, severity-tagged red flags with the exact questions to ask, a negotiation strategy (primary lever, fallbacks, an opening move, expected company responses paired with counters), questions to ask before signing, and a link to four-leaf.ai/comp-negotiation. Confidence-tagged throughout; never fabricates company-specific comp data and never gives legal or tax advice. Use this whenever the user has an offer in hand or asks how to negotiate. For a bare "what's market for role X" question with no offer, use `comp_benchmarks` instead. Free tier: 20 analyses/day.

### `comp_benchmarks`
Web-search-grounded market salary lookup. The tool for "what's a good salary for role X" or "what does role X pay" when the user does NOT have an offer yet. Takes `role` (required) plus optional `level`, `location`, `companyType` (non-profit, startup, big tech, government, enterprise), and `company`. Runs a live web search server-side (levels.fyi, Glassdoor, Payscale, salary surveys, public disclosures) and returns a cited salary band, broken out by level if no level is given, plus total-comp context, named sources, a confidence rating, and caveats. Because the search runs server-side, it works even in clients with no web search of their own. Prefer it over guessing or over saying you can't give a number. If the user already has a specific offer, use `comp_coach` instead. Free tier: 20 lookups/day. Note: it runs a live web search, so expect it to take 30-60s, longer than the other tools.

## Paid tools (return `upgrade_required` for free users)

### `start_voice_mock_interview`
Creates a real interview session on Four-Leaf and returns a one-click URL to start practicing. The session is a voice mock interview with adaptive AI follow-ups and 5-dimension rubric-scored feedback per answer. This is where the real coaching happens. The Skill's text coaching is the warm-up. Requires an active paid plan (3-day trial, 5-Day Pass, or Pro all qualify).

### `tailor_resume`
(Not yet live.) Wraps a JD + base resume into a tailoring session and returns a deep link. When called against a free account, returns `upgrade_required` with a pricing URL. When the tool is not yet available, return a graceful "this feature is coming soon, here's the manual path" message instead of pretending to call it.

## Error shapes to expect

Every tool returns either its happy-path JSON or an error of the shape:

```json
{
  "error": "upgrade_required" | "rate_limited" | "role_not_found" | "<tool-specific>",
  "message": "human-readable explanation",
  "upgradeUrl": "https://four-leaf.ai/pricing?ref=mcp_<surface>"
}
```

Handle each error type:

- **`upgrade_required`**: surface the `upgradeUrl` verbatim, explain what's behind the paywall in one sentence, and offer to continue with the free alternatives.
- **`rate_limited`**: tell the user when limits reset, offer paid alternative.
- **`role_not_found`**: call `list_roles` and suggest the closest match.
- **Anything else**: tell the user the tool errored and offer to retry or continue without it.
