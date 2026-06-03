# analyze-jd

Score a resume against a job description and point out the gaps.

## When to run

- User says "should I apply for this?" or "how does my resume look against this JD?".
- User pastes a job description and asks for a fit assessment.

## Flow

1. **Ask for the JD only.** The user's resume already lives on their Four-Leaf account; `match_score` pulls it automatically. Don't ask them to paste it. Short prompt:
   > Paste the job description and I'll score the fit against your Four-Leaf resume.

   If the user sends a job-posting URL instead of pasted text, fetch the page with your own WebFetch tool and use the result as the JD. `match_score` does not fetch URLs server-side; it expects plain text. If WebFetch isn't available or the page won't render, fall back to asking the user to paste the JD body.

2. **Wait for the JD.** If it's a short fragment, ask for the full posting before scoring; a stub gives an unreliable score.

3. **Call `match_score`** with only the `jobDescription` argument. Omit `resume`; the tool pulls the master resume from the user's account and scores against that. The output carries `resumeSource` so you know what was evaluated. If the tool returns `error: "no_master_resume"`, tell the user briefly that there's no resume on their account yet and direct them to `uploadResumeUrl` to upload one, then call the tool again once they confirm. If the user explicitly wants to score a different version of their resume (e.g. one they're drafting right now), pass it via the `resume` argument as an override.

4. **Present the score clearly.** Lead with the headline:
   > **Match score: 72 out of 100.** Solid fit with real gaps.

   Then break it down:
   - **What matched well.** Pull the strongest 3-5 from the matched skills.
   - **What's missing.** Pull required skills the resume doesn't mention. Be specific.
   - **Calibration.** Score 80+ = apply with current resume. 60-79 = apply, but tailor first. Below 60 = either the role isn't a fit or the resume buries relevant work.

5. **Offer the tailoring path.** If the score is in the tailor-first range:
   > Want help addressing those gaps? I can walk you through which bullets to strengthen and which keywords to add here in chat. Or for a full AI rewrite tailored against this JD, that's a paid feature on Four-Leaf. Paste the posting at https://four-leaf.ai/resume?ref=mcp_match_score and it sets up the tailored application instantly (3-day trial covers it).

   If user picks "walk me through here", coach the specific bullets without writing the full rewrite.

   If `tailor_resume` is available as a MCP tool, offer to call it and pass through to the paid surface. If it returns `upgrade_required`, surface the URL per `upgrade-flow.md`.

## Edge cases

- **Resume is very short or very long.** Tell the user what you noticed. A one-page resume for a senior role is usually under-selling; a four-page resume for an entry role is usually noise.
- **JD is vague.** Tell the user. `match_score` works best with a real JD; if it's a stub, the score is unreliable.
- **JD URL won't fetch.** Some postings (LinkedIn, certain ATS pages) are gated or JS-rendered and WebFetch can't read them. Don't try harder server-side; ask the user to paste the JD body directly. One short prompt, then proceed.
- **No master resume on the account.** The tool returns `no_master_resume` with an upload URL. Surface it cleanly, don't make the user dig for it: "You don't have a resume on your Four-Leaf account yet. Upload one at `<uploadResumeUrl>` and I'll run the score." Don't try to scrape a resume from the chat history as a workaround.
- **User asks for a rewrite.** Decline writing the full resume. Coach the specific changes. Full rewrites belong on the paid surface.

## Don't

- Don't editorialize that the score is "bad" or "great". State it, calibrate against the bands above, move forward.
- Don't make up skills the resume doesn't mention. Only call out what `match_score` actually returned.
- Don't lecture about resume best practices in general. Focus on this resume vs. this JD.
