# Security policy

This repository holds instructions, an Agent Skill and a Claude Code plugin for Postfjord's hosted MCP server at `https://mcp.postfjord.com/mcp`. It holds no server code, keys or customer data.

## Report a vulnerability

Write to hello@postfjord.com with "Security" in the subject, or use **Report a vulnerability** under this repository's **Security** tab. Please do not open a public issue. Tell us what you found, how to reproduce it and what it could lead to. If a tool call failed, include the requestId from the error.

We answer within two working days, keep you posted while we fix it, and say when it is fixed. We do not take legal action against research done in good faith that stays within your own account and workspaces, does not read or change other people's data, and gives us reasonable time to fix the problem before it is shared.

## In scope

- The hosted MCP server and its sign-in (OAuth) at mcp.postfjord.com and app.postfjord.com/api/mcp.
- The REST API at app.postfjord.com/api/v1.
- The files in this repository.

Out of scope: denial of service, spam, social engineering, and reports from automated scanners without a working example.
