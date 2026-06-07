// 25 MB — samakan dengan BE DEFAULT_MAX_FILE_SIZE + video
const MAX_IMAGE_SIZE_MB = 25
const MAX_DOCUMENT_SIZE_MB = 25
const MAX_VIDEO_SIZE_MB = 25

const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov']
const DOCUMENT_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx']

const sanitizeFileValue = (value?: string | null) => {
  if (!value) return ''

  return value.split('?')[0].split('#')[0].trim().toLowerCase()
}

const getFileExtension = (value?: string | null) => {
  const sanitized = sanitizeFileValue(value)
  const segments = sanitized.split('.')
  return segments.length > 1 ? segments.pop() || '' : ''
}

export const LIVECHAT_UPLOAD_ACCEPT =
  'image/*,video/mp4,video/webm,video/quicktime,.pdf,.doc,.docx,.xls,.xlsx'

export const validateLiveChatUpload = (file: File): string | null => {
  const extension = getFileExtension(file.name)
  const mimeType = file.type.toLowerCase()
  const isImage = mimeType.startsWith('image/')
  const isVideo =
    VIDEO_EXTENSIONS.includes(extension) ||
    ['video/mp4', 'video/webm', 'video/quicktime'].includes(mimeType)
  const isDocument = DOCUMENT_EXTENSIONS.includes(extension)

  if (!isImage && !isVideo && !isDocument) {
    return 'Format file tidak didukung. Gunakan gambar, video MP4/WEBM/MOV, atau dokumen PDF/DOC/DOCX/XLS/XLSX.'
  }

  // Validate size based on type
  let maxSize = MAX_DOCUMENT_SIZE_MB
  let maxSizeLabel = MAX_DOCUMENT_SIZE_MB
  if (isVideo) {
    maxSize = MAX_VIDEO_SIZE_MB
    maxSizeLabel = MAX_VIDEO_SIZE_MB
  } else if (isImage) {
    maxSize = MAX_IMAGE_SIZE_MB
    maxSizeLabel = MAX_IMAGE_SIZE_MB
  }

  if (file.size > maxSize * 1024 * 1024) {
    return `Ukuran file maksimal ${maxSizeLabel} MB.`
  }

  return null
}

export const isLiveChatVideo = (
  type?: 'text' | 'image' | 'file' | 'video',
  fileName?: string,
  fileUrl?: string
) => {
  if (type === 'video') return true

  const extension = getFileExtension(fileName) || getFileExtension(fileUrl)
  return VIDEO_EXTENSIONS.includes(extension)
}
