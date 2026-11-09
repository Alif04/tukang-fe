import apiClient from '../../services/apiClient'
import {
  AiSkillId,
  AiSkillDefinition,
  TemporalContext,
} from './skills/types'
import {
  AI_SKILLS,
  buildMasterSystemPrompt,
  detectSkillFromPrompt,
} from './skills/skillRegistry'
import { formatTanggalIndonesia, getTemporalContext } from './skills/domainKnowledge'
import {
  classifyIntent,
  detectRequestedFormat,
  DocFormat,
  isRevisionPrompt,
  parseAiReply,
  ParsedAiDoc,
  PromptIntent,
  stripDokumenBlocksForHistory,
} from './aiReplyParser'

export {
  AI_SKILLS,
  classifyIntent,
  detectRequestedFormat,
  detectSkillFromPrompt,
  formatTanggalIndonesia,
  getTemporalContext,
  isRevisionPrompt,
  parseAiReply,
  stripDokumenBlocksForHistory,
}
export type { AiSkillId, AiSkillDefinition, DocFormat, ParsedAiDoc, PromptIntent, TemporalContext }

export type AiEngineMode =
  | '9router-gemini'
  | 'deepseek-deploy'
  | 'claude-free'
  | 'claude-api'
  | 'local-analyst'

export interface AiSettings {
  engineMode: AiEngineMode
  activeSkillId: AiSkillId
  nineRouterModel: string
  deployModel: string
  reasoningEffort: 'none' | 'low' | 'high' | 'max'
  temperature: number
  topP: number
  cachePreference: number
  anthropicModel: string
  autoSyncContext: boolean
}

export interface TokenUsageInfo {
  promptTokens: number
  completionTokens: number
  reasoningTokens: number
  cachedTokens: number
  totalTokens: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  docs?: ParsedAiDoc[]
  reasoningContent?: string
  usage?: TokenUsageInfo
  timestamp: string
  modelLabel?: string
  dataUsed?: string[]
}

export interface ChatSession {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: ChatMessage[]
}

export const AI_STORAGE_PREFIX = 'mitra10_ai_assistant_'
const LEGACY_SETTINGS_KEY = 'mitra10_ai_assistant_settings_v1'
const LEGACY_SESSIONS_KEY = 'mitra10_ai_assistant_sessions_v1'

export const MAX_SAVED_SESSIONS = 30
export const MAX_STORED_DOC_MARKDOWN_CHARS = 12000

const API_KEY_FIELDS = [
  'apiKey',
  'nineRouterApiKey',
  'deployApiKey',
  'anthropicApiKey',
  'openRouterApiKey',
  'nineRouterBaseUrl',
  'deployBaseUrl',
] as const

export function getActiveUserStorageId(explicitUserId?: string | number | null): string | null {
  if (explicitUserId !== undefined && explicitUserId !== null && String(explicitUserId).trim() !== '') {
    return String(explicitUserId).trim()
  }
  if (typeof window === 'undefined' || !window.localStorage) return null
  const directId = localStorage.getItem('user_id') || localStorage.getItem('username')
  if (directId && directId.trim()) return directId.trim()

  const token = localStorage.getItem('accessToken')
  if (token && token.includes('.')) {
    try {
      const payloadPart = token.split('.')[1]
      const decoded = JSON.parse(atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/')))
      if (decoded?.id || decoded?.sub || decoded?.username) {
        const extracted = String(decoded.id ?? decoded.sub ?? decoded.username).trim()
        if (extracted) return extracted
      }
    } catch {
      return null
    }
  }
  return null
}

export function getSettingsStorageKey(userId?: string | number | null): string | null {
  const uid = getActiveUserStorageId(userId)
  return uid ? `${LEGACY_SETTINGS_KEY}_${uid}` : null
}

export function getSessionsStorageKey(userId?: string | number | null): string | null {
  const uid = getActiveUserStorageId(userId)
  return uid ? `${LEGACY_SESSIONS_KEY}_${uid}` : null
}

function stripSensitiveSettingsFields(rawObj: Record<string, any>): Record<string, any> {
  const cleaned: Record<string, any> = { ...rawObj }
  API_KEY_FIELDS.forEach((field) => {
    delete cleaned[field]
  })
  return cleaned
}

export function purgeOtherUsersAiStorage(explicitUserId?: string | number | null): void {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    const activeUid = getActiveUserStorageId(explicitUserId)
    const allowedSettingsKey = activeUid ? `${LEGACY_SETTINGS_KEY}_${activeUid}` : null
    const allowedSessionsKey = activeUid ? `${LEGACY_SESSIONS_KEY}_${activeUid}` : null

    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (!key.startsWith(AI_STORAGE_PREFIX)) return

      if (!activeUid || (key !== allowedSettingsKey && key !== allowedSessionsKey)) {
        localStorage.removeItem(key)
        return
      }

      if (key === allowedSettingsKey) {
        try {
          const raw = localStorage.getItem(key)
          if (!raw) return
          const parsed = JSON.parse(raw)
          if (parsed && typeof parsed === 'object') {
            const hasSensitiveField = API_KEY_FIELDS.some((k) => k in parsed)
            if (hasSensitiveField) {
              localStorage.setItem(key, JSON.stringify(stripSensitiveSettingsFields(parsed)))
            }
          }
        } catch {
          localStorage.removeItem(key)
        }
      }
    })
  } catch {
    // Ignore storage access errors
  }
}

