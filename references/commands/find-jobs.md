# /find-jobs

Natural-language search across 100k+ active job postings.

## When to run

- User types `/find-jobs` (with or without a query).
- User says something like "find me senior frontend roles, remote, $180k+" or "what's hiring for data engineers in Austin?".

## Flow

1. **Get the query.** If the user typed the command without a query, ask one short question:
   > What are you searching for? Try a role plus filters like remote, location, salary, or company size.

2. **Call `search_jobs`** with the user's query as-is. The tool handles parsing the natural language; don't pre-process it.

3. **Present the top results.** Format as a short list, each entry with:
   - Title
   - Company
   - Location (and "Remote" if applicable)
   - Posted date as relative time (e.g., "3 days ago")
   - Salary if available
   - Apply URL (always, since that's the value)

   Cap at 5. Mention how many more matched if the list was truncated.

4. **Offer refinement.** End with one of:
   > Want me to narrow by company, salary, or seniority?
   > Want me to look at a different role or location?

## Edge cases

- **Zero results.** Don't apologize. Ask for one specific adjustment ("try a different location or drop the salary floor?").
- **Rate-limited.** Free tier is 30 searches/day. Tell the user when it resets and that paid plans are unlimited.
- **The user names a specific company.** `search_jobs` handles company filters in the natural language. If they want deeper company-specific intel beyond what's in the postings, route to `/prep-role` or `/interview-strategy` and pass the company name.

## Don't

- Don't summarize the postings into your own paragraph. The user wants the actual listings to click through.
- Don't editorialize on the companies or the salary bands. Just present what `search_jobs` returns.
- Don't follow up with "want me to apply for you?". You can't, and the apply URL goes straight to the company's ATS.
