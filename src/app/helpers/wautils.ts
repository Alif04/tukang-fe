import axios, { type AxiosRequestHeaders } from 'axios'

export interface SendResult {
  status: number
  data: any
}

// Enforce required environment variables so configuration must be provided
function requireEnv(name: string): string {
  const v = (process.env as Record<string, string | undefined>)[name]
  if (!v || String(v).trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return String(v)
}

const WA_API_URL = requireEnv('REACT_APP_WA_API_URL')
const AUTH_TYPE = requireEnv('REACT_APP_WA_AUTH_TYPE').trim().toLowerCase()

if (!['basic', 'bearer', 'raw'].includes(AUTH_TYPE)) {
  throw new Error(`Invalid REACT_APP_WA_AUTH_TYPE: ${AUTH_TYPE}. Use one of: basic, bearer, raw`)
}

const CLIENT_ID = AUTH_TYPE === 'basic' ? requireEnv('REACT_APP_WA_CLIENT_ID') : (process.env.REACT_APP_WA_CLIENT_ID || '')
const CLIENT_SECRET = requireEnv('REACT_APP_WA_CLIENT_SECRET')

function buildAuthHeader(): Record<string, string> {
  if (AUTH_TYPE === 'bearer') return { Authorization: `Bearer ${CLIENT_SECRET}` }
  if (AUTH_TYPE === 'raw') return { Authorization: CLIENT_SECRET }
  const token = typeof btoa === 'undefined' ? Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64') : btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
  return { Authorization: `Basic ${token}` }
}

export const COMMON_HEADERS: AxiosRequestHeaders = {
  'Content-Type': 'application/json',
  ...buildAuthHeader(),
}

// Shared axios instance with baseURL and headers to be reused by future functions
export const waAxios = axios.create({
  baseURL: WA_API_URL,
  headers: COMMON_HEADERS,
})

export function getWaHeaders(): AxiosRequestHeaders {
  return COMMON_HEADERS
}

/**
 * Health check: GET /health
 */
export async function healthCheck(): Promise<SendResult> {
  const resp = await waAxios.get('/health')
  return { status: resp.status, data: resp.data }
}

/**
 * Try to connect the WA client by POSTing to common connect endpoints.
 */
export async function connect(): Promise<SendResult> {
  const candidates = ['/connect', '/whatsapp/connect', '/wa/connect']
  let lastErr: any = null
  for (const path of candidates) {
    try {
      const resp = await waAxios.post(path)
      return { status: resp.status, data: resp.data }
    } catch (err: any) {
      lastErr = err
      // try next
    }
  }
  throw lastErr || new Error('Connect failed')
}

/**
 * Send a WhatsApp-style message to the API: POST /send-message
 */
export async function sendWaMessage(
  payload: Record<string, any>
): Promise<SendResult> {
  const resp = await waAxios.post('/send-message', payload)
  return { status: resp.status, data: resp.data }
}

/**
 * Send image/media via multipart to WA backend
 */
export async function sendImage(formData: FormData): Promise<SendResult> {
  const resp = await waAxios.post('/send-image', formData, {
    headers: {
      // let axios set the proper multipart boundary
      'Content-Type': 'multipart/form-data',
    },
  })
  return { status: resp.status, data: resp.data }
}

/**
 * Request QR explicitly: prefer POST /request-qr, fallback to GET /generate-qr
 */
export async function requestQr(): Promise<SendResult> {
  const candidates: { method: 'post' | 'get'; path: string }[] = [
    { method: 'post', path: '/request-qr' },
    { method: 'get', path: '/generate-qr' },
  ]
  let lastErr: any = null
  for (const c of candidates) {
    try {
      const resp = c.method === 'post' ? await waAxios.post(c.path) : await waAxios.get(c.path)
      return { status: resp.status, data: resp.data }
    } catch (err: any) {
      lastErr = err
      // try next
    }
  }
  throw lastErr || new Error('requestQr failed')
}

/**
 * Generate QR: GET /generate-qr -> returns base64 image (or whatever the API returns)
 */
export async function generateQr(): Promise<SendResult> {
  const resp = await waAxios.get('/generate-qr')
  return { status: resp.status, data: resp.data }
}

/**
 * Logout: POST /logout
 */
export async function logout(): Promise<SendResult> {
  // Try common logout paths
  const candidates = ['/logout', '/whatsapp/logout', '/wa/logout', '/whatsapp/disconnect']
  for (const p of candidates) {
    try {
      const resp = await waAxios.post(p)
      return { status: resp.status, data: resp.data }
    } catch (_) {
      // try next
    }
  }
  // Last resort: call /logout
  const resp = await waAxios.post('/logout')
  return { status: resp.status, data: resp.data }
}

/**
 * Reinitialize client without removing session: POST /reinit
 */
export async function reinit(): Promise<SendResult> {
  const resp = await waAxios.post('/reinit')
  return { status: resp.status, data: resp.data }
}

/**
 * Root info: GET /
 */
export async function getRootInfo(): Promise<SendResult> {
  const resp = await waAxios.get('/')
  return { status: resp.status, data: resp.data }
}

export default sendWaMessage
