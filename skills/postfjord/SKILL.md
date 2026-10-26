---
name: postfjord
description: Plan, write, schedule and publish social posts through Postfjord (Instagram, Facebook, LinkedIn, Threads, TikTok, YouTube, Pinterest, X, Bluesky, Mastodon, Google Business Profile and blogs), read analytics and the publish log, draft and schedule emails, answer the Inbox, set up DM and email automations, landing pages and Flows. Use when a task mentions Postfjord, a content calendar, posting or scheduling to a connected social account, a week of posts, uploading a picture for a post, whether a post went out or how it did, an email to the list, a DM reply, or a landing page.
---

# Working with Postfjord

Postfjord is a marketing workspace for a small business: social posts, the Inbox, email and
landing pages in one place. Agents reach it through the Postfjord MCP server. Every tool is named
`postfjord_<verb>_<thing>`. Inputs and what each tool does are in
[references/tools.md](references/tools.md); read it when you need a tool you have not used yet.

## Before anything else

1. Check the server is connected: `postfjord_list_channels` should be there. If it is not:
   - Installed but signed out (a 401, "needs authentication"): Claude Code: run `/mcp`, pick
     `postfjord` and sign in. ChatGPT, Claude and Gemini: reconnect Postfjord in the app's
     connector settings.
   - Not installed: the server address is `https://mcp.postfjord.com/mcp`, and the person signs in
     with their Postfjord login, no key to copy. Steps for each app:
     https://postfjord.com/help/mcp. Never ask for a key when the app can open a browser.
2. Call `postfjord_list_channels`. It gives the channel ids to post to and each channel's limits
   (text length, hashtags, whether links work in the text, the picture shapes).
3. Call `postfjord_get_brand_profile` before you write anything, and follow its voice and
   writing rules.
4. When the connection covers several workspaces, `postfjord_list_workspaces` lists them; name the
   workspace in each call, and confirm it with the person when the request does not.

## Posts

- `postfjord_create_draft` makes a post. Without `scheduledAt` it is a draft and never goes out on
  its own. With `scheduledAt` it is scheduled and goes out at that time.
- `postfjord_schedule_post` puts a time on a draft that exists. `postfjord_update_post` changes a
  draft or scheduled post (only the fields you send), and `scheduledAt: null` makes it a draft again.
- `postfjord_bulk_update_posts` moves, unschedules, cancels or deletes many posts at once. Use it
  for "move next week back a day", not one call per post.
- `postfjord_publish_now` publishes at once to the real accounts. It cannot be undone: ask first.
- Times always carry their offset (`2026-11-02T09:00:00-05:00`) or `Z`. A time without one is
  refused. Say the time back to the person in their own time zone.
- Send `dry_run: true` to `postfjord_create_draft` or `postfjord_schedule_post` to check a post
  first: nothing is saved, and the answer lists the problems per channel.
- Pictures: every channel sends its own shape. Before scheduling, call `postfjord_preview_post` and
  show the person each channel's picture. Where a crop cuts off a head, hands or words, set that
  picture's fit to `{ "mode": "whole" }` or move its focus, then preview again.
- A picture from the web: `postfjord_upload_media` with a public https link, then use the id in
  `mediaIds`. Scheduling waits until `postfjord_get_media` says the file is ready.
- Did it go out? `postfjord_get_post` shows each channel's status and link;
  `postfjord_get_publish_log` shows every attempt and its error.
- Who writes: write the posts yourself, in the brand voice. Use `postfjord_ai_compose` only when the
  person asks for Postfjord's own composer, and `postfjord_repurpose_idea` to turn one idea or a
  blog post into a draft for every channel and an email draft at once. Both use the workspace's AI
  budget.

## Email, Inbox and automations

- Email: `postfjord_draft_campaign` makes a draft and sends nothing. `postfjord_schedule_campaign`
  sends it to real inboxes, at a time or now, and cannot be taken back: confirm the email, the
  audience and the time first. `postfjord_get_campaign_report` tells how it did.
- Inbox: `postfjord_list_conversations` and `postfjord_get_conversation` read it.
  `postfjord_draft_reply` writes a reply and sends nothing. `postfjord_send_reply` sends to a real
  person: show the exact text and wait for a yes.
- DM automations (Instagram, Facebook) start paused with `postfjord_create_automation`; email
  automations start as drafts with `postfjord_create_email_automation`. Show the person what each
  does, and switch it on (`postfjord_set_automation`, `postfjord_set_email_automation`) only after a yes.
- Landing pages: `postfjord_create_page` and `postfjord_update_page` work on a draft;
  `postfjord_publish_page` puts it online.
- Flows (a goal with steps, such as 30 people at an open house): `postfjord_plan_goal` plans and
  creates nothing; show the plan, then `postfjord_launch_goal` after a yes.

## Ask the person first

Always before these, with what will happen in plain words: `postfjord_publish_now`, scheduling a
post (`postfjord_create_draft` with a time, `postfjord_schedule_post`, a `reschedule` in
`postfjord_bulk_update_posts`), `postfjord_schedule_campaign`, `postfjord_send_reply`,
`postfjord_set_automation` or `postfjord_set_email_automation` switching something on,
`postfjord_publish_page`, `postfjord_launch_goal`, `postfjord_create_signup_form` (live at once),
and any delete. Drafts need no yes: they are how you show your work.

## When a call fails

- On a retry after a timeout, send the same `idempotency_key`: the first answer comes back and
  nothing is made or sent twice. A new action needs a new key.
- A 403 names the level the connection lacks (Read only, Drafts only, Schedule and publish). Tell
  the person; they can reconnect with a higher level. Never work around it.
- A suspended workspace answers every call with a 403: nothing can be done from here.
- Report Postfjord's message as it is. Never guess numbers: analytics come from
  `postfjord_get_analytics` and `postfjord_get_weekly_signals`, nothing else.

## Example requests

- "Plan next week: three posts for Instagram and Facebook, Tuesday, Thursday and Saturday at 9, in our voice."
- "What is scheduled for the next two weeks? Where are the gaps?"
- "Did yesterday's post go out? If something failed, tell me why."
- "Draft an email about our new fall menu and leave it as a draft."
- "Who is waiting for an answer in the Inbox? Draft a reply to each and show me before you send."