export function sanitizeLegacyAiLocalStorage(explicitUserId?: string | number | null): void {
  purgeOtherUsersAiStorage(explicitUserId)
}

export function clearAllAiAssistantStorage(): void {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith(AI_STORAGE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  } catch {
    // Ignore storage errors
  }
}

export function cleanLatexAndMathFormatting(text: string): string {
  if (!text) return ''
  return text
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/?(?:b|i|u|p|div|span|strong|em|table|tr|td|th|ul|ol|li|h[1-6]|blockquote|code|pre|hr)[^>]*>/gi, '')
    .replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0400-\u04FF\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF\u0590-\u05FF\u0900-\u097F\u0E00-\u0E7F]+/g, '')
    .replace(/\$\s*\\rightarrow\s*\$/gi, '→')
    .replace(/\\rightarrow\b/gi, '→')
    .replace(/\$\s*\\to\s*\$/gi, '→')
    .replace(/\\to\b/gi, '→')
    .replace(/\$\s*\\Rightarrow\s*\$/gi, '⇒')
    .replace(/\\Rightarrow\b/gi, '⇒')
    .replace(/\$\s*\\leftarrow\s*\$/gi, '←')
    .replace(/\\leftarrow\b/gi, '←')
    .replace(/\$\s*\\le\s*\$/gi, '≤')
    .replace(/\\le\b/gi, '≤')
    .replace(/\$\s*\\ge\s*\$/gi, '≥')
    .replace(/\\ge\b/gi, '≥')
    .replace(/\$\s*\\times\s*\$/gi, '×')
    .replace(/\\times\b/gi, '×')
    .replace(/\$\s*([a-zA-Z0-9_\- +*/=]+)\s*\$/g, '$1')
}

export const DEFAULT_AI_SETTINGS: AiSettings = {
  engineMode: '9router-gemini',
  activeSkillId: 'auto',
  nineRouterModel: 'ag/gemini-3-flash',
  deployModel: 'deepseek-ai/deepseek-v4.1-flash-1017',
  reasoningEffort: 'high',
  temperature: 0.3,
  topP: 1,
  cachePreference: 8,
  anthropicModel: 'claude-3-5-sonnet-latest',
  autoSyncContext: true,
}

export function loadAiSettings(userId?: string | number | null): AiSettings {
  purgeOtherUsersAiStorage(userId)
  try {
    const key = getSettingsStorageKey(userId)
    if (!key) return { ...DEFAULT_AI_SETTINGS }
    const raw = localStorage.getItem(key)
    if (!raw) return { ...DEFAULT_AI_SETTINGS }
    const parsed = stripSensitiveSettingsFields(JSON.parse(raw))
    const validSkillId: AiSkillId =
      parsed?.activeSkillId && AI_SKILLS[parsed.activeSkillId as AiSkillId]
        ? (parsed.activeSkillId as AiSkillId)
        : 'auto'
    const sanitized: AiSettings = {
      ...DEFAULT_AI_SETTINGS,
      ...parsed,
      activeSkillId: validSkillId,
    }
    localStorage.setItem(key, JSON.stringify(sanitized))
    return sanitized
  } catch {
    return { ...DEFAULT_AI_SETTINGS }
  }
}

export function saveAiSettings(settings: AiSettings, userId?: string | number | null): void {
  purgeOtherUsersAiStorage(userId)
  const key = getSettingsStorageKey(userId)
  if (!key) return
  const clean = stripSensitiveSettingsFields(settings as Record<string, any>)
  localStorage.setItem(key, JSON.stringify(clean))
}

