import React, {useState, useEffect, useRef} from 'react'
import axios from '../../core/axiosInterceptor'
import {Modal} from 'react-bootstrap'
import Swal from 'sweetalert2'

interface Chat {
  _id: string
  members: string[]
  sender: string
}

interface ChatPreviousProps {
  previousChats: Chat[]
  handlePreviousChat: (chatId: string) => void
  handleDeleteChat: (chatId: string) => void
  unreadChats: string[]
  userRole: string
  messages: any
  message: any
  setMessage: (msg: any) => void
  sendMessage: () => void
  fetchNewChats: () => void
  vendorName: string
  storeName: string
  setReciver: any
  groupId?: string // NEW: untuk auto-select chat
  steps?: string // NEW: untuk detect auto-redirect
}
const apiChat = process.env.REACT_APP_WA_BACKEND_API_URL || process.env.REACT_APP_API_CHAT_URL || process.env.REACT_APP_API_URL || ''

/* eslint-disable no-loop-func */
// Helper sleep function to avoid declaring functions inside loops
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Helper to perform GET requests with retry for transient network errors
const fetchWithRetry = async (url: string, retries = 2, delayMs = 1000) => {
  let attempt = 0
  while (attempt <= retries) {
    try {
      const res = await axios.get(url)
      return res
    } catch (err: any) {
      attempt++
      const isNetworkError = !err.response
      console.warn(`Request attempt ${attempt} failed for ${url}:`, err.message || err)
      if (!isNetworkError) throw err
      if (attempt > retries) throw err
      await sleep(delayMs * attempt)
    }
  }
}
const ChatPrevious: React.FC<ChatPreviousProps> = ({
  previousChats,
  handlePreviousChat,
  handleDeleteChat,
  unreadChats,
  userRole,
  messages,
  message,
  setMessage,
  sendMessage,
  vendorName,
  fetchNewChats,
  storeName,
  setReciver,
  groupId, // NEW
  steps, // NEW
}) => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [unreadCounts, setUnreadCounts] = useState<{[key: string]: number}>({}) // Map for unread counts
  const [, setImage] = useState<File | null>(null) // State untuk gambar
  const [latestMessages, setLatestMessages] = useState<{[key: string]: string}>({})
  const chatContainerRef = useRef<HTMLDivElement | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Function to scroll to the bottom of the chat
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
  }, [messages, selectedChat])
  useEffect(() => {
    if (steps === 'autoRedirect' && groupId && previousChats.length > 0) {
      const targetChat = previousChats.find((chat) => chat._id === groupId)
      if (targetChat && selectedChat?._id !== targetChat._id) {
        console.log('Auto-selecting chat:', targetChat._id)
        setSelectedChat(targetChat)

        // Set receiver untuk chat yang auto-selected
        const members = targetChat.members.filter(
          (member: string) =>
            member !==
            (userRole === 'Owner Vendor'
              ? vendorName
              : userRole === 'Super User'
              ? 'Admin HO'
              : userRole === 'Store CS'
              ? storeName
              : userRole)
        )
        setReciver(members)
      }
    }
  }, [steps, groupId, previousChats, selectedChat])
  const fetchUnreadCounts = async () => {
    if (!apiChat) {
      console.error('REACT_APP_API_CHAT_URL not configured')
      return
    }
    const counts: {[key: string]: number} = {}

    for (const chat of previousChats) {
      try {
        const url = `${apiChat.replace(/\/$/, '')}/chat/unread/${chat._id}`
        const res = await fetchWithRetry(url, 2, 1000)
        const unreadArr: any[] = res && res.data && Array.isArray((res.data as any).unreadCount) ? (res.data as any).unreadCount : []
        const unreadMessages = unreadArr.filter((msg: any) =>
          msg.sender !==
          (userRole === 'Owner Vendor'
            ? vendorName
            : userRole === 'Super User'
            ? 'Admin HO'
            : userRole)
        )

        counts[chat._id] = unreadMessages.length || 0
      } catch (err: any) {
        if (err.response) {
          console.error(`Failed to fetch unread count for chat ${chat._id}. URL: ${apiChat}/chat/unread/${chat._id} Status: ${err.response.status}`, err.response.data)
        } else {
          console.error(`Failed to fetch unread count for chat ${chat._id}`, err.message || err)
        }
        counts[chat._id] = 0
      }
    }
    setUnreadCounts(counts)
  }

  const fetchNewChat = async () => {
    if (!apiChat) {
      console.error('REACT_APP_API_CHAT_URL not configured')
      return
    }
    const latest: {[key: string]: string} = {}

    for (const chat of previousChats) {
      try {
        const url = `${apiChat.replace(/\/$/, '')}/chat/messages/${chat._id}`
        const res = await fetchWithRetry(url, 2, 1000)

        if (res && res.data && res.data.length > 0) {
          res.data.forEach((chats: any) => {
            const {groupId, timestamp} = chats
            if (!latest[groupId] || new Date(timestamp) > new Date(latest[groupId])) {
              latest[groupId] = timestamp // Simpan timestamp terbaru untuk setiap grup
            }
          })
        }
      } catch (err: any) {
        if (err.response) {
          console.error(`Failed to fetch new chats for chat ${chat._id}. URL: ${apiChat}/chat/messages/${chat._id} Status: ${err.response.status}`, err.response.data)
        } else {
          console.error('Failed to fetch new chats', err.message || err)
        }
      }
    }
    setLatestMessages(latest)
  }
  // console.log(latestMessages);

  useEffect(() => {
    // Fetch unread messages for each chat

    fetchNewChat()
    fetchUnreadCounts()
    // eslint-disable-next-line
  }, [previousChats])

  const onSelectChat = async (chat: Chat) => {
    const members = chat.members.filter(
      (member: string) =>
        member !==
        (userRole === 'Owner Vendor'
          ? vendorName
          : userRole === 'Super User'
          ? 'Admin HO'
          : userRole === 'Store CS'
          ? storeName
          : userRole)
    )
    setReciver(members)

    setSelectedChat(chat)
    handlePreviousChat(chat._id)
    
    try {
      if (!apiChat) {
        console.error('REACT_APP_API_CHAT_URL not configured')
      } else {
        const sender =
          userRole === 'Owner Vendor'
            ? vendorName
            : userRole === 'Super User'
            ? 'Admin HO'
            : userRole === 'Store CS'
            ? storeName
            : userRole
        await axios.put(`${apiChat}/chat/status/${chat._id}`, { sender })
      }

      fetchNewChats()
      fetchUnreadCounts()
      scrollToBottom()
    } catch (err) {
      console.error('Failed to update chat status:', err)
    }
  }
  const sortedChats = [...previousChats].sort((a, b) => {
    const timestampA = latestMessages[a._id] || '1970-01-01T00:00:00.000Z'
    const timestampB = latestMessages[b._id] || '1970-01-01T00:00:00.000Z'
    return new Date(timestampB).getTime() - new Date(timestampA).getTime()
  })
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0])

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
        // alert(`File terlalu besar! Maksimum ${isImage ? "2MB" : "5MB"}`);
        return
      }
      // Simpan file ke dalam setMessage
      setMessage({
        type: 'file',
        file: file,
        fileName: file.name,
        fileType: file.type,
      })
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '900px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
      }}
    >
      {/* Sidebar Chat List */}
      <div
        style={{
          width: '40%',
          borderRight: '1px solid #ccc',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          padding: '10px',
        }}
      >
        <h4 style={{margin: '0 0 10px', color: '#333'}}>Daftar Chat</h4>
        {previousChats.length === 0 ? (
          <div style={{textAlign: 'center', color: '#999', fontSize: '14px'}}>
            Tidak ada chat sebelumnya.
          </div>
        ) : (
          <div style={{marginTop: 10}}>
            {sortedChats.map((chat) => {
              return (
                <div
                  key={chat._id}
                  style={{
                    position: 'relative',
                    marginBottom: '10px',
                  }}
                >
                  <button
                    onClick={() => onSelectChat(chat)}
                    style={{
                      width: '100%',
                      padding: '15px',
                      backgroundColor: selectedChat?._id === chat._id ? '#1f70f2' : '#f7f7f7',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      textAlign: 'left',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{color: selectedChat?._id === chat._id ? 'white' : '#333', fontWeight: '500'}}>
                      {chat.members && chat.members.length > 0
                        ? chat.members.join(', ')
                        : 'No members'}
                    </span>
                    {/* Unread count */}
                    {unreadCounts[chat._id] > 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '0px',
                          right: '2px',
                          backgroundColor: 'red',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '50%',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                      >
                        {unreadCounts[chat._id]}
                      </span>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Active Chat Section - IMPORTANT: Selalu tampilkan jika selectedChat ada */}
      {selectedChat && (
        <div
          style={{
            flex: 1,
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f9f9f9',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <h4 style={{margin: 0, color: '#333'}}>
              Chat dengan {selectedChat.members.join(', ')}
            </h4>
            <div
              style={{
                position: 'relative',
                display: 'inline-block',
              }}
            >
              {(userRole === 'Admin HO' || userRole === 'Super User') && (
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                  }}
                  onClick={() => {
                    handleDeleteChat(selectedChat._id)
                    setSelectedChat(null)
                  }}
                >
                  <i className='bi bi-trash'></i>
                </button>
              )}
            </div>
          </div>
          
          {/* Chat Messages Container */}
          <div
            ref={chatContainerRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
              backgroundColor: 'white',
            }}
          >
            {messages.length === 0 ? (
              <div style={{textAlign: 'center', color: '#999', paddingTop: '20px'}}>
                Belum ada pesan dalam chat ini.
              </div>
            ) : (
              messages.map((msg: any, idx: any) => (
                <div
                  key={idx}
                  style={{
                    textAlign:
                      msg.sender === (userRole === 'Super User' ? 'Admin HO' : userRole) ||
                      msg.sender === vendorName ||
                      msg.sender === storeName
                        ? 'right'
                        : 'left',
                    marginBottom: '10px',
                  }}
                >
                  {/* Nama pengirim */}
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#999',
                      marginBottom: '5px',
                    }}
                  >
                    {msg.sender === (userRole === 'Super User' ? 'Admin HO' : userRole)
                      ? userRole === 'Super User'
                        ? 'Admin HO'
                        : userRole
                      : msg.sender}
                  </div>

                {/* Kotak pesan */}
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor:
                      msg.sender === (userRole === 'Super User' ? 'Admin HO' : userRole) ||
                      msg.sender === vendorName ||
                      msg.sender === storeName
                        ? '#e0f7fa'
                        : '#f1f1f1',
                    color:
                      msg.sender === (userRole === 'Super User' ? 'Admin HO' : userRole) ||
                      msg.sender === vendorName ||
                      msg.sender === storeName
                        ? '#333'
                        : '#333',
                    padding: '10px',
                    borderRadius: '8px',
                    maxWidth: '60%',
                    wordBreak: 'break-word',
                    position: 'relative',
                  }}
                >
                  {(() => {
                    const rawMedia =
                      // If conversation detail contains an img object with a src property, prefer that
                      msg?.img && typeof msg.img === 'object' && msg.img.src
                        ? msg.img.src
                        : // if img is a simple string path (e.g. "/received_media/.."), use it
                        typeof msg?.img === 'string' && msg.img
                        ? msg.img
                        : typeof msg.message === 'string' && msg.message.startsWith('http') && msg.message.includes('/uploads/')
                        ? msg.message
                        : msg?.image || (msg?.images && msg.images[0]) || (msg?.data && (msg.data.image || msg.data.img)) || null

                    const waBase = process.env.REACT_APP_WA_BACKEND_API_URL || apiChat || ''

                    const resolveMediaUrl = (url: string | null) => {
                      if (!url) return null
                      // If url already absolute
                      if (url.startsWith('http')) return url

                      // If it's a received_media path or contains received_media, extract basename and build full WA backend URL
                      const matchReceived = url.match(/([^/]*received_media[^/]*)\/?(.*)/i)
                      if (matchReceived || url.includes('received_media')) {
                        const parts = url.split('/')
                        const basename = parts.filter(Boolean).pop() || ''
                        const base = waBase ? waBase.replace(/\/$/, '') : ''
                        if (base) return `${base}/received_media/${basename}`
                        return `/received_media/${basename}`
                      }

                      // Generic relative path
                      const base = apiChat ? apiChat.replace(/\/$/, '') : ''
                      if (base) return `${base}${url.startsWith('/') ? url : '/' + url}`
                      return url
                    }

                    const mediaUrl = resolveMediaUrl(rawMedia)

                    const extractFilename = (u: string | null) => {
                      if (!u) return ''
                      try {
                        const p = u.split('/').pop() || u
                        return p
                      } catch (e) {
                        return u
                      }
                    }

                    const filename = extractFilename(rawMedia)

                    // Console diagnostics to help debug missing images
                    try {
                      console.info('[ChatPrevious] media detection', { rawMedia, mediaUrl, filename, msgId: msg?.id })
                    } catch (e) {
                      // ignore logging errors
                    }

                    if (mediaUrl) {
                      if (/\.(jpeg|jpg|png|gif)$/.test(mediaUrl)) {
                        // Component to try fallback URLs if the first fails (CORS, wrong base, path differences)
                        const ImageWithFallback: React.FC<{
                          initialUrl: string
                          raw: string | null
                          filename?: string
                        }> = ({initialUrl, raw, filename}) => {
                          const [src, setSrc] = useState(initialUrl)
                          const [attempt, setAttempt] = useState(0)

                          const tryNext = () => {
                            const waBase = process.env.REACT_APP_WA_BACKEND_API_URL || apiChat || ''
                            const baseNoWaApi = waBase.replace(/\/wa-api\/?$/, '')
                            const alternatives: string[] = []

                            // Attempt 1: base/received_media/basename (what we did already)
                            // Attempt 2: base + raw path (if raw provided)
                            if (raw) {
                              if (raw.startsWith('/')) alternatives.push((waBase ? waBase.replace(/\/$/, '') : '') + raw)
                              else alternatives.push((waBase ? waBase.replace(/\/$/, '') : '') + '/' + raw)
                            }

                            // Attempt 3: use base without /wa-api + /received_media/basename
                            const basename = (raw || initialUrl).split('/').filter(Boolean).pop() || ''
                            if (baseNoWaApi) alternatives.push(`${baseNoWaApi}/received_media/${basename}`)

                            // Attempt 4: try the raw path directly (relative)
                            if (raw) alternatives.push(raw)

                            const next = alternatives[attempt]
                            if (next) {
                              console.warn('Image load failed, trying fallback URL:', next)
                              setSrc(next)
                              setAttempt((a) => a + 1)
                            }
                          }

                          return (
                            <>
                              <img
                                src={src}
                                alt={filename || 'Uploaded File'}
                                style={{maxWidth: '100%', borderRadius: '5px'}}
                                onClick={() => setPreviewImage(src)}
                                onError={() => {
                                  if (attempt < 4) tryNext()
                                  else console.error('Image failed to load after fallbacks:', src)
                                }}
                              />
                              {filename && (
                                <div style={{fontSize: '12px', color: '#666', marginTop: '6px'}}>{filename}</div>
                              )}
                            </>
                          )
                        }

                        return <ImageWithFallback initialUrl={mediaUrl} raw={rawMedia} filename={filename} />
                      } else if (/\.(mp4|mov|avi)$/.test(mediaUrl)) {
                        return (
                          <>
                            <video controls style={{maxWidth: '100%', borderRadius: '5px'}}>
                              <source src={mediaUrl} />
                              Your browser does not support the video tag.
                            </video>
                            {filename && (
                              <div style={{fontSize: '12px', color: '#666', marginTop: '6px'}}>{filename}</div>
                            )}
                          </>
                        )
                      }

                      return (
                        <a href={mediaUrl} target='_blank' rel='noopener noreferrer'>
                          {filename || mediaUrl}
                        </a>
                      )
                    }

                    return msg.message
                  })()}
                  {/* Timestamp */}
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'rgba(92, 92, 92, 0.7)',
                      textAlign: 'right',
                      marginTop: '5px',
                    }}
                  >
                    {new Date(msg.timestamp).toLocaleString('id-ID', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </div>
                </div>
                {previewImage && (
                  <Modal show={!!previewImage} onHide={() => setPreviewImage(null)} centered>
                    <Modal.Body>
                      <img src={previewImage} alt='Preview' style={{width: '100%'}} />
                    </Modal.Body>
                  </Modal>
                )}
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div
            style={{
              display: 'flex',
              marginTop: '10px',
            }}
          >
            <input
              type='text'
              placeholder='Ketik pesan...'
              value={message?.fileName || (typeof message === 'string' ? message : '')}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage()
                }
              }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
            />
            <input
              type='file'
              id='imageUpload'
              onChange={handleImageChange}
              accept='image/*,video/*'
              style={{display: 'none'}}
            />

            <label
              htmlFor='imageUpload'
              style={{cursor: 'pointer', marginLeft: '10px', marginTop: 10}}
            >
              <i className='bi bi-paperclip' style={{fontSize: '20px', color: '#007BFF'}}></i>
            </label>
            <button
              onClick={sendMessage}
              style={{
                marginLeft: '10px',
                padding: '10px',
                backgroundColor: '#007BFF',
                color: 'white',
                borderRadius: '5px',
                border: 'none',
              }}
            >
              Kirim
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatPrevious
