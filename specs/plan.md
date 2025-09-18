Briefify (working title) — YouTube Insights POC

Goal: A mobile-first web app where a user pastes a YouTube URL, the app fetches transcript + comments via Apify, stores them in Convex, and generates selectable summary “templates” (mock email preview for now). No auth. PostHog installed for analytics. Deploy on Vercel.
Note: Name is a placeholder; we can rebrand later.

0) TL;DR for Claude Code

Stack: Next.js (or Vite+React) + Convex (DB, actions, crons) + Apify (actor you already have) + PostHog (analytics).

Flow: Paste URL → Convex action calls Apify actor → store transcript/comments → run chosen summary template → display results + mock email preview.

Out of scope today: actual emails/SMS/Discord (simulate only).

Must-haves: Mobile-first UI, no login, PostHog events, clean skeleton for future schedulers (daily/weekly/monthly).

1) Product Scope (MVP)

User Stories

As a tester, I paste a YouTube URL and click “Generate.”

I select a summary template (e.g., Bullet Highlights, Concise Paragraph, Sentiment Pulse, Q&A).

I see: video metadata, transcript (collapsible), comment insights (top themes/sentiment), and a mock email preview.

I can save this run and view it later on a simple “History” screen.

I can toggle a schedule (mocked) for daily/weekly/monthly—UI appears and stores preference; cron wiring is scaffolded (can be enabled later).

Non-Goals (today)

Real email/SMS/Discord sending.

User accounts/auth.

Full moderation pipeline.

2) Architecture Overview

Frontend: Next.js (App Router) or Vite+React; mobile-first; calls Convex functions; sends PostHog events.

Backend: Convex

actions/ for external calls (Apify, future email/SMS/Discord).

mutations/ for writes (videos, transcripts, comments, summaries, preferences).

queries/ for reads (detail view, history).

crons/ scaffold (schedules stored, jobs stubbed).

External: Apify actor (existing), PostHog JS.

3) Environment & Secrets

Create .env.local (frontend) and Convex env vars.

Frontend (public where needed)

NEXT_PUBLIC_POSTHOG_KEY=...

NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com (or self-hosted)

Convex (server)

APIFY_TOKEN=...

APIFY_ACTOR_ID=... (your actor slug/id)

(future) SENDGRID_API_KEY / TWILIO_* / DISCORD_WEBHOOK_URL (not used today)

4) Data Model (Convex tables)

(Use clear, small collections—optimize later.)

videos

_id, createdAt

url (string), videoId (string), title (string), channel (string), publishedAt (date?)

status (“pending” | “ready” | “error”)

meta (object) – duration, view count, etc. (optional)

transcripts

_id, videoId (ref -> videos), language (string), text (string), chunks ([{start,end,text}]) (optional)

comments

_id, videoId (ref), count (number), sample ([{author,text,likes,publishedAt,replyCount}])

summaries

_id, videoId (ref), template (“bullets” | “paragraph” | “sentiment” | “qa”), content (string/markdown), createdAt

preferences

_id, videoId (ref)

frequency (“none” | “daily” | “weekly” | “monthly”)

channels ({ email: false, sms: false, discord: false })

email (string?) phone (string?) discordChannel (string?) (placeholders)

events (optional audit trail)

_id, type, videoId, detail (object), at

Minimalist schema is fine—iterate as needed.

5) Core Workflows
A) Ingest (URL → Apify → Convex)

Frontend sends url to actions/ingest.fetchYouTube(url).

Action:

Parse videoId.

Call Apify actor with options: include transcript, fetch top N comments (e.g., 50–100), basic metadata.

Upsert videos, transcripts, comments.

Set videos.status = "ready".

Return basic payload (ids + metadata).

B) Summarize (Template → Content)

User selects template in UI.

Call mutations/summarize.generate({videoId, template}).

On server: retrieve transcript + comments; run lightweight server logic for now (no external LLM required today or use minimal prompt to a model if enabled).

Store in summaries; return content.

C) Mock Email Preview

queries/summaries.getLatest(videoId) returns latest summary by template.

Frontend “Email Preview” renders simple HTML block (no sending).

PostHog capture: email_preview_opened.

D) Schedules (Scaffold only)

UI toggles frequency; store in preferences.

crons/summary.cron() stubbed with examples (daily/weekly/monthly) → for now no-op or logs event.

6) Apify Actor Contract (assume existing)

Input we’ll pass (example fields):

urls: [url]

includeVideoTranscript: true

maxVideoComments: 100

includeReplies: false (for speed)

(Any actor-specific flags you already support)

Expected output fields to map:

title, channelName, publishedAt, videoId

transcript: { language, text, segments[] } OR text

comments: [{ author, text, likes, publishedAt, replyCount }]

Note: If your actor’s fields differ, adapt in ingest.fetchYouTube.

7) Summary Templates (server-generated, no code required here)
1) Bullet Highlights (5–8 bullets)

Focus: core ideas, actionable points.

Output example (markdown):

“• The creator outlines X…”

“• Key technique Y at 07:42…”

2) Concise Paragraph

3–5 sentences capturing thesis, structure, and conclusion.

3) Sentiment Pulse (from comments)

1 short paragraph: overall tone (positive/neutral/negative) + 2 common themes.

Optional: “Top liked comment (paraphrased): ‘…’”

4) Q&A Snapshot

3 Q&As:

Q: What’s the core idea? A: …

Q: What do viewers praise? A: …

Q: What confuses viewers? A: …

Keep outputs short and skimmable. Store final text in summaries.content.

8) UX Spec (Mobile-first)

Home (URL Input)

Header: “Briefify (working title)”

Input: YouTube URL (paste)

