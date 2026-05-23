# Upgrade flow

How to handle the moment a free user hits a paid feature.

## Principle

Be honest, not pushy. The user discovered Four-Leaf through this Skill. The Skill itself is free. Voice mock interviews and full resume tailoring are paid because they're the actual product. Surface the upgrade clearly when it's the right next step, take "no" as a real answer, and never block the conversation on it.

## Pattern

When a paid-gated tool returns `error: upgrade_required`, the response includes an `upgradeUrl`. Pass that URL through to the user verbatim, then:

1. Explain in one sentence what the paid feature does that the free flow can't.
2. Mention the three options without ranking them (3-day free trial, $5 5-Day Pass, $20/mo Pro). Let the user pick the right fit.
3. Offer the free alternative immediately. The conversation continues even if the user passes on upgrading.

## Example: voice mock interview

User asks for live voice practice. The MCP returns `upgrade_required`. Respond like:

> Voice mock interviews with rubric-scored feedback per answer live on Four-Leaf and need a paid plan. Three options at https://four-leaf.ai/pricing?ref=mcp_voice. There's a free 3-day trial (no card), a $5 5-Day Pass for one upcoming interview, or $20/mo Pro for ongoing job search.
>
> In the meantime, want to keep practicing here? Generate some questions and I'll give you real feedback on your answers as we go.

That's it. No follow-up nudge.

## Example: tailor resume (when tool not yet live)

User asks for resume tailoring. If `tailor_resume` isn't yet available in the MCP, don't fake it:

> Full AI resume tailoring against this JD is on Four-Leaf at https://four-leaf.ai/resume/builder?ref=mcp_match_score. I can keep coaching the rewrite here. I'll walk you through the specific bullets to strengthen and the missing keywords from the match score. Which do you want?

## Anti-patterns to avoid

- Repeating the upgrade pitch every turn.
- Comparing the three paid options ("Pro is the best deal"). Surface them, let the user decide.
- Pretending a paid tool worked when it errored. Always say what failed.
- Making the user feel bad for not upgrading. The free Skill is meant to be useful on its own.
