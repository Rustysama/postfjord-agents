// Starts server.mjs without a key, the way a directory checks it, and lists its tools over stdio.
// Fails when the server does not answer, or a tool lacks a title or its read-only hint. Run: npm test
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const server = fileURLToPath(new URL('./server.mjs', import.meta.url))
const env = { ...process.env }
delete env.POSTFJORD_API_KEY
const child = spawn(process.execPath, [server], { env, stdio: ['pipe', 'pipe', 'inherit'] })

const fail = (message) => {
  console.error(`not ok: ${message}`)
  child.kill()
  process.exit(1)
}
const timer = setTimeout(() => fail('no tools/list answer within 20 seconds'), 20000)

let out = ''
child.stdout.on('data', (chunk) => {
  out += chunk
  const answers = out.split('\n').filter(Boolean).map((line) => {
    try {
      return JSON.parse(line)
    } catch {
      return null
    }
  })
  const init = answers.find((a) => a?.id === 1)
  const list = answers.find((a) => a?.id === 2)
  if (!init || !list) return
  clearTimeout(timer)
  const tools = list.result?.tools || []
  if (init.result?.serverInfo?.name !== 'postfjord') fail('serverInfo.name is not postfjord')
  if (tools.length < 50) fail(`only ${tools.length} tools`)
  for (const t of tools) {
    if (!t.title) fail(`${t.name} has no title`)
    if (typeof t.annotations?.readOnlyHint !== 'boolean') fail(`${t.name} has no readOnlyHint`)
  }
  console.log(`ok: ${tools.length} tools`)
  child.kill()
  process.exit(0)
})
child.on('error', (err) => fail(err.message))

const send = (m) => child.stdin.write(`${JSON.stringify(m)}\n`)
send({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'postfjord-agents-ci', version: '1' } } })
send({ jsonrpc: '2.0', method: 'notifications/initialized' })
send({ jsonrpc: '2.0', id: 2, method: 'tools/list' })