function capSessionDocsMarkdown(sessions: ChatSession[]): ChatSession[] {
  return sessions.slice(0, MAX_SAVED_SESSIONS).map((sess) => ({
    ...sess,
    messages: (sess.messages || []).map((msg) => ({
      ...msg,
      docs: Array.isArray(msg.docs)
        ? msg.docs.map((doc) => {
            const isOverLimit =
              typeof doc.markdown === 'string' && doc.markdown.length > MAX_STORED_DOC_MARKDOWN_CHARS
            const isTruncated = Boolean(doc.truncated) || isOverLimit
            return {
              ...doc,
              markdown: isOverLimit
                ? doc.markdown.slice(0, MAX_STORED_DOC_MARKDOWN_CHARS)
                : doc.markdown,
              ...(isTruncated ? { truncated: true } : {}),
            }
          })
        : msg.docs,
    })),
  }))
}

export function loadChatSessions(userId?: string | number | null): ChatSession[] {
  purgeOtherUsersAiStorage(userId)
  try {
    const key = getSessionsStorageKey(userId)
    if (!key) return []
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? capSessionDocsMarkdown(parsed) : []
  } catch {
    return []
  }
}

export function saveChatSessions(sessions: ChatSession[], userId?: string | number | null): void {
  purgeOtherUsersAiStorage(userId)
  const key = getSessionsStorageKey(userId)
  if (!key) return
  const working = [...capSessionDocsMarkdown(sessions)]

  while (working.length > 0) {
    try {
      localStorage.setItem(key, JSON.stringify(working))
      return
    } catch (err: any) {
      const isQuotaError =
        err?.name === 'QuotaExceededError' ||
        err?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        err?.code === 22 ||
        err?.code === 1014
      if (isQuotaError && working.length > 1) {
        working.pop()
        continue
      }
      if (isQuotaError && working.length === 1) {
        working[0] = {
          ...working[0],
          messages: working[0].messages.slice(-4).map((m) => ({
            ...m,
            docs: m.docs?.map((d) => ({
              ...d,
              markdown: d.markdown.slice(0, 2000),
              ...(d.markdown.length > 2000 || d.truncated ? { truncated: true } : {}),
            })),
          })),
        }
        try {
          localStorage.setItem(key, JSON.stringify(working))
        } catch {
          // Give up if even 1 minimal session cannot fit
        }
      }
      return
    }
  }

  try {
    localStorage.setItem(key, '[]')
  } catch {
    // Ignore
  }
}

const TEST_DATA_PATTERN = /(\bSP_TEST|\bSP_ORDER_RULE_|\bDUMMY\b|^TEST[-_\s]|_TEST\b)/i

export function isTestRecord(row: any): boolean {
  if (!row || typeof row !== 'object') return false
  const candidateStrings = [
    row.company_name,
    row.vendor_name,
    row.name,
    row.code,
    row.order_code,
    row.wo_code,
    row.complaint_code,
    row.customer_name,
    row.description,
    row.notes,
    row.rule_code,
    row.sp_code,
    row.vendor?.company_name,
    row.vendor?.vendor_name,
    row.vendor?.name,
    row.customer?.name,
  ]
  return candidateStrings.some((val) => {
    if (typeof val !== 'string') return false
    const trimmed = val.trim()
    return (
      TEST_DATA_PATTERN.test(trimmed) ||
      /^(SP_TEST|TEST|DUMMY|SP_ORDER_RULE_)/i.test(trimmed)
    )
  })
}

export function buildSanitizedHistory(
  history: ChatMessage[],
  userPrompt: string
): Array<{ role: 'user' | 'assistant'; content: string }> {
  const recent = history.slice(-6)
  const keepLastDoc = isRevisionPrompt(userPrompt)

  let lastDocIdx = -1
  if (keepLastDoc) {
    for (let i = recent.length - 1; i >= 0; i--) {
      const m = recent[i]
      if (
        m.role === 'assistant' &&
        ((m.docs && m.docs.length > 0) || /<dokumen\b/i.test(m.content || ''))
      ) {
        lastDocIdx = i
        break
      }
    }
  }

  return recent.map((m, idx) => {
    if (keepLastDoc && idx === lastDocIdx) {
      const base = stripDokumenBlocksForHistory(m.content || '')
      if (m.docs && m.docs.length > 0) {
        const fullDocs = m.docs
          .map(
            (d) =>
              `<dokumen format="${d.format}" judul="${d.title}">\n${d.markdown}\n</dokumen>`
          )
          .join('\n\n')
        return {
          role: m.role,
          content: `${base}\n\n${fullDocs}`.trim(),
        }
      }
      return {
        role: m.role,
        content: (m.content || '').trim(),
      }
    }

    const base = stripDokumenBlocksForHistory(m.content || '')
    if (m.docs && m.docs.length > 0) {
      const placeholders = m.docs
        .map((d) => `[Dokumen "${d.title}" (${d.format.toUpperCase()}) telah dibuat]`)
        .join(' ')
      return {
        role: m.role,
        content: `${base}\n${placeholders}`.trim(),
      }
    }
    return {
      role: m.role,
      content: base,
    }
  })
}

