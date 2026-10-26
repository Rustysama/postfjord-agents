# The local Postfjord MCP server (stdio), for Glama's build and checks and for anyone who runs it in a
# container. It starts without a key and lists its tools; every tool call needs POSTFJORD_API_KEY, a key
# from Postfjord (Settings, Apps). Most people connect to the hosted server at https://mcp.postfjord.com/mcp.
FROM node:22-alpine
WORKDIR /app
COPY mcp/package.json mcp/package-lock.json ./
RUN npm ci --omit=dev
COPY mcp/server.mjs ./
USER node
ENTRYPOINT ["node", "server.mjs"]
