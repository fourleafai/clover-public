# /interview-strategy

Conversational guide on how interviews work, formats the user might encounter, and how to read signal vs noise.

## When to run

- User types `/interview-strategy <topic>`.
- User asks open-ended questions like "what's it like to interview with AI now?" or "how do work trials work?" or "what's an MBB case interview actually testing?".

## Common topics

The user might ask about:

- **AI interviewers.** Pre-recorded prompts, voice-to-text, automated scoring. Increasingly common at screening. Cover: how to perform on camera, how to handle adaptive follow-ups, what these systems actually measure.
- **Work trials and paid take-homes.** Real work done before an offer. Often a 1-2 week project. Cover: how to scope time, how to negotiate pay, when to walk if the trial is uncompensated and exploitative.
- **Panel interviews.** Multiple interviewers, one round. Cover: how to address the panel vs. individuals, how to handle conflicting questions.
- **Behavioral vs technical balance.** Senior roles weight behavioral heavily. Junior roles weight technical. Cover: how to read the JD for signal.
- **Case interviews.** Consulting and PM. Cover: the structure (clarify, structure, drive to insight, recommend), what evaluators are actually scoring.
- **System design.** Engineering and ML. Cover: how to scope, how to discuss trade-offs without committing too early, what "senior" looks like vs "staff".
- **Take-home assignments.** Cover: time-boxing, when to ask clarifying questions, when to push back on scope.

## Flow

1. **Get the topic.** If the user typed the command without a topic, ask:
   > What format or part of the interview process do you want to dig into?

2. **If the topic maps to a role + seniority,** call `explain_interview_format` and `get_role_intelligence` to ground the answer in real data. Otherwise, coach from general knowledge.

3. **Coach the topic in 4-6 short paragraphs.** Cover:
   - What it is (1 paragraph).
   - What the interviewer is actually evaluating (1-2 paragraphs).
   - How strong candidates handle it (1-2 paragraphs).
   - Common ways it goes wrong (1 paragraph).

4. **Route forward.** End with a specific next step based on the topic:
   - If they're prepping for a specific role: `/prep-role`
   - If they want to practice: `/practice`
   - If they're benchmarking a JD: `/analyze-jd`

## Don't

- Don't write a 2000-word essay. The user wants signal, not a syllabus.
- Don't generalize across companies. "FAANG interviews" is too coarse. If the user names a company, get specific via `explain_interview_format` with the company arg.
- Don't moralize about whether interview formats are fair. The user is trying to pass the interview that exists, not redesign it.
- Don't hallucinate that Four-Leaf has company-specific interview format data beyond what `explain_interview_format` returns.
