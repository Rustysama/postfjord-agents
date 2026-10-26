# Postfjord for AI agents

Official agent tooling for [Postfjord](https://postfjord.com), the marketing workspace for small businesses. Agents plan, write, schedule and publish posts on Instagram, Facebook, LinkedIn, Threads, TikTok, YouTube, Pinterest, X, Bluesky, Mastodon and Google Business Profile, read analytics and the publish log, draft and schedule emails, answer the Inbox, and set up DM and email automations, landing pages and Flows.

| Folder | What it is |
|---|---|
| `plugin/` | Claude Code plugin: the skill plus the hosted MCP server |
| `skills/postfjord/` | The postfjord Agent Skill, for any agent that reads skills |
| `skills/postfjord/references/tools.md` | Every tool, what it does and what it reaches, generated from the server's own definitions |
| `mcp/` | The same tools as a local MCP server (stdio), for apps that run servers themselves, with a `Dockerfile` |

## Connect

The hosted MCP server needs nothing installed and no key pasted. Add this address to your app:

```
https://mcp.postfjord.com/mcp
```

The first time, your browser opens Postfjord: sign in, pick the workspace and what the app may do (Read only, Drafts only, or Schedule and publish), and press Allow. It is OAuth 2.1 with PKCE and dynamic client registration. You need to be an owner of the workspace, on a plan with the API (Solo or bigger).

**ChatGPT**: open Plugins, press +, pick Add custom MCP server (turn on developer mode in the settings if you do not see it), paste the address, choose OAuth and create it as a plugin.

**Claude** (claude.ai, Claude Desktop and the mobile apps): open Customize, then Connectors, press Add custom connector, paste the address, press Add and then Connect.

**Gemini**: in the Gemini app, Settings, Connected Apps, Add a custom app. In Gemini CLI, add `"postfjord": { "httpUrl": "https://mcp.postfjord.com/mcp" }` under `mcpServers` in `~/.gemini/settings.json` and run `/mcp auth postfjord`.

**Claude Code**, the skill and the server in one install:

```
claude plugin marketplace add Rustysama/postfjord-agents
claude plugin install postfjord@postfjord
```

**Codex, Cursor, VS Code, Grok Bot, Hermes Agent and other apps**: step by step instructions for each are at [postfjord.com/help/mcp](https://postfjord.com/help/mcp). Apps that cannot open a browser take a key from Postfjord, Settings, Apps, sent as `Authorization: Bearer pf_live_...`.

**Local server** (stdio), for apps that start MCP servers themselves. It takes a key from Postfjord, Settings, Apps, and reads pictures and videos from your own disk for `postfjord_upload_media`:

```
cd mcp && npm install
claude mcp add postfjord -e POSTFJORD_API_KEY=pf_live_... -- node /path/to/postfjord-agents/mcp/server.mjs
```

Or in a container: `docker build -t postfjord-mcp .` and `docker run -i --rm -e POSTFJORD_API_KEY=pf_live_... postfjord-mcp`.

**Skill only**, for agents that read skills: copy `skills/postfjord` into your agent's skills folder, or run `npx skills add Rustysama/postfjord-agents`.

## Example requests

"Plan next week: three posts for Instagram and Facebook, Tuesday, Thursday and Saturday at 9 New York time, in our voice. Leave them as drafts."

"What is scheduled for the next two weeks, and where are the gaps?"

"Did yesterday's post go out? If something failed, tell me why."

"Which posts did best last month? Plan three more like them."

"Draft an email about our fall menu with the latte photo and a button to the menu page."

"Who is waiting for an answer in the Inbox? Draft a reply to each and show me before you send."

## Safety

The person chooses the level of every connection at sign-in. **Read only** changes nothing. **Drafts only** writes drafts, adds pictures and builds paused automations, and nothing it makes can go out. **Schedule and publish** may also put a time on a post, publish, send an email or a reply, and switch an automation on. A connection works in one workspace, or in each workspace where the person is an owner if they allow that, and only as far as their role there allows, checked on every call.

Agents manage marketing, not the account: no tool reaches billing, plans, team members, API keys, the workspace's settings or its connected social accounts, and none removes a post that already went out.

`postfjord_create_draft` saves a draft unless a time is set. `postfjord_publish_now` is the only tool that posts at once. The skill tells the agent to ask the person before anything goes out: publishing or scheduling a post, scheduling an email, sending a reply, switching an automation on, publishing a page or launching a Flow.

Every tool declares `readOnlyHint`, `destructiveHint` and `openWorldHint`, set from what it does: `destructiveHint` on tools that edit, cancel or delete what exists, and `openWorldHint` on tools that can put something on a platform, in an inbox or on a public page, or fetch a file from a link. Apps that honor these hints, Claude among them, ask before such a call.

Tools that make or send something take an `idempotency_key`, so a retry after a timeout never posts or sends twice, and times must carry their time zone. Connected apps are listed, with the time they were last used, and revoked in Postfjord under Settings, Apps, Your keys.

## Privacy

Postfjord processes the posts, media, emails, conversations and analytics a tool call reads or writes for the workspace the connection covers, and nothing from the conversation beyond each call's arguments. The [privacy policy](https://postfjord.com/privacy) explains what is collected, how it is used and kept, and who it is shared with. Postfjord is run from Sweden and keeps its data in the EU. [Terms](https://postfjord.com/terms).

## Support

Write to hello@postfjord.com, use the [contact page](https://postfjord.com/contact), or open an issue in this repository. Report security problems privately to hello@postfjord.com rather than in a public issue.

## License

MIT. Copyright (c) 2026 Yogakollektivet Sverige AB.
