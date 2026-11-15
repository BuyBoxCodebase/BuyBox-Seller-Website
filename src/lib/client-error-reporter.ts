import { useAuthStore } from '@/stores/authStore'

// Keeps the last few console messages in memory so that when the 500 page appears we can
// send what the seller's browser was logging at that moment, together with the error.

type Level = 'log' | 'info' | 'warn' | 'error'
interface ConsoleEntry {
  level: Level | 'window-error' | 'unhandled-rejection'
  time: string
  message: string
}

const MAX_ENTRIES = 60
const MAX_MESSAGE = 1000
const buffer: ConsoleEntry[] = []
let installed = false
let lastReport = { key: '', at: 0 }

function redact(text: string) {
  return text
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/gi, 'Bearer [REDACTED]')
    .replace(/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]*/g, '[REDACTED_JWT]')
}

function stringify(value: unknown): string {
  if (value instanceof Error) return `${value.name}: ${value.message}\n${value.stack ?? ''}`
  if (typeof value === 'string') return value
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

function push(level: ConsoleEntry['level'], args: unknown[]) {
  try {
    const message = redact(args.map(stringify).join(' ')).slice(0, MAX_MESSAGE)
    buffer.push({ level, time: new Date().toISOString(), message })
    if (buffer.length > MAX_ENTRIES) buffer.shift()
  } catch {
    // never let logging break the app
  }
}

export function installConsoleCapture() {
  if (installed || typeof window === 'undefined') return
  installed = true

  ;(['log', 'info', 'warn', 'error'] as const).forEach((level) => {
    const original = console[level].bind(console)
    console[level] = (...args: unknown[]) => {
      push(level, args)
      original(...args)
    }
  })

  window.addEventListener('error', (event) =>
    push('window-error', [event.message, event.filename && `${event.filename}:${event.lineno}`])
  )
  window.addEventListener('unhandledrejection', (event) =>
    push('unhandled-rejection', [event.reason])
  )
}

interface ReportOptions {
  error: unknown
  trigger: 'render-error' | 'api-500'
  componentStack?: string
}

export function reportClientError({ error, trigger, componentStack }: ReportOptions) {
  try {
    const e = error as any
    const response = e?.response
    const message = String(e?.message ?? stringify(error))

    // The same failure often triggers several reports (retries, re-renders): send it once.
    const key = `${trigger}:${message}:${e?.config?.url ?? ''}`
    const now = Date.now()
    if (lastReport.key === key && now - lastReport.at < 10_000) return
    lastReport = { key, at: now }

    const user = useAuthStore.getState().auth.user
    const payload = {
      app: 'seller-web',
      trigger,
      name: e?.name,
      message,
      stack: e?.stack,
      code: e?.code,
      componentStack,
      pageUrl: window.location.href,
      referrer: document.referrer,
      apiStatus: response?.status,
      failedRequest: e?.config && {
        method: e.config.method?.toUpperCase(),
        url: e.config.url,
        response: response?.data,
      },
      userEmail: user?.email,
      userRole: Array.isArray(user?.role) ? user?.role.join(',') : user?.role,
      appVersion: import.meta.env.MODE,
      console: buffer,
    }

    // keepalive lets the request finish even if the page navigates right after.
    void fetch(`${import.meta.env.VITE_BASE_URL}/error-log/client`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {})
  } catch {
    // reporting must never cause another error
  }
}