Button: “Generate”

State: progress indicator (“Fetching transcript & comments…”)

Result View

Video card: title, channel, published date

Tabs/segmented control:

Summary (template selector dropdown)

Comments (themes, top likes)

Transcript (collapsible, search filter)

Summary template selector → reruns summary + shows result

“Mock Email Preview” button → modal with rendered summary body

History

List of processed videos (title, date)

Tap → open Result View

Settings (light modal)

Frequency: None / Daily / Weekly / Monthly (stores in preferences)

Channels (disabled toggles for Email/SMS/Discord with “coming soon” labels)

PostHog consent toggle (if needed internally)

Empty/Error States

Friendly guidance copy, retry button.

9) Analytics (PostHog) — Events & Props

Fire these from the frontend:

app_opened { ts }

url_submitted { urlDomain, hasQueryParams }

ingest_started { videoId? }

ingest_completed { videoId, transcriptLen, commentCount }

ingest_failed { reason }

template_selected { template }

summary_generated { template, contentLength }

email_preview_opened { template }

schedule_set { frequency }

view_history_opened {}

Add pageview autocapture and (optional) session recording.

10) Scheduling (Convex crons) — Scaffold Plan

Define “summaryScheduler” with three examples:

Daily: 13:00 UTC

Weekly: Mon 13:00 UTC

Monthly: 1st 13:00 UTC

Cron looks up preferences where frequency != "none" and logs what it would send (no actual sends today).

Leave TODOs to call ingest.fetchYouTube (fresh comments only), regenerate summary, then call delivery channel (email/SMS/Discord) when enabled.

11) Delivery Channels (Stubs)

Email: actions/deliver.email({videoId, summaryId}) → stub: return HTML string & log

SMS: actions/deliver.sms({videoId, summaryId}) → stub: log only

Discord: actions/deliver.discord({videoId, summaryId}) → stub: log only

Wire buttons in UI to call these stubs and show a toast “Simulated send”.

12) Acceptance Criteria (MVP)

Paste URL → see ready state with:

Video metadata, transcript (collapsible), comments sample count.

Can switch between 4 summary templates, content updates instantly.

Mock Email Preview displays current summary in a simple HTML block.

PostHog shows events for submit, complete, template selects, preview open.

Preferences persist frequency choice (no real crons needed yet).

Deployed to Vercel with environment variables working.

13) Test Plan (Manual)

Paste a valid YouTube URL (short + long forms).

Observe loading, then “ready” status.

Toggle templates, verify content changes each time.

Open Email Preview; copy content; check formatting.

Try a video with no comments → Sentiment template should degrade gracefully.

Try a video without transcripts → Show fallback message; still allow comment-based summaries.

Submit an invalid URL → error state + helpful guidance.

Inspect PostHog dashboard for captured events and funnel.

14) Risks & Mitigations

YouTube ToS (scraping): We’re using Apify; keep usage light, label as internal prototype. Consider YouTube Data API for comments later.

Very long transcripts/comments: Cap comments (e.g., 100) and collapse transcript UI.

Naming collision (Briefify): Treat as working title; rebrand before public scale.

Email deliverability: Mock only today; integrate Resend/SendGrid later with verified domain.

15) Roadmap (Next 1–2 weeks)

Day 1–2

Frontend skeleton (Home/Result/History), Convex schema, ingest action, basic summary generators (rule-based or minimal LLM promps if desired), PostHog wiring, deploy to Vercel.

Day 3–5

Improve comment insights (themes, top likes), transcript search filter, polish mobile layout, add schedule UI + cron stubs, add History persistence.

Day 6–7

Refine summary templates, add “copy to clipboard,” basic empty/error states, stabilize analytics, demo run.

Stretch

Real email via Resend/SendGrid; Slack/Discord webhook; daily cron for new uploads on specific channels.

16) Copy & Micro-UX (examples)

URL placeholder: “Paste a YouTube link…”

Generate button: “Generate Summary”

Template labels: “Bullet Highlights · Concise Paragraph · Sentiment Pulse · Q&A Snapshot”

Mock email CTA: “Preview Email”

Empty comments: “We didn’t find comments worth highlighting yet.”

No transcript: “No transcript detected—try the Sentiment template.”

17) Claude Code – Suggested Tasks (no code, just intent)

Create Next.js app (or Vite) with Tailwind; set up PostHog provider in _app or root.

Initialize Convex; define collections and sample data schemas.

Implement actions/ingest.fetchYouTube(url) calling Apify actor; map results to DB.

Implement mutations/summarize.generate({videoId, template}) returning stored summary.

Implement queries/videos.get(videoId), queries/summaries.getLatest(videoId), queries/videos.listRecent().

Build pages/components: URLForm, VideoCard, TemplatePicker, SummaryView, TranscriptPanel, CommentsPanel, EmailPreviewModal, HistoryList.

Add PostHog events at key user actions.

Add crons/scheduler with stubs for daily/weekly/monthly.

Prepare .env handling for PostHog & Apify.

Deploy to Vercel; verify events and flows.

18) Naming (Working Title)

Briefify (working) — we can rebrand later. Keep UI branding minimal (just a header) to reduce rename cost.

19) Success Criteria (POC)

End-to-end run < ~20s for typical videos (100 comments cap).

Stakeholders can complete a full flow on mobile without guidance.

PostHog shows >80% completion from URL submit → summary viewed.

At least 2 templates feel “useful” per stakeholder feedback.

Appendix: Future Channels (outline)

Email: Resend/SendGrid in Convex action; store delivery logs.

SMS: Twilio; 160-char summary + link to full view.

Discord: Channel webhook; post summary with title + link.