export interface AiReplyResult {
  text: string
  reasoningContent?: string
  usage?: TokenUsageInfo
  modelLabel: string
  dataUsed: string[]
  meta?: any
}

export async function sendAiReportMessage(params: {
  sessionId?: string
  history: ChatMessage[]
  userPrompt: string
  settings: AiSettings
}): Promise<AiReplyResult> {
  const { sessionId = `chat-${Date.now()}`, history, userPrompt, settings } = params
  const { effectiveSkill, requestedFormat } = buildMasterSystemPrompt({
    activeSkillId: settings.activeSkillId || 'auto',
    userPrompt,
  })

  const sanitizedHistory = buildSanitizedHistory(history, userPrompt)

  const isDeploy = settings.engineMode === 'deepseek-deploy'
  const model = isDeploy
    ? settings.deployModel || 'deepseek-ai/deepseek-v4.1-flash-1017'
    : settings.nineRouterModel || 'ag/gemini-3-flash'

  const relayRes = await apiClient.post('/reports/ai-chat', {
    sessionId,
    userPrompt,
    history: sanitizedHistory,
    activeSkillId: settings.activeSkillId || 'auto',
    requestedFormat,
    engineMode: settings.engineMode,
    model,
    temperature: Math.min(1, Math.max(0, Number(settings.temperature ?? 0.3))),
    topP: settings.topP ?? 1,
    reasoningEffort: settings.reasoningEffort || 'high',
  })

  const rawData = relayRes.data?.data ?? relayRes.data
  const data = rawData?.data && rawData?.content === undefined ? rawData.data : rawData
  const messageObj = data?.choices?.[0]?.message
  const replyText =
    data?.content ||
    messageObj?.content ||
    'Tidak ada respons dari server AI Report Assistant.'
  const reasoningContent =
    data?.reasoningContent || messageObj?.reasoning_content || undefined

  const meta = data?.aiMeta ?? data?.meta ?? relayRes.data?.meta
  const usage: TokenUsageInfo | undefined = data?.usage
    ? {
        promptTokens: data.usage.prompt_tokens ?? meta?.promptTokensEstimate ?? 0,
        completionTokens: data.usage.completion_tokens ?? 0,
        totalTokens: data.usage.total_tokens ?? meta?.promptTokensEstimate ?? 0,
        cachedTokens: data.usage.prompt_tokens_details?.cached_tokens ?? 0,
        reasoningTokens: data.usage.completion_tokens_details?.reasoning_tokens ?? 0,
      }
    : meta?.promptTokensEstimate
    ? {
        promptTokens: meta.promptTokensEstimate,
        completionTokens: 0,
        totalTokens: meta.promptTokensEstimate,
        cachedTokens: 0,
        reasoningTokens: 0,
      }
    : undefined

  const dataUsed: string[] = [
    meta?.skillName || effectiveSkill.shortLabel,
    ...(meta?.period?.label ? [`Periode: ${meta.period.label}`] : []),
    ...(Array.isArray(meta?.reportsFetched)
      ? meta.reportsFetched.map(
          (r: any) => `${r.key} (${r.ditampilkan}/${r.total})`
        )
      : []),
    ...(Array.isArray(meta?.unavailableRequested) &&
    meta.unavailableRequested.length > 0
      ? ['Status: Belum Tersedia (Fase 2)']
      : []),
  ]

  return {
    text: cleanLatexAndMathFormatting(replyText),
    reasoningContent,
    usage,
    modelLabel: `${data?.model || model} [${meta?.skillId || effectiveSkill.shortLabel}]`,
    dataUsed,
    meta,
  }
}
