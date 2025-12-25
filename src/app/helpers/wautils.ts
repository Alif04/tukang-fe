import axios, { type AxiosRequestHeaders } from 'axios'

export interface SendResult {
  status: number
  data: any
}

// Get environment variable with fallback - do not throw at import time
function getEnv(name: string, fallback: string = ''): string {
  const v = (process.env as Record<string, string | undefined>)[name]
  return v && String(v).trim() !== '' ? String(v) : fallback
}

const WA_API_URL = getEnv('REACT_APP_WA_BACKEND_API_URL', 'http://localhost:3001')
export const COMMON_HEADERS: AxiosRequestHeaders = {
  'Content-Type': 'application/json'
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
  const resp = await waAxios.get('whatsapp/health')
  return { status: resp.status, data: resp.data }
}
/**
 * Send a WhatsApp-style message to the API: POST /send-message
 */
export async function sendWaMessage(
  payload: Record<string, any>
): Promise<SendResult> {
  const resp = await waAxios.post('whatsapp/send-message', payload)
  return { status: resp.status, data: resp.data }
}

/**
 * Generate QR: GET /generate-qr -> returns base64 image (or whatever the API returns)
 */
export async function generateQr(): Promise<SendResult> {
  const resp = await waAxios.get('whatsapp/generate-qr')
  return { status: resp.status, data: resp.data }
}

/**
 * Logout: POST /logout
 */
export async function logout(): Promise<SendResult> {
  // Last resort: call /logout
  const resp = await waAxios.post('whatsapp/logout')
  return { status: resp.status, data: resp.data }
}

/**
 * Reinitialize client without removing session: POST /reinit
 */
export async function reinit(): Promise<SendResult> {
  const resp = await waAxios.post('whatsapp//reinit')
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

export default sendWaMessage
