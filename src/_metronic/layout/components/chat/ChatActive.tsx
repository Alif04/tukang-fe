import React, {useState, useEffect, useRef} from 'react'
import Swal from 'sweetalert2'

interface ChatActiveProps {
  messages: any[]
  message: any
  setMessage: (msg: any) => void
  sendMessage: () => void
}

const ChatActive: React.FC<ChatActiveProps> = ({messages, message, setMessage, sendMessage}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const chatContainerRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          chatContainerRef.current!.scrollTop = chatContainerRef.current!.scrollHeight
        }, 0)
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const fileSizeMB = file.size / (1024 * 1024) // Convert bytes to MB

      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')

      if ((isImage && fileSizeMB > 2) || (isVideo && fileSizeMB > 5)) {
        Swal.fire({
          title: 'Error',
          text: `File terlalu besar! Maksimum ${isImage ? '2MB' : '5MB'}`,
          icon: 'error',
        })
        return
      }

      setMessage({
        type: 'file',
        file: file,
        fileName: file.name,
        fileType: file.type,
      })
    }
  }

  const apiChat = process.env.REACT_APP_WA_BACKEND_API_URL || process.env.REACT_APP_API_CHAT_URL || process.env.REACT_APP_API_URL || ''

  const resolveMedia = (msg: any) => {
    // Determine raw media path from various fields, prefer img.src
    const rawMedia = msg?.img && typeof msg.img === 'object' && msg.img.src
      ? msg.img.src
      : // if img is a simple string path, use it
      (typeof msg?.img === 'string' && msg.img)
      ? msg.img
      : typeof msg.message === 'string' && msg.message.startsWith('http') && msg.message.includes('/uploads/')
      ? msg.message
      : msg?.image || (msg?.images && msg.images[0]) || (msg?.data && (msg.data.image || msg.data.img)) || null

    if (!rawMedia) return null

    const waBase = apiChat || ''

    const resolveMediaUrl = (url: string | null) => {
      if (!url) return null
      if (url.startsWith('http')) return url

      // If it's a received_media path, ensure absolute URL using WA backend
      const matchReceived = url.match(/([^/]*received_media[^/]*)\/?(.*)/i)
      if (matchReceived || url.includes('received_media')) {
        const parts = url.split('/')
        const basename = parts.filter(Boolean).pop() || ''
        const base = waBase ? waBase.replace(/\/$/, '') : ''
        if (base) return `${base}/received_media/${basename}`
        return `/received_media/${basename}`
      }

      // Generic relative path: prefix with apiChat if available
      const base = apiChat ? apiChat.replace(/\/$/, '') : ''
      if (base) return `${base}${url.startsWith('/') ? url : '/' + url}`
      return url
    }

    return resolveMediaUrl(rawMedia)
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div
        ref={chatContainerRef}
        style={{flex: 1, overflowY: 'auto', padding: 10, backgroundColor: '#fff', borderRadius: 8, border: '1px solid #ccc'}}
      >
        {messages && messages.length === 0 && (
          <div style={{textAlign: 'center', color: '#999'}}>Belum ada pesan</div>
        )}

        {messages && messages.map((msg: any, idx: number) => {
          const mediaUrl = resolveMedia(msg)
          const isRight = false
          const filename = (typeof mediaUrl === 'string' && mediaUrl.split('/').pop()) || ''

          return (
            <div key={idx} style={{marginBottom: 12, textAlign: isRight ? 'right' : 'left'}}>
              <div style={{fontSize: 12, color: '#999', marginBottom: 6}}>{msg.sender}</div>
              <div style={{display: 'inline-block', backgroundColor: '#f1f1f1', padding: 10, borderRadius: 8, maxWidth: '70%'}}>
                {mediaUrl ? (
                  /\.(jpeg|jpg|png|gif)$/.test(mediaUrl) ? (
                    <img src={mediaUrl} alt={filename} style={{maxWidth: '100%', borderRadius: 5, cursor: 'pointer'}} onClick={() => setPreviewImage(mediaUrl)} />
                  ) : /\.(mp4|mov|avi)$/.test(mediaUrl) ? (
                    <video controls style={{maxWidth: '100%', borderRadius: 5}}>
                      <source src={mediaUrl} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <a href={mediaUrl} target='_blank' rel='noopener noreferrer'>{filename || mediaUrl}</a>
                  )
                ) : (
                  <span>{msg.message}</span>
                )}
                <div style={{fontSize: 10, color: 'rgba(92,92,92,0.7)', textAlign: 'right', marginTop: 6}}>
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleString('id-ID', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false}) : ''}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{display: 'flex', borderTop: '1px solid #ccc', padding: 10}}>
        <input
          type='text'
          placeholder='Ketik pesan...'
          value={message?.fileName || (typeof message === 'string' ? message : '')}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') sendMessage() }}
          style={{flex: 1, padding: 10, borderRadius: 5, border: '1px solid #ccc'}}
        />
        <input type='file' id='imageUpload' onChange={handleImageChange} accept='image/*,video/*' style={{display: 'none'}} />
        <label htmlFor='imageUpload' style={{cursor: 'pointer', marginLeft: 10, marginTop: 10}}>
          <i className='bi bi-paperclip' style={{fontSize: 20, color: '#007BFF'}}></i>
        </label>
        <button onClick={sendMessage} style={{marginLeft: 10, padding: 10, backgroundColor: '#007BFF', color: 'white', borderRadius: 5, border: 'none'}}>Kirim</button>
      </div>

      {/* Preview modal */}
      {previewImage && (
        <div style={{position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000}} onClick={() => setPreviewImage(null)}>
          <div style={{backgroundColor: 'white', padding: 10, borderRadius: 6, maxWidth: '90%', maxHeight: '90%'}}>
            <img src={previewImage} alt='Preview' style={{width: '100%', height: 'auto'}} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatActive;
