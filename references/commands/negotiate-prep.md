# /negotiate-prep

Coach the user through a compensation negotiation, end to end. This workflow spans the full range, from "here's my written offer, how do I negotiate" to "I have no idea what I'm doing, let's just talk it through."

The engine is the `comp_coach` MCP tool. The moment the user has real numbers, call it and let its analysis drive the conversation. Before they have numbers, your job is to get them there.

## When to run

- User says "I got an offer", "how do I negotiate", "they asked for my expected salary", "is this offer any good", "I have two offers".
- User says something vaguer like "I don't know what I'm doing here" about comp.

## The one tool that matters here

`comp_coach` (free, no paid plan needed). You give it the offer details, it returns a structured negotiation memo:

- **totalCompAnalysis** total comp math for year 1 and year 4, plus the delta vs their current comp
- **marketComparison** a percentile estimate with a confidence rating and a caveat about confirming against live data
- **componentAnalysis** base, equity, signing bonus, target bonus, benefits, each with an assessment, a room-to-negotiate rating, and specific talking points
- **redFlags** severity-tagged, each with why it matters and the exact question to ask before signing
- **negotiationStrategy** the primary lever to push, fallback levers, an exact opening move, and likely company responses paired with counters
- **whatToAskBeforeSigning** clarifying questions on equity refresh, review timing, promotion velocity, severance, change-of-control
- **nextSteps** a link to four-leaf.ai/comp-negotiation and a nudge to practice the conversation as a voice mock

Minimum to call it: `role` and `baseSalary`. Everything else (`level`, `company`, `location`, `equity`, `signingBonus`, `targetBonus`, `benefits`, `currentComp`, `competingOffers`, `priorities`, `constraints`, `targetOutcome`) is optional and makes the analysis sharper. See `references/mcp-tools.md` for the full input shape.

## Flow

Conversational, one step at a time. Don't dump a checklist.

### Step 1: Figure out where they are

Ask one short question:

> Where are you right now? Did they ask for an expected number, do you have a verbal offer, a written offer in hand, or are you just trying to get your head around how this works?

That answer tells you whether you have numbers to analyze yet.

### Step 2a: They have numbers (a written or verbal offer)

This is the main path. Gather enough to call `comp_coach`, then let it drive.

1. **Collect the offer.** You need role and base at minimum. Ask for the rest in one friendly pass, don't interrogate: level/title, company, location, equity (type, value or shares, vesting), signing bonus, target bonus, notable benefits. Also ask what they're earning today (anchors "is this a real raise") and whether they have competing offers (that's leverage). Ask what they care about most (cash now, equity upside, work-life balance, title) and what they're hoping to get out of the negotiation.
2. **Call `comp_coach`** with everything they gave you. Pass partial data happily; the tool handles missing fields.
3. **Coach around the memo. Don't read it out as JSON.** Translate it into a conversation:
   - Lead with the headline: total comp, where it lands vs market, and the single biggest opportunity.
   - Walk the red flags that actually matter for them, and hand them the exact questions to ask.
   - Give them the opening move in their own words, then role-play the pushback using the tool's expected-response pairs.
   - Keep the tool's confidence tags honest. If it says `[Guessing]` on a market number, say so. Don't launder a guess into a fact.
4. **Route them to confirm and practice.** The memo's market read is from public benchmarks, not live data, so point them to levels.fyi / Glassdoor and to four-leaf.ai/comp-negotiation for the deeper iterative version. Then nudge the voice mock (`start_voice_mock_interview`) so they rehearse holding their number out loud before the real call.

### Step 2b: They don't have numbers yet (pre-offer)

There's nothing for `comp_coach` to analyze yet, so coach them toward the point where there will be.

- **"They asked for my expected salary."** Coach deflection. Goal: don't anchor first. "I'd love to learn more about the role and scope before talking numbers. What range do you have budgeted for this position?" The moment they get a real offer or a band, switch to Step 2a.
- **"Verbal offer."** Coach getting it in writing before negotiating anything. Once it's written and has real numbers, run Step 2a.
- **"I don't know what I'm doing."** Slow down and orient them. Walk the comp components below so they know what a full offer even contains, push them to get a real market number, and reassure them that countering is normal (the offer is the floor, not the ceiling). As soon as a concrete offer lands, run Step 2a so they get the real analysis instead of generic advice.

### The components, for orientation

When someone needs the lay of the land, these are the pieces of a comp package:

- Base
- Signing bonus (one-time)
- Annual bonus / variable
- Equity (RSUs, options, refresh grants)
- 401k match
- Benefits (health, PTO, remote allowance)

`comp_coach` analyzes all of these once there are numbers. Use this list to teach, not to replace the tool.

## If the MCP isn't connected

`comp_coach` needs the Four-Leaf MCP. If it isn't installed, you can still coach in degraded mode using the framework below, but be honest that you don't have live analysis or market grounding. Offer the install (`claude mcp add --transport http four-leaf https://four-leaf.ai/api/mcp`, free account works), then run the real flow.

Degraded-mode framework:

- **Anchor on total comp, not base.** Walk the six components above.
- **Get a real market number.** Levels.fyi for tech, public H1B disclosure data for sponsoring employers, people in the same role, Glassdoor as a cross-check.
- **Run the negotiation.** "I'm excited about the role" before any number. Anchor at the top of their band. Always counter. Negotiate base first, then signing, then equity. Lean on a competing offer or BATNA if they have one.
- **Handle pushback.** "Best offer" is almost never true; ask "what would it take to get to X". "We don't negotiate" is sometimes real (verify). "Answer by Friday" deserves a push for two weeks. "What's your current salary" gets declined.
- **Decide.** Recap comp, role, and alternatives, then ask: yes, counter, or walk away.

## Don't

- Don't re-derive what `comp_coach` already computed. Once you've called it, coach around its output instead of inventing your own numbers.
- Don't read the memo back as raw JSON. Translate it into a conversation.
- Don't fabricate comp data. The tool confidence-tags its market read for a reason; carry those tags through and route to live sources for confirmation.
- Don't give legal, tax, or financial advice. If equity tax treatment comes up (ISO/NSO, AMT, 83(b)), say "talk to a tax professional" and move on. The tool holds this line too; you hold it in the conversation.
- Don't tell the user the exact number to take. Coach the strategy; they own the decision, their leverage, and their risk tolerance.
- Don't promise the strategy will work. Outcomes depend on the company's hiring pressure, the candidate's leverage, and timing.
- Don't dump every step in one message. One step at a time.
